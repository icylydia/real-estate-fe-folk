<script setup lang="ts">
import type { QTableProps } from 'quasar';
import { useQuasar } from 'quasar';
import type { RegularExpenseBase } from 'src/api';
import { useBuildingStore } from 'stores/building-store';
import { computed, ref } from 'vue';
import { usePayment } from 'src/utils/payment';
import RegularExpenseDialog from 'components/building/RegularExpenseDialog.vue';
import { useRegularExpenseStore } from 'stores/regular-expense-store';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const $q = useQuasar();
const expenses = computed(() => useBuildingStore().formModel.regularExpenses ?? []);
const {
  appendRegularExpense,
  replaceRegularExpense,
  removeRegularExpense,
} = useBuildingStore();
const showDialog = ref(false);
const dialogMode = ref<'add' | 'edit'>('add');
const { describeExpenseCategory } = usePayment();
const {
  resetModel,
  createRegularExpense,
  updateRegularExpense,
  deleteRegularExpense,
} = useRegularExpenseStore();
const { toastHandler } = useErrorHandler();

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
    name: 'amount',
    label: '金額(税抜)',
    field: (row: RegularExpenseBase) => row.amount?.toLocaleString(),
    align: 'right',
    sortable: false,
  },
  {
    name: 'tax',
    label: '消費税',
    field: (row: RegularExpenseBase) => row.tax?.toLocaleString(),
    align: 'right',
    sortable: false,
  },
  {
    name: 'summary',
    label: '摘要',
    field: (row) => row?.summary ? (row?.summary.length > 20 ? row?.summary.substring(0, 20) + '...' : row?.summary) : '',
    align: 'left',
    sortable: false,
  },
  {
    name: 'note',
    label: '備考',
    field: (row) => row?.note ? (row?.note.length > 20 ? row?.note.substring(0, 20) + '...' : row?.note) : '',
    align: 'left',
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

const editExpense = (expense: RegularExpenseBase) => {
  resetModel(expense);
  dialogMode.value = 'edit';
  showDialog.value = true;
};

const removeExpense = (expense: RegularExpenseBase) => {
  $q.dialog({
    title: '経常支出削除',
    message: `経常支出「${describeExpenseCategory(expense.category)}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!expense.id) return;
    try {
      await deleteRegularExpense(expense.id.toString());
      removeRegularExpense(expense.id);
    } catch (error) {
      await toastHandler(error);
    }
  });
};

const showAddingDialog = () => {
  resetModel();
  dialogMode.value = 'add';
  showDialog.value = true;
};

const handleDialogSubmit = async (value: RegularExpenseBase) => {
  if (dialogMode.value === 'add') {
    // handle create
    loading.value = true;
    const buildingIdStr = useBuildingStore().formModel.id;
    const buildingId = buildingIdStr ? parseInt(buildingIdStr) : undefined;
    if (!buildingId) {
      await toastHandler('物件情報が取得できませんでした');
      return;
    }
    try {
      const payload = {
        ...value,
        buildingId,
      } as RegularExpenseBase;
      const created = await createRegularExpense(payload);
      appendRegularExpense(created);
    } catch (error) {
      await toastHandler(error);
    } finally {
      loading.value = false;
    }
  } else {
    // handle update
    loading.value = true;
    const expenseId = value.id;
    if (!expenseId) {
      await toastHandler('更新対象の経常支出が見つかりませんでした');
      return;
    }
    try {
      const updated = await updateRegularExpense(expenseId.toString(), value);
      replaceRegularExpense(updated);
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
    :rows="expenses"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
    :loading="loading"
  >
    <template #top-left>
      <div class="text-h6">経常支出一覧</div>
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
    <template #[`body-cell-category`]="{ row }: { row: RegularExpenseBase }">
      <q-td>
        {{ describeExpenseCategory(row.category) }}
      </q-td>
    </template>
    <template #[`body-cell-targetMonths`]="{ row }: { row: RegularExpenseBase }">
      <q-td class="text-right" v-if="row.targetMonths?.length == 12">
        毎月
      </q-td>
      <q-td class="text-right" v-else>
        {{ row.targetMonths?.join(', ') }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ row }: { row: RegularExpenseBase }">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editExpense(row)"/>
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeExpense(row)"/>
      </q-td>
    </template>
  </q-table>
  <regular-expense-dialog
    :show="showDialog"
    :mode="dialogMode"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>
