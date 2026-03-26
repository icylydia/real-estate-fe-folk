<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import type { QTableProps } from 'quasar';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { ImportBatchRowResponse } from 'src/api';
import { useImportStore } from 'stores/import-store';
import useErrorHandler from 'components/app/useErrorHandler';

type Pagination = {
  sortBy?: string;
  descending?: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
};

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const { toastHandler } = useErrorHandler();
const importStore = useImportStore();
const { currentBatch, batchRows, rowFilters } = storeToRefs(importStore);

const loading = ref(false);
const uploading = ref(false);
const committing = ref(false);
const forceImport = ref(false);
const csvFile = ref<File | null>(null);

const pagination = ref<Pagination>({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 20,
  rowsNumber: 0,
});

const paginationMax = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
});

const statusOptions = [
  { label: '解析済み', value: 'parsed' },
  { label: '警告', value: 'warning' },
  { label: 'エラー', value: 'error' },
  { label: '取込済み', value: 'imported' },
];

const describeRowType = (type?: unknown) => {
  const normalized = typeof type === 'string' ? type : String(type ?? '');
  switch (normalized) {
    case 'income':
      return '収入';
    case 'expense':
      return '支出';
    default:
      return normalized || '';
  }
};

const columns: QTableProps['columns'] = [
  { name: 'rowNo', label: '行', field: 'rowNo', align: 'left' },
  { name: 'status', label: '状態', field: 'status', align: 'left' },
  { name: 'type', label: '種別', field: (row: ImportBatchRowResponse) => describeRowType(row.resolved?.type), align: 'left' },
  { name: 'title', label: 'タイトル', field: (row: ImportBatchRowResponse) => row.parsed?.title ?? '', align: 'left' },
  { name: 'categoryLabel', label: 'CSV類別', field: (row: ImportBatchRowResponse) => row.parsed?.categoryLabel ?? '', align: 'left' },
  { name: 'amount', label: '金額', field: (row: ImportBatchRowResponse) => row.parsed?.amount ?? 0, align: 'right' },
  { name: 'building', label: '物件', field: (row: ImportBatchRowResponse) => row.parsed?.buildingName ?? '', align: 'left' },
  { name: 'room', label: '区画', field: (row: ImportBatchRowResponse) => row.parsed?.roomName ?? '', align: 'left' },
  { name: 'owner', label: 'オーナー', field: (row: ImportBatchRowResponse) => row.parsed?.ownerName ?? '', align: 'left' },
  { name: 'message', label: '警告/エラー', field: 'message', align: 'left' },
];

const batchId = computed(() => {
  const value = route.params.id;
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
});

const describeStatus = (status?: unknown) => {
  const normalized = typeof status === 'string' ? status : String(status ?? '');
  switch (normalized) {
    case 'uploaded':
      return { label: 'アップロード済み', color: 'grey-7' };
    case 'parsing':
      return { label: '解析中', color: 'warning' };
    case 'dry_run_completed':
      return { label: '事前確認完了', color: 'primary' };
    case 'dry_run_failed':
      return { label: '事前確認失敗', color: 'negative' };
    case 'committing':
      return { label: '取込中', color: 'warning' };
    case 'committed':
      return { label: '取込完了', color: 'positive' };
    case 'commit_failed':
      return { label: '取込失敗', color: 'negative' };
    case 'parsed':
      return { label: '解析済み', color: 'primary' };
    case 'warning':
      return { label: '警告', color: 'warning' };
    case 'error':
      return { label: 'エラー', color: 'negative' };
    case 'imported':
      return { label: '取込済み', color: 'positive' };
    default:
      return { label: normalized || '-', color: 'grey-7' };
  }
};

const rowMessage = (row: ImportBatchRowResponse) => {
  if (row.errorMessage) {
    return row.errorMessage;
  }
  if (row.warnings?.length) {
    return row.warnings.map((warning) => warning.message ?? warning.code).filter(Boolean).join(' / ');
  }
  return '';
};

const canCommit = computed(() => {
  return Boolean(
    currentBatch.value?.id &&
    String(currentBatch.value.status) === 'dry_run_completed' &&
    (currentBatch.value.errorCount ?? 0) === 0
  );
});

