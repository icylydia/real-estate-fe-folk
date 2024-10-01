<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { FileBase } from 'src/api';
import { useApi } from 'boot/api';
import useErrorHandler from 'components/app/useErrorHandler';
import { QTableProps, useQuasar } from 'quasar';
import FileDialog from 'components/report/FileDialog.vue';
import { useFileStore } from 'stores/file-store';
import { useFile } from 'src/utils/file';

const { toastHandler } = useErrorHandler();

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  reportId: {
    type: Number,
    required: true,
  },
});

defineEmits([
  'update:show',
]);

const columns: QTableProps['columns'] = [
  {
    label: 'ファイル',
    field: 'file',
    name: 'file',
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
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
];

const loading = ref(false);
const saving = ref(false);
const attachments = ref<Array<FileBase>>([]);

const api = useApi();
const loadAttachments = async () => {
  loading.value = true;
  try {
    if (props.reportId !== undefined) {
      attachments.value  = await api.getFileList('monthly_report', props.reportId);
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const cleanup = () => {
  attachments.value = [];
};

watch(() => props.show, async (show) => {
  if (show) {
    loading.value = true;
    await loadAttachments();
    await nextTick(() => {
      loading.value = false;
    });
  } else {
    cleanup();
  }
});

const showDialog = ref(false);
const showAddingDialog = () => {
  showDialog.value = true;
}
const handleDialogSubmit = async (data: FileBase, file: File | undefined) => {
  if (!file || !data.category) {
    return;
  }
  saving.value = true;
  try {
    if (props.reportId !== undefined) {
      const formData: FileBase = {
        category: data.category,
        name: file.name,
        entity: FileBase.EntityEnum.MonthlyReport,
        entityId: props.reportId.toString(),
      };
      const resp = await useFileStore().uploadFile(formData, file);
      if (resp) {
        await loadAttachments();
      } else {
        throw new Error('ファイルのアップロードに失敗しました');
      }
    }
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
    showDialog.value = false;
  }
};

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
      await loadAttachments();
    } catch (e) {
      await toastHandler('ファイルの削除に失敗しました');
    }
  });
};

const { describeCategory } = useFile();
</script>

<template>
  <q-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    persistent
  >
    <q-card class="card">
      <q-card-section>
        <q-table
          flat
          dense
          :binary-state-sort="false"
          :rows="attachments"
          :columns="columns"
          card-container-class="q-pa-none"
          row-key="id"
          hide-bottom
          :pagination="{
            rowsPerPage: 0
          }"
          :loading="loading || saving"
        >
          <template #top-left>
            <div class="text-h6">添付ファイル</div>
          </template>
          <template #top-right>
            <q-btn
              color="primary"
              icon="sym_r_add"
              @click="showAddingDialog"
            >
              アップロード
            </q-btn>
          </template>
          <template #[`body-cell-file`]="{ row }: { row: FileBase }">
            <q-td>
              <a :href="row.url" target="_blank">{{ row.name }}</a>
            </q-td>
          </template>
          <template #[`body-cell-category`]="{ row }: { row: FileBase }">
            <q-td>
              {{ describeCategory(row.category) }}
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ row }: { row: FileBase }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="deleteFile(row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="閉じる"
          @click="$emit('update:show', false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <file-dialog
    :show="showDialog"
    @update:show="showDialog = $event"
    @submit="handleDialogSubmit"
  />
</template>

<style lang="scss" scoped>
.card {
  width: 700px;
  max-width: 80vw;
}
</style>
