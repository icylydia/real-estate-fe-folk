<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { computed } from 'vue';
import { QTableProps } from 'quasar';
import { RentalContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';

const tenantStore = useTenantStore();
const { statusToChipProps } = useContractStore();
const contracts = computed(() => tenantStore.formModel.contracts);

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
</script>

<template>
  <q-table
    flat
    :rows="contracts"
    :columns="columns"
    row-key="id"
    :grid="$q.screen.lt.md"
    hide-bottom
    no-data-label="契約がありません"
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #top-left>
      <div class="text-h6">契約一覧</div>
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
  </q-table>
</template>