const loadBatch = async () => {
  if (!batchId.value) {
    importStore.reset();
    return;
  }
  loading.value = true;
  try {
    await importStore.getBatch(batchId.value);
    const pageMeta = await importStore.getBatchRows(
      batchId.value,
      pagination.value.rowsPerPage,
      pagination.value.page,
      rowFilters.value.status,
    );
    pagination.value = {
      ...pagination.value,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? pagination.value.rowsPerPage,
      rowsNumber: pageMeta.total ?? 0,
    };
    forceImport.value = Boolean(currentBatch.value?.forceImport);
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const runDryRun = async () => {
  if (!csvFile.value) {
    await toastHandler(new Error('CSVファイルを選択してください。'));
    return;
  }
  uploading.value = true;
  try {
    const batch = await importStore.dryRun(csvFile.value);
    if (batch.id) {
      await router.push({
        name: 'itandi-csv-import-detail',
        params: { id: String(batch.id) },
      });
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    uploading.value = false;
  }
};

const commitImport = async () => {
  if (!currentBatch.value?.id) {
    return;
  }
  $q.dialog({
    title: 'CSV取込',
    message: '現在の事前確認結果を正式に取込しますか？',
    ok: { label: '確認', color: 'primary' },
    cancel: { label: 'キャンセル', color: 'grey-8' },
    persistent: true,
  }).onOk(async () => {
    committing.value = true;
    try {
      await importStore.commit(currentBatch.value!.id!, forceImport.value);
      await loadBatch();
    } catch (error) {
      await toastHandler(error);
    } finally {
      committing.value = false;
    }
  });
};

const onRequest = async ({ pagination: nextPagination }: { pagination: Pagination }) => {
  pagination.value = nextPagination;
  await loadBatch();
};

const onSearchRows = async () => {
  pagination.value.page = 1;
  await loadBatch();
};

const goToIncomes = async () => {
  await router.push({ name: 'income-list' });
};

const goToExpenses = async () => {
  await router.push({ name: 'expense-list' });
};

watch(() => route.params.id, async () => {
  pagination.value.page = 1;
  await loadBatch();
});

onMounted(async () => {
  await loadBatch();
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-lg-4">
        <q-card bordered>
          <q-card-section>
            <div class="text-h6">CSV取込</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              ITANDI CSV をアップロードし、事前確認後に正式取込します。
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-file
              v-model="csvFile"
              label="CSVファイル"
              accept=".csv,text/csv"
              clearable
            >
              <template #prepend>
                <q-icon name="sym_r_upload_file" />
              </template>
            </q-file>
            <q-checkbox
              v-if="currentBatch?.warningCount"
              v-model="forceImport"
              class="q-mt-md"
              label="警告行をその他として取り込む"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn
              color="primary"
              label="事前確認"
              icon="sym_r_preview"
              :loading="uploading"
              @click="runDryRun"
            />
            <q-btn
              color="positive"
              label="正式取込"
              icon="sym_r_publish"
              :disable="!canCommit"
              :loading="committing"
              @click="commitImport"
            />
          </q-card-actions>
        </q-card>

        <q-card v-if="currentBatch" bordered class="q-mt-md">
          <q-card-section class="row q-col-gutter-sm">
            <div class="col-12">
              <div class="text-subtitle1">取込結果</div>
            </div>
            <div class="col-12">
              <q-chip :label="describeStatus(currentBatch.status).label" :color="describeStatus(currentBatch.status).color" text-color="white" />
            </div>
            <div class="col-12 text-body2">ファイル: {{ currentBatch.fileName || '-' }}</div>
            <div class="col-6 text-body2">対象年: {{ currentBatch.targetYear || '-' }}</div>
            <div class="col-6 text-body2">対象月: {{ currentBatch.targetMonth || '-' }}</div>
            <div class="col-6 text-body2">総行数: {{ currentBatch.rowCount || 0 }}</div>
            <div class="col-6 text-body2">警告: {{ currentBatch.warningCount || 0 }}</div>
            <div class="col-6 text-body2">エラー: {{ currentBatch.errorCount || 0 }}</div>
            <div class="col-6 text-body2">新規収入: {{ currentBatch.createdIncomeCount || 0 }}</div>
            <div class="col-6 text-body2">新規支出: {{ currentBatch.createdExpenseCount || 0 }}</div>
            <div class="col-6 text-body2">置換収入: {{ currentBatch.replacedIncomeCount || 0 }}</div>
            <div class="col-6 text-body2">置換支出: {{ currentBatch.replacedExpenseCount || 0 }}</div>
            <div v-if="currentBatch.replaceScopes?.length" class="col-12 text-body2">
              置換範囲: {{ currentBatch.replaceScopes.join(', ') }}
            </div>
            <div v-if="currentBatch.errorMessage" class="col-12 text-negative text-body2">
              {{ currentBatch.errorMessage }}
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat color="primary" label="収入一覧" @click="goToIncomes" />
            <q-btn flat color="primary" label="支出一覧" @click="goToExpenses" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-lg-8">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              :loading="loading || committing"
              :columns="columns"
              :rows="batchRows"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
            >
              <template #top-left>
                <div class="text-h6">取込明細</div>
              </template>
              <template #top-right>
                <q-select
                  v-model="rowFilters.status"
                  class="archive-filter"
                  label="状態"
                  clearable
                  emit-value
                  map-options
                  :options="statusOptions"
                  @update:model-value="onSearchRows"
                />
              </template>
              <template #[`body-cell-status`]="{ row }: { row: ImportBatchRowResponse }">
                <q-td>
                  <q-chip
                    dense
                    :label="describeStatus(row.status).label"
                    :color="describeStatus(row.status).color"
                    text-color="white"
                  />
                </q-td>
              </template>
              <template #[`body-cell-amount`]="{ row }: { row: ImportBatchRowResponse }">
                <q-td class="text-right">
                  {{ $filters.jpyCurrency(row.parsed?.amount ?? 0) }}
                </q-td>
              </template>
              <template #[`body-cell-message`]="{ row }: { row: ImportBatchRowResponse }">
                <q-td class="text-wrap">{{ rowMessage(row) }}</q-td>
              </template>
            </q-table>
            <div class="row justify-center q-my-md">
              <q-pagination
                v-model="pagination.page"
                color="primary"
                :max="paginationMax"
                max-pages="9"
                @update:model-value="loadBatch"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.archive-filter {
  min-width: 180px;
}

.text-wrap {
  white-space: normal;
}
</style>
