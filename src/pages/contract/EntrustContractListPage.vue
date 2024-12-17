<script setup lang="ts">
import type { Ref } from 'vue';
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import type { GetEntrustContractListRequest } from 'stores/contract-store';
import { useContractStore } from 'stores/contract-store';
import type { QTable, QTableProps } from 'quasar';
import {  useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import type { EntrustContractInResponse } from 'src/api';
import { ContractBase } from 'src/api';
import useErrorHandler from 'components/app/useErrorHandler';
import { useContract } from 'src/utils/contract';
import moment from 'moment';

const loading = ref(false);
const $q = useQuasar();
const { toastHandler } = useErrorHandler();
const {
  entrustContractList: contracts,
  entrustContractSearchParams: searchParams,
} = storeToRefs(useContractStore());
const {
  statusToChipProps,
} = useContractStore();
const {
  statusOptions,
} = useContract();

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

const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

const router = useRouter();
const toNewContract = async () => {
  try {
    await router.push({
      name: 'entrust-contract-create',
    });
  } catch (e) {
    await toastHandler(e);
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
    await toastHandler(e);
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
    message: '契約を削除しますか？',
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
      await toastHandler(e);
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
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
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

const onRequest = async ({ pagination: _pagination }: { pagination: { page: number, rowsPerPage: number}}) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const payload: GetEntrustContractListRequest = {
      itemsPerPage: rowsPerPage,
      page: page,
      building: searchParams.value.building,
      owner: searchParams.value.owner,
      status: searchParams.value.status,
    }
    const pageMeta = await useContractStore().getEntrustContractList(payload);
    pagination.value = {
      sortBy: undefined,
      descending: false,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? 10,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (e) {
    await toastHandler(e);
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
            <q-btn
              color="primary"
              icon="sym_r_add"
              label="新規契約"
              @click="toNewContract"
            />
          </template>
          <template #top-row>
            <q-tr>
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
                  v-model="searchParams.owner"
                  label="オーナー"
                  dense
                  @keyup.enter="search"
                />
              </q-td>
              <q-td>
                <q-select
                  v-model="searchParams.status"
                  label="契約状況"
                  dense
                  clearable
                  emit-value
                  map-options
                  :options="statusOptions"
                  style="min-width: 100px;"
                />
              </q-td>
              <q-td class="text-right">
                <q-btn
                  label="検索"
                  color="primary"
                  @click="search"
                />
              </q-td>
            </q-tr>
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
              <template v-if="row.status == ContractBase.StatusEnum.Active && row.endDate && moment(row.endDate!) < moment()">
                <q-icon
                  name="warning"
                  size="14px"
                  class="q-ml-xs"
                  color="warning"
                >
                  <q-tooltip>
                    契約期間が終了しています
                  </q-tooltip>
                </q-icon>
              </template>
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key, row }: { key: string, row: EntrustContractInResponse }">
            <q-td class="text-right">
              <q-btn
                @click="toContractDetail(key)"
                class="q-ml-sm"
                size="sm"
                flat
                dense
                icon="sym_r_visibility"
              />
              <q-btn
                @click="toContractEdit(key)"
                class="q-ml-sm"
                size="sm"
                flat
                dense
                icon="sym_r_edit"
              />
              <q-btn icon="sym_r_more_horiz" flat>
                <q-menu>
                  <q-list>
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
