<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { QTableProps } from 'quasar';
import { onMounted, ref } from 'vue';
import { RentalContractInResponse } from 'src/api';
import { useRouter } from 'vue-router';

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

const { rentalContractList: contracts } = storeToRefs(useContractStore());
const {
  getRentalContractList,
  reset: resetRentalContractList,
  statusToChipProps,
  promptRemindStatusToChipProps,
} = useContractStore();
const loading = ref(false);

const loadContracts = async () => {
  loading.value = true;
  try {
    resetRentalContractList();
    await getRentalContractList();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadContracts();
});

const router = useRouter();

const toContractDetail = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'contract-detail',
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
      name: 'contract-edit',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const promptToUpdateContract = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'contract-prompt-update',
      params: { id },
    });
  } catch (e) {
    console.error(e);
  }
};

const toNewContract = async () => {
  try {
    await router.push({
      name: 'contract-create',
    });
  } catch (e) {
    console.error(e);
  }
};


const searchText = ref('');
const search = async () => {
  await loadContracts()
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          title="契約一覧"
          :rows="contracts"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template #top-right>
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
                :href="$router.resolve({
                  name: 'building-detail',
                  params: { id: row.building!.id },
                }).href"
              >
                {{ row.building.name }}
              </a>
            </q-td>
          </template>
          <template #[`body-cell-roomName`]="{ row }: { row: RentalContractInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'room-detail',
                  params: { id: row.room!.id },
                }).href"
              >
                {{ row.room.name }}
              </a>
            </q-td>
          </template>
          <template #[`body-cell-tenant`]="{ row }: { row: RentalContractInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'tenant-detail',
                  params: { id: row.tenant!.id },
                }).href"
              >
                {{ row.tenant.lastName }} {{ row.tenant.firstName }}
              </a>
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
          <template #[`body-cell-actions`]="{ key }">
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
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
