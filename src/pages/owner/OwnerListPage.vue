<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { useOwnerStore } from 'stores/owner-store';
import { storeToRefs } from 'pinia';
import { QTable, QTableProps, useQuasar } from 'quasar';
import { useGender } from 'src/utils/gender';
import { useRouter } from 'vue-router';
import { OwnerInResponse, TenantInResponse } from 'src/api';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false)
const tableRef = ref<QTable | null>(null);
const { ownerList: owners } = storeToRefs(useOwnerStore());
const { getOwnerList, deleteOwner } = useOwnerStore();
const { toastHandler } = useErrorHandler();

const onRequest = async ({ pagination: _pagination }: { pagination: Pagination}) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const pageMeta = await getOwnerList(
      rowsPerPage,
      page,
      searchId.value ?? null,
      searchName.value ?? null,
      searchEmail.value ?? null,
      searchPhone.value ?? null,
    );
    pagination.value = {
      sortBy: undefined,
      descending: false,
      page: pageMeta.currentPage ?? 1,
      rowsPerPage: pageMeta.itemsPerPage ?? 15,
      rowsNumber: pageMeta.total ?? 0,
    };
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  tableRef.value?.requestServerInteraction();
});

const searchId = ref('');
const searchName = ref('');
const searchEmail = ref('');
const searchPhone = ref('');
const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

const { describe: describeGender } = useGender();

const router = useRouter();

const newOwner = () => {
  router.push({
    name: 'owner-create',
  });
};

const ownerDetail = (key: string) => {
  router.push({
    name: 'owner-detail',
    params: { id: key },
  });
};

const editOwner = (key: string) => {
  router.push({
    name: 'owner-edit',
    params: { id: key },
  });
};

const $q = useQuasar();

const removeOwner = (owner: OwnerInResponse) => {
  $q.dialog({
    title: 'オーナー削除',
    message: `オーナー「${owner.lastName} ${owner.firstName}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!owner.id) {
      return;
    }
    try {
      await deleteOwner(owner.id);
    } catch (e) {
      console.error(e);
    }

    tableRef.value?.requestServerInteraction();
  });
};

const columns: QTableProps['columns'] = [
  {
    label: 'ID',
    field: 'id',
    name: 'id',
    sortable: false,
    align: 'left',
  },
  {
    label: 'オーナー名',
    field: 'name',
    name: 'name',
    sortable: false,
    align: 'left',
  },
  {
    label: '性別',
    field: 'gender',
    name: 'gender',
    sortable: false,
    align: 'left',
  },
  {
    label: 'メールアドレス',
    field: 'email',
    name: 'email',
    sortable: false,
    align: 'left',
  },
  {
    label: '電話番号',
    field: 'phone',
    name: 'phone',
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

type Pagination = {
  sortBy?: string;
  descending?: boolean;
  page?: number;
  rowsPerPage?: number;
  rowsNumber?: number;
};

const pagination: Ref<Pagination> = ref({
  sortBy: undefined,
  descending: false,
  page: 1,
  rowsPerPage: 15,
  rowsNumber: 0,
});

const paginationMax = computed(() => {
  if (!pagination.value.rowsPerPage || !pagination.value.rowsNumber) {
    return 0;
  }
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
});
const onPageChange = async () => {
  tableRef.value?.requestServerInteraction({ pagination: pagination.value });
};

</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          dense
          title="オーナー一覧"
          :rows="owners"
          :columns="columns"
          row-key="id"
          :loading="loading"
          hide-pagination
          v-model:pagination="pagination"
          @request="onRequest"
          ref="tableRef"
        >
          <template #top>
            <div id="top1" class="flex justify-between">
              <div class="title">オーナー一覧</div>
              <q-btn
                color="primary"
                icon="sym_r_add"
                label="新規オーナー"
                @click="newOwner"
              />
            </div>
          </template>
          <template #[`body-cell-name`]="{ row }: { row: TenantInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'owner-detail',
                  params: { id: row.id },
                }).href"
              >
                {{ row.lastName }} {{ row.firstName }}
              </a>
            </q-td>
          </template>
          <template #[`body-cell-gender`]="{ row }: { row: TenantInResponse}">
            <q-td>
              {{ describeGender(row.gender) }}
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key, row }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="ownerDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editOwner(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeOwner(row)" />
            </q-td>
          </template>
          <template #bottom-row>
            <q-td>
              <q-input
                square
                dense
                label="ID"
                style="width: 60px"
                class="q-mr-sm"
                v-model="searchId"
                @keyup.enter="search"
              />
            </q-td>
            <q-td>
              <q-input
                square
                dense
                label="名前"
                style="width: 120px"
                class="q-mr-sm"
                v-model="searchName"
                @keyup.enter="search"
              />
            </q-td>
            <q-td>
            </q-td>
            <q-td>
              <q-input
                square
                dense
                label="メールアドレス"
                style="width: 120px"
                class="q-mr-sm"
                v-model="searchEmail"
                @keyup.enter="search"
              />
            </q-td>
            <q-td>
              <q-input
                square
                dense
                label="電話番号"
                style="width: 120px"
                class="q-mr-sm"
                v-model="searchPhone"
                @keyup.enter="search"
              />
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
  </q-page>
</template>

<style scoped lang="scss">
#top1 {
  flex: 0 0 100%;
  margin-bottom: 12px;
  .title {
    font-size: 20px;
    letter-spacing: 0.005em;
    font-weight: 400;
  }
}
#top2 {
  flex: 0 0 100%;
  border-radius: 4px;
  border: 1px solid #c8c8c8;
  padding: 8px;
}
</style>
