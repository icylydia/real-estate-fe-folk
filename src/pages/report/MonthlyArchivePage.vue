<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableProps } from 'quasar';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import type { BuildingMonthlyArchiveResponse, BuildingOptionsResponse, FileBase } from 'src/api';
import { FileBase as FileBaseModel } from 'src/api';
import { useBuildingStore } from 'stores/building-store';
import { useOwnerStore } from 'stores/owner-store';
import { useMonthlyArchiveStore } from 'stores/monthly-archive-store';
import useErrorHandler from 'components/app/useErrorHandler';
import { useFile } from 'src/utils/file';

type ArchiveOwner = {
  id?: number;
  name?: string;
};

type ArchiveRow = BuildingMonthlyArchiveResponse & {
  owner?: ArchiveOwner | ArchiveOwner[] | null;
};

type OwnerOption = {
  id: number | string | undefined;
  lastName: string | undefined;
  firstName: string | undefined;
};

type Pagination = {
  sortBy?: string;
  descending?: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
};

const $q = useQuasar();
const { toastHandler } = useErrorHandler();
const { describeCategory } = useFile();

const buildingStore = useBuildingStore();
const ownerStore = useOwnerStore();
const archiveStore = useMonthlyArchiveStore();
const { buildingOptions } = storeToRefs(buildingStore);
const { archiveList, archive, attachments, searchParams } = storeToRefs(archiveStore);

const loading = ref(false);
const detailLoading = ref(false);
const uploadLoading = ref(false);
const visibilityLoadingId = ref<number | null>(null);
const showUploadDialog = ref(false);
const uploadCategory = ref<string | null>(null);
const uploadFile = ref<File | null>(null);
const loadingOwners = ref(false);
const filteredOwnerOptions = ref<Array<OwnerOption> | undefined>(undefined);

const pagination = ref<Pagination>({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const paginationMax = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
});

