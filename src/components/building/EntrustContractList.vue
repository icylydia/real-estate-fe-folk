<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import { computed } from 'vue';
import { QTableProps } from 'quasar';
import { EntrustContractBase, EntrustContractInResponse } from 'src/api';
import { useContractStore } from 'stores/contract-store';

const { formModel: building } = storeToRefs(useBuildingStore());
const contracts = computed(() => building.value.activeEntrustContracts);
const {
  benefitTypeToChipProps,
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
    :pagination="{
      rowsPerPage: 0,
    }"
    no-data-label="契約がありません"
  >
    <template #top-left>
      <div class="text-h6">契約一覧</div>
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
  </q-table>
</template>
