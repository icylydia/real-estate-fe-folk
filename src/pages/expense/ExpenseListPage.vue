<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { useExpenseStore } from 'stores/expense-store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ExpenseInResponse, IncomeInResponse } from 'src/api';
import { usePayment } from 'src/utils/payment';

const loading = ref(false);
const $q = useQuasar();
const { list: rows, searchParams } = storeToRefs(useExpenseStore());
const router = useRouter();
const { describeCategory: describeExpenseCategory } = usePayment();

const columns: QTableProps['columns'] = [
  {
    label: '件名',
    field: 'title',
    name: 'title',
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
  console.log(expense.id);
  $q.dialog({
    title: '支出削除',
    message: `支出「${expense.title} 」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!expense.id) {
      return;
    }
    try {
      await useExpenseStore().deleteExpense(expense.id);
    } catch (e) {
      console.error(e);
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
      searchParams.value.year,
      searchParams.value.month,
      searchParams.value.query,
    );
    pagination.value = {
      sortBy: undefined,
      descending: false,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? 10,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card bordered>
          <q-card-section class="text-h6">
            検索条件
            <q-input
              v-model="searchParams.year"
              label="年"
            />
            <q-input
              v-model="searchParams.month"
              label="月"
            />
            <q-input
              v-model="searchParams.query"
              label="その他"
            />
          </q-card-section>
          <q-card-actions>
            <q-btn
              class="q-mr-sm full-width"
              color="primary"
              label="検索"
              icon="sym_r_location_on"
              @click="search()"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              :loading="loading"
              :columns="columns"
              :rows="rows"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top-left>
                <div class="text-h6">支出一覧</div>
              </template>
              <template #top-right>
                <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="toCreate()" />
              </template>
              <template #[`body-cell-category`]="{ row }: { row: IncomeInResponse }">
                <q-td>
                  {{ describeExpenseCategory(row.category) }}
                </q-td>
              </template>
              <template #[`body-cell-amount`]="{ row }: { row: ExpenseInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.amount) }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key , row }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="toDetail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="toEdit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(row)" />
                </q-td>
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
