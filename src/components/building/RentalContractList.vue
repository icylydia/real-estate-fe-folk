<script setup lang="ts">
import type { QTableProps } from 'quasar';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import type { RentalContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';
import moment from 'moment';

const {
  formModel: building,
} = storeToRefs(useBuildingStore());
const {
  statusToChipProps,
  promptRemindStatusToChipProps,
} = useContractStore();

const contracts = computed(() => building.value.activeContracts ?? []);

const columns: QTableProps['columns'] = [
  {
    label: '区画番号',
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
    field: (row: RentalContractInResponse) => moment(row.startDate).format('LL'),
    name: 'startDate',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約終了日',
    field: (row: RentalContractInResponse) => moment(row.endDate).format('LL'),
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
      <div class="text-h6">賃貸借契約</div>
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
    <template #[`body-cell-actions`]="{ row }: { row: RentalContractInResponse }">
      <q-td class="text-right">
        <q-btn
          @click="() => $router.push({ name: 'rental-contract-detail', params: { id: row.id } })"
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
