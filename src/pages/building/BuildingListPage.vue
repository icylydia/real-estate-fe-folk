<script lang="ts" setup>
import { BuildingInResponse } from 'src/api';
import { QTable, QTableProps } from 'quasar';
import { computed, onMounted, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useBuildingStore } from 'stores/building-store';

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: '物件名',
    field: 'name',
    sortable: false,
    align: 'left',
  },
  {
    name: 'price',
    label: '価格',
    field: 'price',
    sortable: false,
    align: 'right',
  },
  {
    name: 'address',
    label: '所在地',
    field: 'address',
    sortable: false,
    align: 'left',
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    sortable: false,
    align: 'right',
  },
];

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
  rowsPerPage: 10,
  rowsNumber: 0,
});

const paginationMax = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
});

const loading = ref(false);

const tableRef = ref<QTable | null>(null);

onMounted(async () => {
  tableRef.value?.requestServerInteraction();
});

const { getBuildingList } = useBuildingStore();
const { searchParams, list: rows } = storeToRefs(useBuildingStore());

const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { page: 1 } });
};

const onRequest = async ({ pagination: _pagination }: { pagination: Pagination}) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const reqParams = {
      page,
      itemsPerPage: rowsPerPage,
      ...searchParams.value,
    };
    const pageMeta = await getBuildingList(reqParams);
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

const onPageChange = async () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value });
};

const router = useRouter();

const create = () => {
  router.push({ name: 'building-create' })
};

const detail = (key: string) => {
  router.push({ name: 'building-detail', params: { id: key } })
};

const edit = (key: string) => {
  router.push({ name: 'building-edit', params: { id: key } })
};

const remove = (rowIndex: number) => {
  console.log('remove', rowIndex)
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
              v-model="searchParams.name"
              label="物件名"
            />
            <q-input
              v-model="searchParams.location"
              label="所在地"
              hint="地名、駅など"
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
              :grid="$q.screen.lt.md"
              :columns="columns"
              :rows="rows"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
              ref="tableRef"
            >
              <template #top-left>
                <div class="text-h6">物件一覧</div>
              </template>
              <template #top-right>
                <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="create()" />
              </template>
              <template #[`body-cell-price`]="{ row }: { row: BuildingInResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.price) }}
                </q-td>
              </template>
              <template #[`body-cell-address`]="{ row }: { row: BuildingInResponse }">
                <q-td>
                  {{ row.address.prefecture }}{{ row.address.detailAddress1 }}{{ row.address.detailAddress2 }}
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ key }">
                <q-td class="text-right">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="detail(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="edit(key)" />
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="remove(key)" />
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
