<script setup lang="ts">
import { computed } from 'vue';
import { useContractStore } from 'stores/contract-store';
import type { QTableProps } from 'quasar';

const sequences = computed(() => useContractStore().rentalContractFormModel.sequence?? []);

const { statusToChipProps } = useContractStore();

const columns: QTableProps['columns'] = [
  {
    name: 'id',
    label: '管理番号',
    field: 'id',
    align: 'left',
    sortable: false,
  },
  {
    name: 'startDate',
    label: '契約開始日',
    field: 'startDate',
    align: 'left',
    sortable: false,
  },
  {
    name:'endDate',
    label: '契約終了日',
    field:'endDate',
    align: 'left',
    sortable: false,
  },
  {
    name: 'status',
    label: '契約状態',
    field: 'status',
    align: 'left',
    sortable: false,
  }
]
</script>

<template>
  <q-table
    flat
    :rows="sequences"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #[`body-cell-status`]="{ row }">
      <q-td>
        <q-chip v-bind="statusToChipProps(row.status)" />
      </q-td>
    </template>
  </q-table>
</template>
