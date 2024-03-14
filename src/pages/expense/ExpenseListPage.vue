<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { useExpenseStore } from 'stores/expense-store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ExpenseInResponse } from 'src/api';
import { usePayment } from 'src/utils/payment';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const $q = useQuasar();
const { list: rows, searchParams } = storeToRefs(useExpenseStore());
const router = useRouter();
const {
  describeExpenseCategory,
  describeIncomeConfirmStatus: describeConfirmStatus,
} = usePayment();
const selectedRows = ref<ExpenseInResponse[]>([]);
const { toastHandler } = useErrorHandler();

const columns: QTableProps['columns'] = [
  {
    label: '物件名',
    field: (row: ExpenseInResponse) => row.building?.name ?? '',
    name: 'buildingName',
    sortable: false,
    align: 'left',
  },
  {
    label: '部屋番号',
    field: (row: ExpenseInResponse) => row.room?.name ?? '',
    name: 'roomName',
    sortable: false,
    align: 'left',
  },
  {
    label: '類別',
    field: 'category',
    name: 'category',
    sortable: false,
    align: 'left',
  },
  {
    label: '対象年',
    field: 'targetYear',
    name: 'targetYear',
    sortable: false,
    align: 'left',
  },
  {
    label: '対象月',
    field: 'targetMonth',
    name: 'targetMonth',
    sortable: false,
    align: 'left',
  },
  {
    label: '金額',
    field: 'amount',
    name: 'amount',
    sortable: false,
    align: 'right',
  },
  {
    label: '日付',
    field: 'date',
    name: 'date',
    sortable: false,
    align: 'right',
  },
  {
    label: '確認状態',
    field: 'confirmStatus',
    name: 'confirmStatus',
    sortable: false,
    align: 'left',
  },
  {
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
];

onMounted(async () => {
  tableRef.value?.requestServerInteraction();
});

const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

const toCreate = async () => {
  try {
    await router.push({
      name: 'expense-create',
    });
  } catch (e) {
    console.error(e);
  }
};

const toDetail = async (id: number) => {
  try {
    await router.push({
      name: 'expense-detail',
      params: {
        id: id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const toEdit = async (id: number) => {
  try {
    await router.push({
      name: 'expense-edit',
      params: {
        id: id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const remove = (expense: ExpenseInResponse) => {
  $q.dialog({
    title: '支出削除',
    message: '対象支出を削除しますか？',
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!expense.id) {
      return;
    }
    try {
      await useExpenseStore().deleteExpense(expense.id);
    } catch (error) {
      await toastHandler(error);
    }
    tableRef.value?.requestServerInteraction();
  });
};

/**********************
 * Pagination
 **********************/
type Pagination = {
  sortBy?: string;
  descending?: boolean;
  page?: number;
  rowsPerPage?: number;
  rowsNumber?: number;
};

const pagination: Ref<Pagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
});

const paginationMax = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
});

const tableRef = ref<QTable | null>(null);
const onPageChange = async () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value });
};

const onRequest = async ({ pagination: _pagination }: { pagination: Pagination}) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const pageMeta = await useExpenseStore().getExpenseList(
      rowsPerPage,
      page,
      searchParams.value.building,
      searchParams.value.room,
      searchParams.value.category,
      searchParams.value.targetYear,
      searchParams.value.targetMonth,
      searchParams.value.dateFrom,
      searchParams.value.dateTo,
      searchParams.value.confirmStatuses,
    );
    pagination.value = {
      sortBy: undefined,
      descending: false,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? 15,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const confirmAll = (expenses: ExpenseInResponse[]) => {
  $q.dialog({
    title: '支出一括承認',
    message: '選択した支出を一括で承認しますか？',
    ok: { label: '確認', color: 'primary'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await useExpenseStore().confirmAll(expenses.map((expense) => expense.id!));
    } catch (e) {
      await toastHandler('承認に失敗しました');
    }
    tableRef.value?.requestServerInteraction();
  });
};

const rejectAll = (expenses: ExpenseInResponse[]) => {
  $q.dialog({
    title: '支出一括拒否',
    message: '選択した支出を一括で拒否しますか？',
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await useExpenseStore().rejectAll(expenses.map((expense) => expense.id!));
    } catch (e) {
      await toastHandler('拒否に失敗しました');
    }
    tableRef.value?.requestServerInteraction();
  });
};
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              :loading="loading"
              :columns="columns"
              :rows="rows"
              row-key="id"
              selection="multiple"
              v-model:selected="selectedRows"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top-left>
                <div class="text-h6">支出一覧</div>
              </template>
              <template #top-right>
                <template v-if="selectedRows.length > 0">
                  <q-btn
                    label="一括承認"
                    color="primary"
                    class="float-right q-mx-sm"
                    icon="sym_r_check"
                    @click="confirmAll(selectedRows)"
                  />
                  <q-btn
                    label="一括拒否"
                    color="negative"
                    class="float-right"
                    icon="sym_r_do_not_disturb_on"
                    @click="rejectAll(selectedRows)"
                  />
                  <q-separator vertical class="q-mx-lg" />
                </template>
                <q-btn label="新規" color="primary" class="float-right" icon="sym_r_add" @click="toCreate()" />
              </template>
              <template #[`body-cell-category`]="{ row }: { row: ExpenseInResponse }">
                <q-td>
                  {{ describeExpenseCategory(row.category) }}
                </q-td>
              </template>
              <template #[`body-cell-amount`]="{ row }: { row: ExpenseInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.amount) }}
                </q-td>
              </template>
              <template #[`body-cell-confirmStatus`]="{ row }: { row: ExpenseInResponse }">
                <q-td>
                  <q-chip
                    :label="describeConfirmStatus(row.confirmStatus).description"
                    :color="describeConfirmStatus(row.confirmStatus).color"
                  />
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key , row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(row)" />
                </q-td>
              </template>
              <template #top-row>
                <q-tr>
                  <q-td>
                  </q-td>
                  <q-td>
                    <q-input
                      v-model="searchParams.building"
                      label="物件名"
                      dense
                      @keyup.enter="search"
                    />
                  </q-td>
                  <q-td>
                    <q-input
                      v-model="searchParams.room"
                      label="部屋番号"
                      dense
                      @keyup.enter="search"
                    />
                  </q-td>
                  <q-td>
                    <q-select
                      v-model="searchParams.category"
                      label="類別"
                      dense
                      clearable
                      emit-value
                      map-options
                      :options="usePayment().expenseCategoryOptions"
                      style="min-width: 100px;"
                    />
                  </q-td>
                  <q-td>
                    <q-input
                      v-model="searchParams.targetYear"
                      label="対象年"
                      dense
                      @keyup.enter="search"
                    />
                  </q-td>
                  <q-td>
                    <q-input
                      v-model="searchParams.targetMonth"
                      label="対象月"
                      dense
                      @keyup.enter="search"
                    />
                  </q-td>
                  <q-td colspan="2">
                    <div class="flex justify-between" style="min-width: 200px;">
                      <q-input
                        v-model="searchParams.dateFrom"
                        label="日付(From)"
                        dense
                        @keyup.enter="search"
                        style="width: 85px;"
                      />
                      <div style="line-height: 40px;">
                        <span style="vertical-align: middle">～</span>
                      </div>
                      <q-input
                        v-model="searchParams.dateTo"
                        label="日付(To)"
                        dense
                        @keyup.enter="search"
                        style="width: 85px;"
                      />
                    </div>
                  </q-td>
                  <q-td>
                    <q-select
                      v-model="searchParams.confirmStatuses"
                      label="確認状態"
                      dense
                      multiple
                      :options="usePayment().confirmStatusOptions"
                      use-chips
                      emit-value
                      map-options
                      style="width: 100px;"
                    >
                      <template #selected-item="{ index, opt, removeAtIndex }: {
                        index: number,
                        opt: { label: string, value: string, color: string },
                        removeAtIndex: (index: number) => void
                      }">
                        <q-chip
                          :label="opt.label"
                          :color="opt.color"
                          removable
                          dense
                          @remove="removeAtIndex(index)"
                        />
                      </template>
                    </q-select>
                  </q-td>
                  <q-td>
                    <q-btn
                      label="検索"
                      color="primary"
                      @click="search"
                    />
                  </q-td>
                </q-tr>
              </template>
            </q-table>
            <div class="row justify-center q-my-md">
              <q-pagination
                v-model="pagination.page"
                color="primary"
                :max="paginationMax"
                max-pages="9"
                @update:model-value="onPageChange"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
