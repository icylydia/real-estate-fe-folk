<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { useRegularIncomeStore } from 'stores/regular-income-store';
import RegularIncomeDialog from 'components/contract/RegularIncomeDialog.vue';
import { RentalContractRegularIncome } from 'src/api';
import { usePayment } from 'src/utils/payment';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const incomes = computed(() => useContractStore().rentalContractFormModel.regularIncomes ?? [])
const { describeIncomeCategory } = usePayment();
const { toastHandler } = useErrorHandler();
const $q = useQuasar();

const columns: QTableProps['columns'] = [
  {
    name: 'category',
    label: 'カテゴリ',
    field: 'category',
    align: 'left',
    sortable: false,
  },
  {
    name: 'targetMonths',
    label: '月',
    field: 'targetMonths',
    align: 'right',
    sortable: false,
  },
  {
    name: 'targetDay',
    label: '日',
    field: 'targetDay',
    align: 'right',
    sortable: false,
  },
  {
    name: 'amount',
    label: '金額',
    field: 'amount',
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
  createRegularIncome,
  updateRegularIncome,
  deleteRegularIncome,
} = useRegularIncomeStore();
const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');

const showAddingDialog = () => {
  resetModel();
  dialogMode.value = 'add';
  showDialog.value = true;
};

const editIncome = (income: RentalContractRegularIncome) => {
  resetModel(income);
  dialogMode.value = 'edit';
  showDialog.value = true;
};

const removeIncome = async (income: RentalContractRegularIncome) => {
  $q.dialog({
    title: '削除確認',
    message: `経常支出「${describeIncomeCategory(income.category)}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!income.id) return;
    loading.value = true;
    try {
      await deleteRegularIncome(income.id.toString());
      useContractStore().removeRegularIncome(income.id);
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  });
};

const handleDialogSubmit = async (value: RentalContractRegularIncome) => {
  if (dialogMode.value === 'add') {
    // handle create
    const contractIdStr = useContractStore().rentalContractFormModel.id;
    const rentalContractId = contractIdStr ? parseInt(contractIdStr) : undefined;
    if (!rentalContractId) {
      await toastHandler('契約情報がありません');
      return;
    }
    loading.value = true;
    try {
      const payload = {
        ...value,
        rentalContractId,
      };
      const created = await createRegularIncome(payload);
      useContractStore().appendRegularIncome(created);
      showDialog.value = false;
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  } else {
    // handle update
    loading.value = true;
    const incomeId = value.id;
    if (!incomeId) {
      await toastHandler('収入情報がありません');
      return;
    }
    try {
      const updated = await updateRegularIncome(incomeId.toString(), value);
      useContractStore().replaceRegularIncome(updated);
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
    :rows="incomes"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
    :loading="loading"
  >
    <template #top-left>
      <div class="text-h6">経常収入一覧</div>
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
    <template #[`body-cell-category`]="{ row }: { row: RentalContractRegularIncome }">
      <q-td>
        {{ describeIncomeCategory(row.category) }}
      </q-td>
    </template>
    <template #[`body-cell-targetMonths`]="{ row }: { row: RentalContractRegularIncome }">
      <q-td class="text-right" v-if="row.targetMonths?.length == 12">
        毎月
      </q-td>
      <q-td class="text-right" v-else>
        {{ row.targetMonths?.join(', ') }}
      </q-td>
    </template>
    <template #[`body-cell-targetDay`]="{ row }: { row: RentalContractRegularIncome }">
      <q-td class="text-right" v-if="row.targetDay == 'firstDay'">
        月初
      </q-td>
      <q-td class="text-right" v-else-if="row.targetDay == 'lastDay'">
        月末
      </q-td>
      <q-td class="text-right" v-else>
        {{ row.targetDay }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ row }: { row: RentalContractRegularIncome }">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editIncome(row)"/>
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeIncome(row)"/>
      </q-td>
    </template>
  </q-table>
  <regular-income-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>
