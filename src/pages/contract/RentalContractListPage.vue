<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { computed, onMounted, Ref, ref } from 'vue';
import { RentalContractInResponse } from 'src/api';
import { useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';

const { rentalContractList: contracts } = storeToRefs(useContractStore());
const {
  statusToChipProps,
  promptRemindStatusToChipProps,
} = useContractStore();
const loading = ref(false);
const $q = useQuasar();
const { toastHandler } = useErrorHandler();

const columns: QTableProps['columns'] = [
  {
    label: '物件名',
    field: row => row.building.name,
    name: 'buildingName',
    sortable: false,
    align: 'left',
  },
  {
    label: '部屋番号',
    field: row => row.room.name,
    name: 'roomName',
    sortable: false,
    align: 'left',
  },
  {
    label: '入居者',
    field: 'tenant',
    name: 'tenant',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約開始日',
    field: 'startDate',
    name: 'startDate',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約終了日',
    field: 'endDate',
    name: 'endDate',
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
    label: '催促状況',
    field: 'promptRemindStatus',
    name: 'promptRemindStatus',
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

const router = useRouter();

const toContractDetail = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'rental-contract-detail',
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
      name: 'rental-contract-edit',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const promptToUpdateContract = async (id?: string) => {
  if (!id) return;
  $q.dialog({
    title: '更新を促す',
    message: '更新を促しますか？',
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    try {
      await useContractStore().promptRemindRentalContract(id);
    } catch (e) {
      toastHandler('更新を促すに失敗しました。')
    }
    tableRef.value?.requestServerInteraction();
  });
};

const toNewContract = async () => {
  try {
    await router.push({
      name: 'rental-contract-create',
    });
  } catch (e) {
    console.error(e);
  }
};


const searchText = ref('');
const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};
const includeArchive = ref(false);

const archiveContract = async (contract: RentalContractInResponse) => {
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
      await useContractStore().deleteRentalContract(contract.id);
    } catch (e) {
      console.error(e);
    }

    tableRef.value?.requestServerInteraction();
  });
};

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
    const pageMeta = await useContractStore().getRentalContractList(rowsPerPage, page);
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
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          title="賃貸借契約一覧"
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
          <template #[`body-cell-buildingName`]="{ row }: { row: RentalContractInResponse }">
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
          <template #[`body-cell-roomName`]="{ row }: { row: RentalContractInResponse }">
            <q-td>
              <a
                v-if="row.room"
                :href="$router.resolve({
                  name: 'room-detail',
                  params: { id: row.room!.id },
                }).href"
              >
                {{ row.room.name }}
              </a>
              <template v-else>-</template>
            </q-td>
          </template>
          <template #[`body-cell-tenant`]="{ row }: { row: RentalContractInResponse }">
            <q-td>
              <a
                v-if="row.tenant"
                :href="$router.resolve({
                  name: 'tenant-detail',
                  params: { id: row.tenant!.id },
                }).href"
              >
                {{ row.tenant.lastName }} {{ row.tenant.firstName }}
              </a>
              <template v-else>-</template>
            </q-td>
          </template>
          <template #[`body-cell-status`]="{ row }">
            <q-td>
              <q-chip
                v-bind="statusToChipProps(row.status)"
              />
            </q-td>
          </template>
          <template #[`body-cell-promptRemindStatus`]="{ row }: { row: RentalContractInResponse }">
            <q-td>
              <q-chip
                v-if="promptRemindStatusToChipProps(row.promptRemindStatus)"
                :label="promptRemindStatusToChipProps(row.promptRemindStatus)!.label"
                :color="promptRemindStatusToChipProps(row.promptRemindStatus)!.color"
              />
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key, row }: { key: string, row: RentalContractInResponse }">
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
                    <q-item dense clickable @click="promptToUpdateContract(key)">
                      <q-item-section>
                        <q-item-label>更新を促す</q-item-label>
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
