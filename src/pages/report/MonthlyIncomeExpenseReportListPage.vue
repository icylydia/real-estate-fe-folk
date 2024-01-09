<script setup lang="ts">
// search params
import { ref } from 'vue';
import { useBuildingStore } from 'stores/building-store';
import { QSelect, QTableProps } from 'quasar';
import { MonthlyIncomeAndExpenseReportRequest, MonthlyIncomeAndExpenseReportResponse } from 'src/api';
import { useReportStore } from 'stores/report-store';
import { storeToRefs } from 'pinia';

const selectedYear = ref<number>(new Date().getFullYear())
const yearOptions = ref<Array<{ value: number; label: string }>>([])
for (let i = 0; i < 10; i++) {
  yearOptions.value.push({
    value: new Date().getFullYear() - i,
    label: `${new Date().getFullYear() - i}年`,
  })
}
const selectedMonth = ref<number>(new Date().getMonth() + 1)
const monthOptions = ref<Array<{ value: number; label: string }>>([])
for (let i = 1; i <= 12; i++) {
  monthOptions.value.push({
    value: i,
    label: `${i}月`,
  })
}

const selectedBuilding = ref<BuildingOption | null>(null)
const selectedBuildingError = ref<string | undefined>(undefined)
type BuildingOption = {
  id: number | string | undefined;
  name: string | undefined;
}
const buildingOptions = ref<Array<BuildingOption>>([])
const getAllBuildingOptions = () => {
  return useBuildingStore().buildingOptions.map((v) => {
    return {
      name: v.name || '',
      id: v.id || '',
    } as BuildingOption;
  });
};
enum BuildingLoadStatus {
  NOT_LOADED,
  LOADING,
  LOADED,
  ABORTED,
}
const buildingLoadStatus = ref<BuildingLoadStatus>(BuildingLoadStatus.NOT_LOADED)
const onFilterBuilding = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  if (
    buildingLoadStatus.value === BuildingLoadStatus.NOT_LOADED ||
    buildingLoadStatus.value === BuildingLoadStatus.ABORTED
  ) {
    buildingLoadStatus.value = BuildingLoadStatus.LOADING;
    useBuildingStore()
      .getBuildingOptions()
      .then(() => {
        buildingOptions.value = getAllBuildingOptions();
        buildingLoadStatus.value = BuildingLoadStatus.LOADED;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        doneFn(() => {});
      })
      .catch(() => {
        buildingLoadStatus.value = BuildingLoadStatus.ABORTED;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        doneFn(() => {});
      });
  }
  if (inputValue === '') {
    doneFn(() => {
      buildingOptions.value = getAllBuildingOptions();
    });
  } else {
    doneFn(() => {
      buildingOptions.value = getAllBuildingOptions().filter((v) => {
        return v.name && v.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      });
    });
  }
}

const onSearch = async () => {
  if (!selectedBuilding.value) {
    selectedBuildingError.value = '物件を選択してください';
    return;
  }
  loading.value = true;
  useReportStore().resetMonthlyReport();
  const payload: MonthlyIncomeAndExpenseReportRequest = {
    targetYear: selectedYear.value,
    targetMonth: selectedMonth.value,
    building: {
      id: selectedBuilding.value?.id?.toString(),
    },
  };
  await useReportStore().getMonthlyReport(payload);
  loading.value = false;
}

// table
const loading = ref<boolean>(false)
const { monthlyIncomeAndExpenseReports: reports } = storeToRefs(useReportStore())
const columns: QTableProps['columns'] = [
  {
    name: 'targetYear',
    label: '年',
    field: 'targetYear',
    align: 'left',
    sortable: false,
  },
  {
    name: 'targetMonth',
    label: '月',
    field: 'targetMonth',
    align: 'left',
    sortable: false,
  },
  {
    name: 'buildingName',
    label: '物件',
    field: 'buildingName',
    align: 'left',
    sortable: false,
  },
  {
    name: 'ownerName',
    label: 'オーナー',
    field: 'ownerName',
    align: 'left',
    sortable: false,
  },
  {
    name: 'status',
    label: '状態',
    field: 'status',
    align: 'left',
    sortable: false,
  },
  {
    name: 'actions',
    label: '操作',
    field: 'actions',
    align: 'right',
    sortable: false,
  },
];