const yearOptions = Array.from({ length: 10 }, (_, index) => {
  const year = new Date().getFullYear() - index;
  return {
    label: `${year}年`,
    value: year,
  };
});

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}月`,
  value: index + 1,
}));

const getOwners = (value: ArchiveRow['owner']): ArchiveOwner[] => {
  if (Array.isArray(value)) {
    return value.filter((owner): owner is ArchiveOwner => !!owner);
  }
  return value ? [value] : [];
};

const getOwnerNames = (value: ArchiveRow['owner']): string => {
  return getOwners(value)
    .map((owner) => owner.name?.trim())
    .filter((name): name is string => !!name)
    .join(', ');
};

const getPrimaryOwnerId = (value: ArchiveRow['owner']): number | undefined => {
  return getOwners(value).find((owner) => typeof owner.id === 'number')?.id;
};

const getAllOwnerOptions = (): OwnerOption[] => {
  return ownerStore.ownerOptions.map((owner) => ({
    id: owner.id || '',
    lastName: owner.lastName || '',
    firstName: owner.firstName || '',
  }));
};

const ownerOptionLabel = (item: OwnerOption | null | undefined): string => {
  if (!item) {
    return '';
  }
  return `${item.lastName ?? ''} ${item.firstName ?? ''}`.trim();
};

const getOwnerOptionById = (ownerId?: number): OwnerOption | undefined => {
  if (!ownerId) {
    return undefined;
  }
  return getAllOwnerOptions().find((owner) => Number(owner.id) === ownerId);
};

const onFilterOwner = (inputValue: string, doneFn: (callbackFn: () => void) => void) => {
  const keyword = inputValue.toLowerCase();
  doneFn(() => {
    if (!keyword) {
      filteredOwnerOptions.value = getAllOwnerOptions();
      return;
    }
    filteredOwnerOptions.value = getAllOwnerOptions().filter((owner) => {
      const fullName = `${owner.lastName ?? ''}${owner.firstName ?? ''}`.toLowerCase();
      return (owner.lastName ?? '').toLowerCase().includes(keyword)
        || (owner.firstName ?? '').toLowerCase().includes(keyword)
        || fullName.includes(keyword);
    });
  });
};

const categoryOptions = [
  FileBaseModel.CategoryEnum.MonthlyReport,
  FileBaseModel.CategoryEnum.Receipt,
  FileBaseModel.CategoryEnum.Bill,
  FileBaseModel.CategoryEnum.Estimate,
  FileBaseModel.CategoryEnum.IncomeDetail,
  FileBaseModel.CategoryEnum.CleaningReport,
  FileBaseModel.CategoryEnum.InspectionReport,
  FileBaseModel.CategoryEnum.WorkReport,
  FileBaseModel.CategoryEnum.Contract,
  FileBaseModel.CategoryEnum.ApplicationForm,
  FileBaseModel.CategoryEnum.Insurance,
  FileBaseModel.CategoryEnum.Construction,
  FileBaseModel.CategoryEnum.Tax,
  FileBaseModel.CategoryEnum.Other,
].map((value) => ({
  label: describeCategory(value) ?? value,
  value,
}));

const archiveColumns: QTableProps['columns'] = [
  { name: 'building', label: '物件', field: (row: ArchiveRow) => row.building?.name ?? '', align: 'left' },
  { name: 'owner', label: 'オーナー', field: (row: ArchiveRow) => getOwnerNames(row.owner), align: 'left' },
  { name: 'year', label: '年', field: 'targetYear', align: 'left' },
  { name: 'month', label: '月', field: 'targetMonth', align: 'left' },
  { name: 'attachments', label: '添付数', field: (row: ArchiveRow) => row.attachments?.length ?? 0, align: 'right' },
  { name: 'visibility', label: '可視性', field: 'disabled', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'right' },
];

const attachmentColumns: QTableProps['columns'] = [
  { name: 'name', label: 'ファイル', field: 'name', align: 'left' },
  { name: 'category', label: '分類', field: 'category', align: 'left' },
  { name: 'uploadedAt', label: 'アップロード日時', field: 'uploadedAt', align: 'left' },
  { name: 'actions', label: '操作', field: 'actions', align: 'right' },
];

const uploadTarget = computed(() => {
  const archiveOwnerId = archive.value ? getPrimaryOwnerId((archive.value as ArchiveRow).owner) : undefined;
  return {
    buildingId: archive.value?.building?.id ? Number(archive.value.building.id) : searchParams.value.buildingId,
    ownerId: archiveOwnerId ?? searchParams.value.ownerId,
    targetYear: archive.value?.targetYear ?? searchParams.value.year,
    targetMonth: archive.value?.targetMonth ?? searchParams.value.month,
  };
});

const canUpload = computed(() => {
  return !!(
    uploadTarget.value.buildingId
    && uploadTarget.value.ownerId
    && uploadTarget.value.targetYear
    && uploadTarget.value.targetMonth
  );
});

const selectedArchiveLabel = computed(() => {
  if (!archive.value) {
    if (canUpload.value) {
      const buildingName = buildingOptions.value.find((building) => Number(building.id) === uploadTarget.value.buildingId)?.name ?? '-';
      const ownerName = ownerOptionLabel(getOwnerOptionById(uploadTarget.value.ownerId)) || '-';
      return `${buildingName} / ${ownerName} / ${uploadTarget.value.targetYear}年${uploadTarget.value.targetMonth}月`;
    }
    return '月度資料詳細';
  }
  const buildingName = archive.value.building?.name ?? '-';
  const ownerName = getOwnerNames(archive.value as ArchiveRow) || '-';
  return `${buildingName} / ${ownerName} / ${archive.value.targetYear}年${archive.value.targetMonth}月`;
});

const selectedArchiveDisabled = computed(() => archive.value?.disabled ?? false);

const loadOptions = async () => {
  loadingOwners.value = true;
  try {
    await Promise.all([
      buildingStore.getBuildingOptions(),
      ownerStore.getOwnerOptions(),
    ]);
    filteredOwnerOptions.value = getAllOwnerOptions();
  } catch (error) {
    await toastHandler(error);
  } finally {
    loadingOwners.value = false;
  }
};

const updateOwnerByCurrentBuilding = async (buildingId?: number) => {
  loadingOwners.value = true;
  if (!buildingId) {
    searchParams.value.ownerId = undefined;
    loadingOwners.value = false;
    return;
  }
  try {
    const currentOwner = await buildingStore.getCurrentOwner(String(buildingId));
    const ownerId = typeof currentOwner?.id === 'number'
      ? currentOwner.id
      : undefined;
    searchParams.value.ownerId = ownerId;
  } catch (error) {
    await toastHandler(error);
  } finally {
    loadingOwners.value = false;
  }
};

const handleBuildingChange = async (buildingId: number | null) => {
  searchParams.value.buildingId = buildingId ?? undefined;
  await updateOwnerByCurrentBuilding(buildingId ?? undefined);
};

const search = async () => {
  loading.value = true;
  try {
    const pageMeta = await archiveStore.getArchiveList({
      ...searchParams.value,
      page: 1,
      itemsPerPage: pagination.value.rowsPerPage,
    });
    pagination.value = {
      ...pagination.value,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? pagination.value.rowsPerPage,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const onRequest = async ({ pagination: nextPagination }: { pagination: Pagination }) => {
  loading.value = true;
  try {
    const pageMeta = await archiveStore.getArchiveList({
      ...searchParams.value,
      page: nextPagination.page,
      itemsPerPage: nextPagination.rowsPerPage,
    });
    pagination.value = {
      ...nextPagination,
      page: pageMeta.currentPage ?? nextPagination.page,
      rowsPerPage: pageMeta.itemsPerPage ?? nextPagination.rowsPerPage,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = async () => {
  await onRequest({ pagination: pagination.value });
};

const openArchive = async (row: BuildingMonthlyArchiveResponse) => {
  const ownerId = getPrimaryOwnerId((row as ArchiveRow).owner);
  if (!row.building?.id || !ownerId || !row.targetYear || !row.targetMonth) {
    await toastHandler(new Error('月度資料の識別情報が不足しています。'));
    return;
  }
  detailLoading.value = true;
  try {
    await archiveStore.getArchive(Number(row.building.id), ownerId, row.targetYear, row.targetMonth);
  } catch (error) {
    await toastHandler(error);
  } finally {
    detailLoading.value = false;
  }
};

const toggleArchiveVisibility = async (row: BuildingMonthlyArchiveResponse) => {
  if (!row.id) {
    await toastHandler(new Error('月度資料IDが見つかりません。'));
    return;
  }
  visibilityLoadingId.value = row.id;
  try {
    if (row.disabled) {
      await archiveStore.enableArchive(row.id);
    } else {
      await archiveStore.disableArchive(row.id);
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    visibilityLoadingId.value = null;
  }
};

const openUploadDialog = () => {
  uploadCategory.value = null;
  uploadFile.value = null;
  showUploadDialog.value = true;
};

const submitUpload = async () => {
  const { buildingId, ownerId, targetYear, targetMonth } = uploadTarget.value;
  if (!buildingId || !ownerId || !targetYear || !targetMonth) {
    await toastHandler(new Error('アップロード対象の月度資料を選択してください。'));
    return;
  }
  if (!uploadCategory.value || !uploadFile.value) {
    await toastHandler(new Error('分類とファイルを入力してください。'));
    return;
  }
  uploadLoading.value = true;
  try {
    await archiveStore.uploadAttachment({
      id: buildingId,
      ownerId,
      targetYear,
      targetMonth,
      category: uploadCategory.value,
      name: uploadFile.value.name,
      file: uploadFile.value,
    });
    showUploadDialog.value = false;
    await search();
  } catch (error) {
    await toastHandler(error);
  } finally {
    uploadLoading.value = false;
  }
};

const deleteAttachment = async (file: FileBase) => {
  if (!file.id) {
    return;
  }
  $q.dialog({
    title: '書類削除',
    message: `「${file.name}」を削除しますか？`,
    ok: { label: '確認', color: 'negative' },
    cancel: { label: 'キャンセル', color: 'grey-8' },
    persistent: true,
  }).onOk(async () => {
    try {
      await archiveStore.deleteAttachment(Number(file.id));
      const ownerId = archive.value ? getPrimaryOwnerId((archive.value as ArchiveRow).owner) : undefined;
      if (archive.value?.building?.id && ownerId && archive.value.targetYear && archive.value.targetMonth) {
        await archiveStore.getArchive(
          Number(archive.value.building.id),
          ownerId,
          archive.value.targetYear,
          archive.value.targetMonth,
        );
      }
      await search();
    } catch (error) {
      await toastHandler(error);
    }
  });
};

onMounted(async () => {
  await loadOptions();
  await search();
});
</script>

<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-xl-4">
        <q-card bordered>
          <q-card-section class="text-h6">
            月度資料検索
          </q-card-section>
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                :model-value="searchParams.buildingId"
                @update:model-value="handleBuildingChange"
                label="物件"
                clearable
                emit-value
                map-options
                option-value="id"
                option-label="name"
                :options="buildingOptions as BuildingOptionsResponse[]"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="searchParams.ownerId"
                label="オーナー"
                clearable
                emit-value
                map-options
                option-value="id"
                :option-label="ownerOptionLabel"
                :options="filteredOwnerOptions"
                @filter="onFilterOwner"
                use-input
                :loading="loadingOwners"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="searchParams.year"
                label="年"
                clearable
                emit-value
                map-options
                :options="yearOptions"
              />
            </div>
            <div class="col-6">
              <q-select
                v-model="searchParams.month"
                label="月"
                clearable
                emit-value
                map-options
                :options="monthOptions"
              />
            </div>
            <div class="col-12">
              <q-select
                v-model="searchParams.category"
                label="添付分類"
                clearable
                emit-value
                map-options
                :options="categoryOptions"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="検索" icon="sym_r_search" @click="search" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-xl-8">
        <q-card bordered>
          <q-card-section class="q-pa-none">
            <q-table
              :loading="loading"
              :columns="archiveColumns"
              :rows="archiveList"
              row-key="id"
              hide-pagination
              v-model:pagination="pagination"
              @request="onRequest"
            >
              <template #top-left>
                <div class="text-h6">月度資料一覧</div>
              </template>
              <template #[`body-cell-attachments`]="{ row }: { row: BuildingMonthlyArchiveResponse }">
                <q-td class="text-right">
                  {{ row.attachments?.length ?? 0 }}
                </q-td>
              </template>
              <template #[`body-cell-visibility`]="{ row }: { row: BuildingMonthlyArchiveResponse }">
                <q-td>
                  <q-badge
                    v-if="row.disabled"
                    color="red"
                    label="不可"
                  />
                  <q-badge
                    v-else
                    color="green"
                    label="可"
                  />
                </q-td>
              </template>
              <template #[`body-cell-actions`]="{ row }: { row: BuildingMonthlyArchiveResponse }">
                <q-td class="text-right">
                  <q-btn
                    flat
                    dense
                    size="sm"
                    :icon="row.disabled ? 'sym_r_visibility' : 'sym_r_visibility_off'"
                    :loading="visibilityLoadingId === row.id"
                    @click="toggleArchiveVisibility(row)"
                  />
                  <q-btn flat dense size="sm" icon="sym_r_folder_open" @click="openArchive(row)" />
                </q-td>
              </template>
            </q-table>
            <div class="row justify-center q-my-md">
              <q-pagination
                v-model="pagination.page"
                color="primary"
                :max="paginationMax"
                max-pages="9"
                @update:model-value="onPageChange"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-card bordered class="q-mt-md">
          <q-card-section class="row items-center justify-between">
            <div class="row items-center q-col-gutter-sm">
              <div class="col-auto text-h6">{{ selectedArchiveLabel }}</div>
              <div v-if="archive" class="col-auto">
                <q-badge
                  v-if="selectedArchiveDisabled"
                  color="red"
                  label="不可"
                />
                <q-badge
                  v-else
                  color="green"
                  label="可"
                />
              </div>
            </div>
            <div class="row items-center q-gutter-sm">
              <q-btn
                v-if="archive?.id"
                :color="selectedArchiveDisabled ? 'positive' : 'warning'"
                :label="selectedArchiveDisabled ? '可視化' : '不可視化'"
                :icon="selectedArchiveDisabled ? 'sym_r_visibility' : 'sym_r_visibility_off'"
                :loading="visibilityLoadingId === archive.id"
                @click="toggleArchiveVisibility(archive)"
              />
              <q-btn
                color="primary"
                label="添付アップロード"
                icon="sym_r_upload_file"
                :disable="!canUpload"
                @click="openUploadDialog"
              />
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <q-table
              :loading="detailLoading || uploadLoading"
              :columns="attachmentColumns"
              :rows="attachments"
              row-key="id"
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
            >
              <template #no-data>
                <div class="full-width text-center q-pa-lg text-grey-7">
                  月度資料を選択してください。
                </div>
              </template>
              <template #[`body-cell-name`]="{ row }: { row: FileBase }">
                <q-td>
                  <a :href="row.url" target="_blank">{{ row.name }}</a>
                </q-td>
              </template>
              <template #[`body-cell-category`]="{ row }: { row: FileBase }">
                <q-td>{{ row.category ? describeCategory(row.category) : '' }}</q-td>
              </template>
              <template #[`body-cell-actions`]="{ row }: { row: FileBase }">
                <q-td class="text-right">
                  <q-btn flat dense size="sm" icon="sym_r_delete" @click="deleteAttachment(row)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showUploadDialog" persistent>
      <q-card class="upload-dialog">
        <q-card-section class="text-h6">添付アップロード</q-card-section>
        <q-card-section class="row q-col-gutter-md">
          <div class="col-12">
            <q-select
              v-model="uploadCategory"
              label="分類"
              emit-value
              map-options
              :options="categoryOptions"
            />
          </div>
          <div class="col-12">
            <q-file
              v-model="uploadFile"
              label="ファイル"
              clearable
            />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat color="negative" label="閉じる" @click="showUploadDialog = false" />
          <q-btn color="primary" label="アップロード" :loading="uploadLoading" @click="submitUpload" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.upload-dialog {
  width: 520px;
  max-width: 90vw;
}
</style>
