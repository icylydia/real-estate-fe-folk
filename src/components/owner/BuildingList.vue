<script setup lang="ts">
import { QTableProps } from 'quasar';
import { BuildingInResponse } from 'src/api';
import { useOwnerStore } from 'stores/owner-store';
import { computed } from 'vue';

const ownerStore = useOwnerStore();
const buildings = computed(() => ownerStore.formModel.buildings);

const columns: QTableProps['columns'] = [
  {
    label: '物件',
    field: 'building',
    name: 'building',
    sortable: false,
    align: 'left',
  },
  {
    name: 'price',
    label: '価格',
    field: 'price',
    sortable: false,
    align: 'right',
  },
  {
    name: 'address',
    label: '所在地',
    field: 'address',
    sortable: false,
    align: 'left',
  },
];
</script>

<template>
  <q-table
    flat
    :rows="buildings"
    :columns="columns"
    row-key="id"
    :grid="$q.screen.lt.md"
    hide-bottom
    no-data-label="物件がありません"
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #top-left>
      <div class="text-h6">物件一覧</div>
    </template>
    <template #[`body-cell-building`]="{ row }: { row: BuildingInResponse }">
      <q-td>
        <a
          :href="$router.resolve({
                  name: 'building-detail',
                  params: { id: row.id },
                }).href"
        >
          {{ row.name }}
        </a>
      </q-td>
    </template>
    <template #[`body-cell-price`]="{ row }: { row: BuildingInResponse }">
      <q-td class="text-right">
        {{ $filters.jpyCurrency(row.price) }}
      </q-td>
    </template>
    <template #[`body-cell-address`]="{ row }: { row: BuildingInResponse }">
      <q-td>
        {{ row.address.prefectureName }}{{ row.address.detailAddress1 }}{{ row.address.detailAddress2 }}
      </q-td>
    </template>
  </q-table>
</template>
