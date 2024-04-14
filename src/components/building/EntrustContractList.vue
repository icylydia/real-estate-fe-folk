<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import { computed } from 'vue';
import { QTableProps } from 'quasar';
import { EntrustContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';

const { formModel: building } = storeToRefs(useBuildingStore());
const contracts = computed(() => building.value.activeEntrustContracts ?? []);
const {
  statusToChipProps,
} = useContractStore();

const columns: QTableProps['columns'] = [
  {
    label: 'タイトル',
    field: 'title',
    name: 'title',
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
];
</script>

<template>
  <q-table
    flat
    :rows="contracts"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
    no-data-label="契約がありません"
  >
    <template #top-left>
      <div class="text-h6">管理委託契約</div>
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
  </q-table>
</template>
