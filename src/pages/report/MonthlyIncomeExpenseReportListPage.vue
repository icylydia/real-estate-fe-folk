<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableProps } from 'quasar';
import type { MonthlyIncomeAndExpenseReportInList, MonthlyIncomeAndExpenseReportRequest } from 'src/api';
import { useReportStore } from 'stores/report-store';
import { storeToRefs } from 'pinia';
import MonthlyReportCommentDialog from 'components/report/MonthlyReportCommentDialog.vue';
import useErrorHandler from 'components/app/useErrorHandler';
import { useRouter } from 'vue-router';
import MonthlyReportAttachmentDialog from 'components/report/MonthlyReportAttachmentDialog.vue';

const { toastHandler } = useErrorHandler();

const router = useRouter();

onMounted(async () => {
  await resetPage();
});

const resetPage = () => {
  useReportStore().resetMonthlyReport();
  loading.value = false;
  showDialog.value = false;
  showAttachmentDialog.value = false;
}

/******************
 * search params
 ******************/
const selectedYear = ref<number>(new Date().getFullYear())
type YearOptionType = { value: number; label: string }
const yearOptions = ref<Array<YearOptionType>>([])
for (let i = 0; i < 10; i++) {
  yearOptions.value.push({
    value: new Date().getFullYear() - i,
    label: `${new Date().getFullYear() - i}年`,
  })
}
const selectedMonth = ref<number>(new Date().getMonth() + 1)
type MonthOptionType = { value: number; label: string }
const monthOptions = ref<Array<MonthOptionType>>([])
for (let i = 1; i <= 12; i++) {
  monthOptions.value.push({
    value: i,
    label: `${i}月`,
  })
}

const onSearch = async () => {
  loading.value = true;
  useReportStore().resetMonthlyReport();
  await useReportStore().getMonthlyReportList(selectedYear.value, selectedMonth.value);
  loading.value = false;
}

/******************************************
 * table
 ******************************************/
