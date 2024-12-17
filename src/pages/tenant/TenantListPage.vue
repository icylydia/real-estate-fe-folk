<script setup lang="ts">
import type { Ref } from 'vue';
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTenantStore } from 'stores/tenant-store';
import type { TenantInResponse } from 'src/api';
import { useRouter } from 'vue-router';
import type { QTable, QTableProps } from 'quasar';
import { useQuasar } from 'quasar';
import { useGender } from 'src/utils/gender';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const { toastHandler } = useErrorHandler();

const onRequest = async ({ pagination: _pagination }: { pagination: Pagination}) => {
  try {
    loading.value = true;
    const { page, rowsPerPage } = _pagination;
    const pageMeta = await useTenantStore().getTenantList(
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
      rowsPerPage: pageMeta.itemsPerPage ?? 10,
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

const { tenantList: tenants } = storeToRefs(useTenantStore());
const searchId = ref('');
const searchName = ref('');
const searchEmail = ref('');
const searchPhone = ref('');

const columns: QTableProps['columns'] = [
  {
    label: 'ID',
    field: 'id',
    name: 'id',
    sortable: false,
    align: 'left',
  },
  {
    label: '入居者名',
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

const router = useRouter();

const tenantDetail = (key: string) => {
  router.push({
    name: 'tenant-detail',
    params: { id: key },
  });
};

const editTenant = (key: string) => {
  router.push({
    name: 'tenant-edit',
    params: { id: key },
  });
};

const $q = useQuasar();

const removeTenant = (tenant: TenantInResponse) => {
  $q.dialog({
    title: '入居者削除',
    message: `入居者「${tenant.lastName} ${tenant.firstName}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!tenant.id) {
      return;
    }
    try {
      await useTenantStore().deleteTenant(tenant.id);
    } catch (e) {
      console.error(e);
    }

    tableRef.value?.requestServerInteraction();
  });
}

const newTenant = () => {
  router.push({
    name: 'tenant-create',
  });
};

const search = async () => {
  tableRef.value?.requestServerInteraction({ pagination: { ...pagination.value, page: 1 } });
};

const { describe: describeGender } = useGender();

type Pagination = {
  sortBy?: string;
  descending?: boolean;
  page: number;
  rowsPerPage?: number;
  rowsNumber?: number;
};

const pagination: Ref<Pagination> = ref({
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
  return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
});

const tableRef = ref<QTable | null>(null);
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
          title="入居者一覧"
          :rows="tenants"
          :columns="columns"
          row-key="id"
          :loading="loading"
          hide-pagination
          v-model:pagination="pagination"
          @request="onRequest"
          ref="tableRef"
        >
          <template #top-right>
            <q-btn
              color="primary"
              icon="sym_r_add"
              label="新規入居者"
              @click="newTenant"
            />
          </template>
          <template #[`body-cell-name`]="{ row }: { row: TenantInResponse }">
            <q-td>
              <a
                :href="$router.resolve({
                  name: 'tenant-detail',
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
          <template #[`body-cell-actions`]="{ key, row }: { key: string, row: TenantInResponse }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="tenantDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editTenant(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeTenant(row)" />
            </q-td>
          </template>
          <template #top-row>
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
            <q-td class="text-right">
              <q-btn
                label="検索"
                color="primary"
                @click="search"
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
