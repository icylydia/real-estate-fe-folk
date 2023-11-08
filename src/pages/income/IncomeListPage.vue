<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { useIncomeStore } from 'stores/income-store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { IncomeInResponse } from 'src/api';
import { usePayment } from 'src/utils/payment';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const $q = useQuasar();
const {
  describeCategory: describeIncomeCategory,
  describeIncomeConfirmStatus: describeConfirmStatus,
} = usePayment();
const selectedRows = ref<IncomeInResponse[]>([]);
const { list: rows, searchParams } = storeToRefs(useIncomeStore());
const router = useRouter();
const { toastHandler } = useErrorHandler();

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
    align: 'left',
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

onMounted(() => {
  tableRef.value?.requestServerInteraction();
});

const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

const toCreate = async () => {
  try {
    await router.push({
      name: 'income-create',
    });
  } catch (e) {
    console.error(e);
  }
};

const toDetail = async (id: number) => {
  try {
    await router.push({
      name: 'income-detail',
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
      name: 'income-edit',
      params: {
        id: id.toString(),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const remove = (income: IncomeInResponse) => {
  console.log(income);
  $q.dialog({
    title: '収入削除',
    message: `収入「${income.title} 」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!income.id) {
      return;
    }
    try {
      await useIncomeStore().deleteIncome(income.id);
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
    const pageMeta = await useIncomeStore().getIncomeList(
      rowsPerPage,
      page,
      searchParams.value.year,
      searchParams.value.month,
      searchParams.value.onlyUnconfirmed,
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

const confirmAll = (incomes: IncomeInResponse[]) => {
  $q.dialog({
    title: '収入一括承認',
    message: '選択した収入を一括で承認しますか？',
    ok: { label: '確認', color: 'primary'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const incomeIds = incomes.map((income) => income.id!);
      await useIncomeStore().confirmAll(incomeIds);
    } catch (e) {
      toastHandler('承認に失敗しました');
    }
    tableRef.value?.requestServerInteraction();
  });
};

const rejectAll = (incomes: IncomeInResponse[]) => {
  $q.dialog({
    title: '収入一括拒否',
    message: '選択した収入を一括で拒否しますか？',
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const incomeIds = incomes.map((income) => income.id!);
      await useIncomeStore().rejectAll(incomeIds);
    } catch (e) {
      toastHandler('拒否に失敗しました');
    }
    tableRef.value?.requestServerInteraction();
  });
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
            <q-checkbox
              v-model="searchParams.onlyUnconfirmed"
              label="未確認のみ"
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
              selection="multiple"
              v-model:selected="selectedRows"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top-left>
                <div class="text-h6">収入一覧</div>
              </template>
              <template #top-right>
                <template v-if="selectedRows.length > 0">
                  <q-btn
                    label="一括承認"
                    color="primary"
                    class="float-right text-capitalize shadow-3 q-mx-sm"
                    icon="sym_r_check"
                    @click="confirmAll(selectedRows)"
                  />
                  <q-btn
                    label="一括拒否"
                    color="negative"
                    class="float-right text-capitalize shadow-3"
                    icon="sym_r_do_not_disturb_on"
                    @click="rejectAll(selectedRows)"
                  />
                  <q-separator vertical class="q-mx-lg" />
                </template>
                <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="toCreate()" />
              </template>
              <template #[`body-cell-category`]="{ row }: { row: IncomeInResponse }">
                <q-td>
                  {{ describeIncomeCategory(row.category) }}
                </q-td>
              </template>
              <template #[`body-cell-amount`]="{ row }: { row: IncomeInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.amount) }}
                </q-td>
              </template>
              <template #[`body-cell-confirmStatus`]="{ row }: { row: IncomeInResponse }">
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
