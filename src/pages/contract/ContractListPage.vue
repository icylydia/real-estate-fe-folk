<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { QTableProps } from 'quasar';
import { onMounted, ref } from 'vue';
import { RentalContractInResponse } from 'src/api';

const columns: QTableProps['columns'] = [
  {
    label: '契約番号',
    field: 'id',
    name: 'id',
    sortable: false,
    align: 'left',
  },
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
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
];

const { rentalContractList: contracts } = storeToRefs(useContractStore());
const { getRentalContractList, reset: resetRentalContractList } = useContractStore();
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

const statusToChipProps = (status: string) => {
  switch (status) {
    case 'draft':
      return {
        label: '下書き',
        color: 'grey',
      };
    case 'beforeStart':
      return {
        label: '実行待ち',
        color: 'orange',
      };
    case 'active':
      return {
        label: '実行中',
        color: 'green',
      };
    case 'completed':
      return {
        label: '完了済み',
        color: 'blue',
      };
    case 'canceled':
      return {
        label: 'キャンセル済み',
        color: 'red',
      };
    default:
      return {
        label: '不明',
        color: 'grey',
      };
  }
};

const contractDetail = (key: string) => {
  console.log(key);
};

const editContract = (key: string) => {
  console.log(key);
};

const newContract = () => {
  console.log('new');
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
              @click="newContract"
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
          <template #[`body-cell-status`]="{ row }">
            <q-td>
              <q-chip
                v-bind="statusToChipProps(row.status)"
              />
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="contractDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editContract(key)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
