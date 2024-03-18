<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { EntrustContractInResponse } from 'src/api';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const $q = useQuasar();
const { toastHandler } = useErrorHandler();
const { entrustContractList: contracts } = storeToRefs(useContractStore());
const {
  statusToChipProps,
} = useContractStore();

const columns: QTableProps['columns'] = [
  {
    label: '物件名',
    field: 'buildingName',
    name: 'buildingName',
    sortable: false,
    align: 'left',
  },
  {
    label: 'オーナー',
    field: 'owner',
    name: 'owner',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約状況',
    field: 'status',
    name: 'status',
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

const searchText = ref('');
const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};
const includeArchive = ref(false);

const router = useRouter();
const toNewContract = async () => {
  try {
    await router.push({
      name: 'entrust-contract-create',
    });
  } catch (e) {
    console.error(e);
  }
};

const toContractDetail = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'entrust-contract-detail',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const toContractEdit = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'entrust-contract-edit',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const archiveContract = async (contract: EntrustContractInResponse) => {
  $q.dialog({
    title: '契約を削除',
    message: `契約「${contract.title}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!contract.id) {
      return;
    }
    try {
      await useContractStore().deleteEntrustContract(contract.id);
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
  rowsPerPage: 10,
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
    const pageMeta = await useContractStore().getEntrustContractList(
      rowsPerPage,
      page,
      searchText.value || undefined,
      includeArchive.value,
    );
    pagination.value = {
      sortBy: undefined,
      descending: false,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? 10,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (e) {
    toastHandler(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          title="管理委託契約一覧"
          :rows="contracts"
          :columns="columns"
          row-key="id"
          :loading="loading"
          hide-pagination
          v-model:pagination="pagination"
          @request="onRequest"
          ref="tableRef"
        >
          <template #top-right>
            <q-checkbox
              v-model="includeArchive"
              label="アーカイブを含む"
              class="q-mr-sm"
            />
            <q-input
              outlined
              dense
              placeholder="検索"
              class="q-mr-sm"
              v-model="searchText"
              @keydown.enter.prevent="search"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              color="primary"
              icon="sym_r_add"
              label="新規契約"
              @click="toNewContract"
            />
          </template>
          <template #[`body-cell-buildingName`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <a
                v-if="row.building"
                :href="$router.resolve({
                  name: 'building-detail',
                  params: { id: row.building!.id },
                }).href"
              >
                {{ row.building.name }}
              </a>
              <template v-else>-</template>
            </q-td>
          </template>
          <template #[`body-cell-owner`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <a
                v-if="row.owner"
                :href="$router.resolve({
                  name: 'owner-detail',
                  params: { id: row.owner!.id },
                }).href"
              >
                {{ row.owner.lastName }} {{ row.owner.firstName }}
              </a>
              <template v-else>-</template>
            </q-td>
          </template>
          <template #[`body-cell-status`]="{ row }: { row: EntrustContractInResponse }">
            <q-td>
              <q-chip
                v-bind="statusToChipProps(row.status)"
              />
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key, row }: { key: string, row: EntrustContractInResponse }">
            <q-td class="text-right">
              <q-btn icon="sym_r_more_horiz" flat>
                <q-menu>
                  <q-list>
                    <q-item dense clickable @click="toContractDetail(key)">
                      <q-item-section>
                        <q-item-label>詳細</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item dense clickable @click="toContractEdit(key)">
                      <q-item-section>
                        <q-item-label>編集</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item dense clickable @click="archiveContract(row)">
                      <q-item-section>
                        <q-item-label>削除</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
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
  </q-page>
</template>
