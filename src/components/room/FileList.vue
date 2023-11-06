<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from 'stores/room-store';
import { computed, ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { FileBase } from 'src/api';
import { useFile } from 'src/utils/file';
import FileDialog from 'components/room/FileDialog.vue';
import { useFileStore } from 'stores/file-store';
import useErrorHandler from 'components/app/useErrorHandler';
import { useBuildingStore } from 'stores/building-store';

const { toastHandler } = useErrorHandler();

const handleDialogSubmit = async (data: FileBase, file: File) => {
  if (!file) return;
  if (!data.category) return;
  const formData: FileBase = {
    category: data.category,
    name: file.name,
    entity: FileBase.EntityEnum.Room,
    entityId: room.value.id,
  }
  try {
    const resp = await useFileStore().uploadFile(formData, file);
    if (resp) {
      useRoomStore().appendFile(resp);
    }
  } catch (e) {
    toastHandler('ファイルのアップロードに失敗しました');
  }
}

const { formModel: room } = storeToRefs(useRoomStore());
const files = computed(() => room.value.files);

const { describeCategory } = useFile();

const showDialog = ref(false);
const showAddingDialog = () => {
  useRoomStore().resetFileModel();
  showDialog.value = true;
}

const $q = useQuasar();
const deleteFile = async (file: FileBase) => {
  $q.dialog({
    title: '書類削除',
    message: `「${file.name}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!file.id) return;
    try {
      await useFileStore().deleteFile(file.id);
      useBuildingStore().removeFile(file.id);
    } catch (e) {
      toastHandler('ファイルの削除に失敗しました');
    }
  });
}

const columns: QTableProps['columns'] = [
  {
    label: '書類名',
    field: 'name',
    name: 'name',
    sortable: false,
    align: 'left',
  },
  {
    label: 'カテゴリー',
    field: 'category',
    name: 'category',
    sortable: false,
    align: 'left',
  },
  {
    label: 'アップロード日時',
    field: 'uploadedAt',
    name: 'uploadedAt',
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
]
</script>

<template>
  <q-table
    flat
    :rows="files"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 5,
    }"
    no-data-label="書類がありません"
  >
    <template #top-left>
      <div class="text-h6">書類一覧</div>
    </template>
    <template #top-right>
      <q-btn label="アプロード" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="showAddingDialog" />
    </template>
    <template #[`body-cell-name`]="{ row }: { row: FileBase }">
      <q-td>
        <a :href="row.url" target="_blank">
          {{ row.name }}
        </a>
      </q-td>
    </template>
    <template #[`body-cell-category`]="{ row }: { row: FileBase }">
      <q-td>
        {{ describeCategory(row.category) }}
      </q-td>
    </template>
    <template #[`body-cell-uploadedAt`]="{ row }: { row: FileBase }">
      <q-td>
        {{ $filters.dateTime(row.uploadedAt, "minute") }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ row }: { row: FileBase }">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="deleteFile(row)" />
      </q-td>
    </template>
  </q-table>
  <file-dialog
    :show="showDialog"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>
