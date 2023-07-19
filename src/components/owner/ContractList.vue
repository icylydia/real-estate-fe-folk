<script setup lang="ts">
import { useOwnerStore } from 'stores/owner-store';
import { computed } from 'vue';
import { QTableProps } from 'quasar';
import { EntrustContractBase, EntrustContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';

const {
  statusToChipProps,
  benefitTypeToChipProps,
} = useContractStore();
const ownerStore = useOwnerStore();
const contracts = computed(() => ownerStore.formModel.contracts);

const columns: QTableProps['columns'] = [
  {
    label: '物件名',
    field: 'buildingName',
    name: 'buildingName',
    sortable: false,
    align: 'left',
  },
  {
    label: '報酬の種類',
    field: 'benefitType',
    name: 'benefitType',
    sortable: false,
    align: 'left',
  },
  {
    label: '報酬の金額',
    field: 'benefit',
    name: 'benefit',
    sortable: false,
    align: 'right',
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
    <template #[`body-cell-buildingName`]="{ row }: { row: EntrustContractInResponse }">
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
    <template #[`body-cell-benefitType`]="{ row }: { row: EntrustContractInResponse }">
      <q-td>
        <q-chip
          v-bind="benefitTypeToChipProps(row.benefitType)"
        />
      </q-td>
    </template>
    <template #[`body-cell-benefit`]="{ row }: { row: EntrustContractInResponse }">
      <q-td class="text-right">
        <template v-if="row.benefitType == EntrustContractBase.BenefitTypeEnum.Fixed">
          {{ $filters.jpyCurrency(row.benefitAmount) }}
        </template>
        <template v-else-if="row.benefitType == EntrustContractBase.BenefitTypeEnum.Percentage">
          {{ $filters.percentage(row.benefitPercentage) }}
        </template>
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
