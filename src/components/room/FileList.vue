<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from 'stores/room-store';
import { computed, ref } from 'vue';
import { QTableProps } from 'quasar';
import { FileBase } from 'src/api';
import { useFile } from 'src/utils/file';
import FileDialog from 'components/room/FileDialog.vue';

const handleDialogSubmit = (file: FileBase) => {
  console.log(file);
}

const { formModel: room } = storeToRefs(useRoomStore());
const { resetFileModel } = useRoomStore();
const files = computed(() => room.value.files);

const { describeCategory } = useFile();

const showDialog = ref(false);
const showAddingDialog = () => {
  resetFileModel();
  showDialog.value = true;
}

const columns: QTableProps['columns'] = [
  {
    label: 'ファイル名',
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
    field: 'uploadTime',
    name: 'uploadTime',
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
    no-data-label="ファイルがありません"
  >
    <template #top-left>
      <div class="text-h6">ファイル一覧</div>
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
    <template #[`body-cell-uploadTime`]="{ row }: { row: FileBase }">
      <q-td>
        {{ $filters.dateTime(row.uploadedAt, "minute") }}
      </q-td>
    </template>
    <template #[`body-cell-actions`]>
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_download" @click="() => {}" />
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="() => {}" />
      </q-td>
    </template>
  </q-table>
  <file-dialog
    :show="showDialog"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>
