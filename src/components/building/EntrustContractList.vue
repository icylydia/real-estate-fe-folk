<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import { computed } from 'vue';
import type { QTableProps } from 'quasar';
import type { EntrustContractInResponse } from 'src/api';
import { ContractBase } from 'src/api';
import { useContractStore } from 'stores/contract-store';
import moment from 'moment';

const { formModel: building } = storeToRefs(useBuildingStore());
const contracts = computed(() => building.value.activeEntrustContracts ?? []);
const {
  statusToChipProps,
} = useContractStore();

const columns: QTableProps['columns'] = [
  {
    label: 'オーナー',
    field: 'owner',
    name: 'owner',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約開始日',
    field: (row: EntrustContractInResponse) => moment(row.startDate).format('LL'),
    name: 'startDate',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約終了日',
    field: (row: EntrustContractInResponse) => moment(row.endDate).format('LL'),
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
    <template #[`body-cell-actions`]="{ row }: { row: EntrustContractInResponse }">
      <q-td class="text-right">
        <q-btn
          @click="() => $router.push({ name: 'entrust-contract-detail', params: { id: row.id } })"
          class="q-ml-sm"
          size="sm"
          flat
          dense
          icon="sym_r_visibility"
        />
      </q-td>
    </template>
  </q-table>
</template>
