<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useOwnerStore } from 'stores/owner-store';
import { storeToRefs } from 'pinia';
import { QTableProps } from 'quasar';
import { useGender } from 'src/utils/gender';
import { useRouter } from 'vue-router';
import { TenantInResponse } from 'src/api';

const loading = ref(false)
const { ownerList: owners } = storeToRefs(useOwnerStore());
const { getOwnerList, reset: resetOwnerList } = useOwnerStore();

const loadOwners = async () => {
  loading.value = true;
  try {
    resetOwnerList();
    await getOwnerList();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await loadOwners();
});

const searchText = ref('');
const search = async () => {
  await loadOwners()
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

const columns: QTableProps['columns'] = [
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
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <q-table
          flat
          title="オーナー一覧"
          :rows="owners"
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
              label="新規オーナー"
              @click="newOwner"
            />
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
          <template #[`body-cell-actions`]="{ key }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="ownerDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editOwner(key)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped lang="scss">

</style>
