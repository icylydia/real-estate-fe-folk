<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTenantStore } from 'stores/tenant-store';
import { TenantInResponse } from 'src/api';
import { useRouter } from 'vue-router';
import { QTableProps } from 'quasar';
import { useGender } from 'src/utils/gender';

const loading = ref(false);

const loadTenants = async () => {
  loading.value = true;
  try {
    resetTenantList()
    await getTenantList();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadTenants();
});

const { tenantList: tenants } = storeToRefs(useTenantStore());
const { getTenantList, reset: resetTenantList } = useTenantStore();

const columns: QTableProps['columns'] = [
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

const newTenant = () => {
  router.push({
    name: 'tenant-create',
  });
};

const searchText = ref('');
const search = async () => {
  await loadTenants()
};

const { describe: describeGender } = useGender();
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
        >
          <template #top-right>
            <q-input
              outlined
              dense
              placeholder="検索"
              class="q-mr-sm"
              v-model="searchText"
              @keydown.enter.prevent="search"
            >
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
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
          <template #[`body-cell-actions`]="{ key }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="tenantDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editTenant(key)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