const downloadRow = (row: MonthlyIncomeAndExpenseReportResponse) => {
  if (!row.url) return;
  window.open(row.url, '_blank');
}

const disableRow = async (row: MonthlyIncomeAndExpenseReportResponse) => {
  if (!row.id) return;
  loading.value = true;
  await useReportStore().disableMonthlyReport(row.id);
  loading.value = false;
}

const enableRow = async (row: MonthlyIncomeAndExpenseReportResponse) => {
  if (!row.id) return;
  loading.value = true;
  await useReportStore().enableMonthlyReport(row.id);
  loading.value = false;
}

const deleteRow = async (row: MonthlyIncomeAndExpenseReportResponse) => {
  if (!row.id) return;
  loading.value = true;
  await useReportStore().deleteMonthlyReport(row.id);
  loading.value = false;
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="row justify-between items-center">
          <div class="col">
            <h1 class="text-h6 q-ma-none">月次収支報告書</h1>
          </div>
        </div>
        <div class="fit row wrap justify-start items-start content-start">
          <div
            class="q-px-sm"
            style="max-width: 150px"
          >
            <q-select
              v-model="selectedYear"
              :options="yearOptions"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              label="年"
              dense
              style="max-width: 150px"
              autocomplete="off"
            />
          </div>
          <div
            class="q-px-sm"
            style="max-width: 150px"
          >
            <q-select
              v-model="selectedMonth"
              :options="monthOptions"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              label="月"
              dense
              style="max-width: 150px"
              autocomplete="off"
            />
          </div>
          <div class="col-grow q-px-sm">
            <q-select
              v-model="selectedBuilding"
              label="物件"
              :options="buildingOptions"
              option-label="name"
              option-value="id"
              use-input
              @filter="onFilterBuilding"
              dense
              autocomplete="off"
              :error="selectedBuildingError !== undefined"
              :error-message="selectedBuildingError"
              @update:model-value="selectedBuildingError = undefined"
            />
          </div>
          <div
            class="q-px-sm"
            style="max-width: 150px"
          >
            <q-btn
              color="primary"
              label="検索"
              dense
              style="max-width: 150px"
              @click="onSearch"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-table
          :rows="reports"
          :columns="columns"
          row-key="id"
          hide-pagination
          flat
          :loading="loading"
        >
          <template #[`body-cell-buildingName`]="{ row }: { row: MonthlyIncomeAndExpenseReportResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'building-detail',
                  params: { id: row.building?.id },
                }).href"
              >
                <template v-if="row.building">
                  {{ row.building.name }}
                </template>
                <template v-else>
                  -
                </template>
              </a>
            </q-td>
          </template>
          <template #[`body-cell-ownerName`]="{ row }: { row: MonthlyIncomeAndExpenseReportResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'owner-detail',
                  params: { id: row.owner?.id },
                }).href"
              >
                <template v-if="row.owner">
                  {{ row.owner.lastName }} {{ row.owner.firstName }}
                </template>
                <template v-else>
                  -
                </template>
              </a>
            </q-td>
          </template>
          <template #[`body-cell-status`]="{ row }: { row: MonthlyIncomeAndExpenseReportResponse }">
            <q-td>
              <template v-if="row.disabled">
                <q-badge
                  color="red"
                  label="無効"
                />
              </template>
              <template v-else>
                <q-badge
                  color="green"
                  label="有効"
                />
              </template>
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ row }: { row: MonthlyIncomeAndExpenseReportResponse }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_download" @click="downloadRow(row)" />
              <template v-if="row.disabled">
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="enableRow(row)" />
              </template>
              <template v-else>
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility_off" @click="disableRow(row)" />
              </template>
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="deleteRow(row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
