<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { computed } from 'vue';
import { QTableProps } from 'quasar';
import { RentalContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';
import { useRouter } from 'vue-router';

const tenantStore = useTenantStore();
const { statusToChipProps, promptRemindStatusToChipProps } = useContractStore();
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
    <template #[`body-cell-actions`]="{ row }: { row: RentalContractInResponse }">
      <q-td class="text-right">
        <q-btn icon="sym_r_more_horiz" flat>
          <q-menu>
            <q-list>
              <q-item dense clickable @click="toContractDetail(row.id)">
                <q-item-section>
                  <q-item-label>詳細</q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense clickable @click="toContractEdit(row.id)">
                <q-item-section>
                  <q-item-label>編集</q-item-label>
                </q-item-section>
              </q-item>
              <q-item dense clickable @click="promptToUpdateContract(row.id)">
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
