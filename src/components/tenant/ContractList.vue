<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { computed } from 'vue';
import type { QTableProps } from 'quasar';
import type { RentalContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';
import { useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import moment from 'moment';

const { statusToChipProps, promptRemindStatusToChipProps } = useContractStore();
const contracts = computed(() => useTenantStore().formModel.contracts ?? []);
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
    label: '区画番号',
    field: (row: RentalContractInResponse) => row.room?.name ?? '',
    name: 'roomName',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約開始日',
    field: (row: RentalContractInResponse) => row.startDate ? moment(row.startDate).format('LL') : '-',
    name: 'startDate',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約終了日',
    field: (row: RentalContractInResponse) => row.endDate ? moment(row.endDate).format('LL') : '-',
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

const router = useRouter();
const toContractDetail = async (id?: string) => {
  if (!id) return;
  try {
    await router.push({
      name: 'rental-contract-detail',
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
      name: 'rental-contract-edit',
      params: { id },
    });
  } catch (e) {
    await toastHandler(e);
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
    await toastHandler(e);
  }
};
</script>

<template>
  <q-table
    flat
    :rows="contracts"
    :columns="columns"
    row-key="id"
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
          {{ row.building!.name }}
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
          {{ row.room!.name }}
        </a>
      </q-td>
    </template>
    <template #[`body-cell-status`]="{ row }: { row: RentalContractInResponse }">
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
    <template #[`body-cell-actions`]="{ key }: { key: string }">
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
</template>
