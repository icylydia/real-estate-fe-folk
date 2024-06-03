<script setup lang="ts">
import { computed, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { QTableProps, useQuasar } from 'quasar';
import { EntrustContractManagementFeeBase, RentalContractRegularIncome } from 'src/api';
import { usePayment } from 'src/utils/payment';
import { useEntrustContract } from 'src/utils/entrust-contract';
import { useManagementFeeStore } from 'stores/management-fee-store';
import useErrorHandler from 'components/app/useErrorHandler';
import ManagementFeeDialog from 'components/contract/ManagementFeeDialog.vue';

const loading = ref(false);
const managementFees = computed(() => useContractStore().entrustContractFormModel.managementFees ?? [])
const { describeIncomeCategory } = usePayment();
const { benefitTypeToChipProps } = useEntrustContract();
const { toastHandler } = useErrorHandler();
const $q = useQuasar();

const columns: QTableProps['columns'] = [
  {
    name: 'incomeCategory',
    label: 'カテゴリ',
    field: 'incomeCategory',
    align: 'left',
    sortable: false,
  },
  {
    name: 'benefitType',
    label: '収益種別',
    field: 'benefitType',
    align: 'left',
  },
  {
    name: 'benefit',
    label: '収益',
    field: 'benefit',
    align: 'right',
    sortable: false,
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'right',
    sortable: false,
  },
];

const {
  resetModel,
  createManagementFee,
  updateManagementFee,
  deleteManagementFee,
} = useManagementFeeStore();
const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');

const showAddingDialog = () => {
  resetModel();
  dialogMode.value = 'add';
  showDialog.value = true;
};

const editRow = async (row: EntrustContractManagementFeeBase) => {
  resetModel(row);
  dialogMode.value = 'edit';
  showDialog.value = true;
};

const removeRow = (row: EntrustContractManagementFeeBase) => {
  $q.dialog({
    title: '削除確認',
    message: `管理費用「${describeIncomeCategory(row.incomeCategory)}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!row.id) {
      return;
    }
    loading.value = true;
    try {
      await deleteManagementFee(row.id.toString());
      useContractStore().removeManagementFee(row.id);
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  });
};

const handleDialogSubmit = async (data: EntrustContractManagementFeeBase) => {
  if (dialogMode.value === 'add') {
    // handle create
    const contractId = useContractStore().entrustContractFormModel.id;
    const contractIdInt = contractId ? parseInt(contractId) : undefined;
    if (!contractIdInt) {
      await toastHandler(new Error('契約情報がありません'));
      return;
    }
    loading.value = true;
    try {
      const payload = {
        ...data,
        entrustContractId: contractIdInt,
      };
      const created = await createManagementFee(payload);
      useContractStore().appendManagementFee(created);
      showDialog.value = false;
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  } else {
    // handle update
    if (!data.id) {
      await toastHandler(new Error('更新対象のIDがありません'));
      return;
    }
    loading.value = true;
    try {
      const updated = await updateManagementFee(data.id.toString(), data);
      useContractStore().replaceManagementFee(updated);
      showDialog.value = false;
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  }
};
</script>

<template>
  <q-table
    flat
    :rows="managementFees"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
    :loading="loading"
  >
    <template #top-left>
      <div class="text-h6">賃貸管理費用一覧</div>
    </template>
    <template #top-right>
      <q-btn
        label="追加"
        color="primary"
        class="float-right text-capitalize shadow-3"
        icon="sym_r_add"
        @click="showAddingDialog()"
        :disable="loading"
      />
    </template>
    <template #[`body-cell-incomeCategory`]="{ row }: { row: EntrustContractManagementFeeBase }">
      <q-td>
        {{ describeIncomeCategory(row.incomeCategory) }}
      </q-td>
    </template>
    <template #[`body-cell-benefitType`]="{ row }: { row: EntrustContractManagementFeeBase }">
      <q-td>
        <q-chip
          v-bind="benefitTypeToChipProps(row.benefitType)"
        />
      </q-td>
    </template>
    <template #[`body-cell-benefit`]="{ row }: { row: EntrustContractManagementFeeBase }">
      <q-td class="text-right">
        {{ $filters.percentage(row.percentage) }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ row }: { row: RentalContractRegularIncome }">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editRow(row)"/>
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeRow(row)"/>
      </q-td>
    </template>
  </q-table>
  <management-fee-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>