const loading = ref<boolean>(false)
const pagination = ref({
  page: 1,
  rowsPerPage: 0,
});
const { monthlyIncomeAndExpenseReports: reports } = storeToRefs(useReportStore())
const columns: QTableProps['columns'] = [
  {
    name: 'building',
    label: '物件',
    field: 'building',
    align: 'left',
    sortable: false,
  },
  {
    name: 'reportExists',
    label: '報告書',
    field: 'reportExists',
    align: 'left',
    sortable: false,
  },
  {
    name: 'owner',
    label: 'オーナー',
    field: 'owner',
    align: 'left',
    sortable: false,
  },
  {
    name: 'visibility',
    label: '可視性',
    field: 'visibility',
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

const generateRow = async (row: MonthlyIncomeAndExpenseReportInList, index: number) => {
  if (!row.building?.id) {
    await toastHandler('物件が見つかりません');
    return
  }
  loading.value = true;
  try {
    const payload: MonthlyIncomeAndExpenseReportRequest = {
      targetYear: selectedYear.value,
      targetMonth: selectedMonth.value,
      building: {
        id: row.building.id,
      },
    }
    const report = await useReportStore().getMonthlyReport(payload);
    if (!report) {
      await toastHandler('報告書の生成に失敗しました');
    }
    if (reports.value && reports.value[index]) {
      reports.value[index].report = report;
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
}

const downloadRow = (row: MonthlyIncomeAndExpenseReportInList) => {
  if (!row.report?.url) return;
  window.open(row.report.url, '_blank');
}

const disableRow = async (row: MonthlyIncomeAndExpenseReportInList, index: number) => {
  if (!row.report?.id) return;
  loading.value = true;
  try {
    if (reports.value && reports.value[index]) {
      reports.value[index].report = await useReportStore().disableMonthlyReport(row.report.id);
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
}

const enableRow = async (row: MonthlyIncomeAndExpenseReportInList, index: number) => {
  if (!row.report?.id) return;
  loading.value = true;
  try {
    if (reports.value && reports.value[index]) {
      reports.value[index].report = await useReportStore().enableMonthlyReport(row.report.id);
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
}

/******************************************
 * comment dialog
 ******************************************/
const showDialog = ref(false);
const commentId = ref<number | null>(null);
const commentContent = ref<string>('');
const addCommentRow = async (row: MonthlyIncomeAndExpenseReportInList) => {
  if (!row.report?.id) return;
  commentId.value = row.report.id;
  commentContent.value = row.report.note || '';
  showDialog.value = true;
}

const showAttachmentDialog = ref(false);
const attachmentReportId = ref<number | undefined>(undefined);
const manageAttachments = async (row: MonthlyIncomeAndExpenseReportInList) => {
  if (!row.report?.id) return;
  attachmentReportId.value = row.report.id;
  showAttachmentDialog.value = true;
}

const submitComment = async (comment: string) => {
  showDialog.value = false;
  if (!commentId.value) return;
  loading.value = true;
  try {
    const report = await useReportStore().commentMonthlyReport(commentId.value, comment);
    if (!report) {
      await toastHandler('コメントの登録に失敗しました');
    }
    const index = reports.value.findIndex((r) => r.report?.id === commentId.value);
    if (index !== -1) {
      if (reports.value && reports.value[index]) {
        reports.value[index].report = report;
      }
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
}

const deleteRow = async (row: MonthlyIncomeAndExpenseReportInList, index: number) => {
  if (!row.report?.id) return;
  loading.value = true;
  try {
    await useReportStore().deleteMonthlyReport(row.report.id);
    if (reports.value && reports.value[index]) {
      reports.value[index].report = undefined;
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
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
          flat
          :loading="loading"
          hide-pagination
          v-model:pagination="pagination"
        >
          <template #[`body-cell-building`]="{ row }: { row: MonthlyIncomeAndExpenseReportInList }">
            <q-td>
              <template v-if="row.building?.id">
                <a
                  :href="router.resolve({
                    name: 'building-detail',
                    params: { id: row.building!.id },
                  }).href"
                >
                  {{ row.building?.name }}
                </a>
              </template>
              <template v-else>
                -
              </template>
            </q-td>
          </template>
          <template #[`body-cell-reportExists`]="{ row }: { row: MonthlyIncomeAndExpenseReportInList }">
            <q-td>
              <template v-if="row.report">
                <q-badge
                  color="green"
                  label="生成済み"
                  @click="downloadRow(row)"
                  style="cursor: pointer;"
                />
              </template>
              <template v-else>
                <q-badge
                  color="red"
                  label="未生成"
                />
              </template>
            </q-td>
          </template>
          <template #[`body-cell-owner`]="{ row }: { row: MonthlyIncomeAndExpenseReportInList }">
            <q-td>
              <template v-if="row.report?.owner">
                <a
                  :href="router.resolve({
                  name: 'owner-detail',
                  params: { id: row.report?.owner?.id },
                }).href"
                >
                  {{ row.report.owner.lastName }} {{ row.report.owner.firstName }}
                </a>
              </template>
              <template v-else>
                -
              </template>
            </q-td>
          </template>
          <template #[`body-cell-visibility`]="{ row }: { row: MonthlyIncomeAndExpenseReportInList }">
            <q-td>
              <template v-if="row.report">
                <template v-if="row.report!.disabled">
                  <q-badge
                    color="red"
                    label="不可"
                  />
                </template>
                <template v-else>
                  <q-badge
                    color="green"
                    label="可"
                  />
                </template>
              </template>
              <template v-else>
                -
              </template>
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ row, rowIndex }: { row: MonthlyIncomeAndExpenseReportInList, rowIndex: number }">
            <q-td class="text-right">
              <template v-if="row.report">
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_download" @click="downloadRow(row)" />
                <template v-if="row.report?.disabled">
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="enableRow(row, rowIndex)" />
                </template>
                <template v-else>
                  <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility_off" @click="disableRow(row, rowIndex)" />
                </template>
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_add_comment" @click="addCommentRow(row)" />
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_attach_file" @click="manageAttachments(row)" />
                <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="deleteRow(row, rowIndex)" />
              </template>
              <template v-else>
                <q-btn
                  class="q-ml-sm"
                  size="sm"
                  flat
                  dense
                  icon="sym_r_resume"
                  @click="generateRow(row, rowIndex)"
                />
              </template>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
  <monthly-report-comment-dialog
    :comment="commentContent"
    @update:comment="commentContent=$event"
    :show="showDialog"
    @update:show="showDialog=$event"
    @submit="submitComment"
  />
  <monthly-report-attachment-dialog
    :show="showAttachmentDialog"
    @update:show="showAttachmentDialog=$event"
    :report-id="attachmentReportId || 0"
  />
</template>
