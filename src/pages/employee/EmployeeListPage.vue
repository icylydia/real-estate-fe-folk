<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { EmployeeModel, useEmployeeStore } from 'stores/employee-store';
import { QTableProps } from 'quasar';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toCreatePage = () => {
  router.push({
    name: 'employee-create'
  });
};

const loading = ref(false);

const { list: employees } = storeToRefs(useEmployeeStore());
const { getEmployeeList, reset: resetEmployeeList } = useEmployeeStore();

onMounted(async () => {
  loading.value = true;
  try {
    resetEmployeeList();
    await getEmployeeList();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const columns: QTableProps['columns'] = [
  {
    label: '名前',
    field: 'name',
    name: 'name',
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
    label: '部署',
    field: 'department',
    name: 'department',
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

const employeeDetail = (key: number) => {
  router.push({
    name: 'employee-detail',
    params: {
      id: key,
    },
  });
};

const editEmployee = (key: number) => {
  router.push({
    name: 'employee-edit',
    params: {
      id: key,
    },
  });
};

const removeEmployee = (key: number) => {
  console.log('remove employee', key);
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="fit row justify-between">
          <div class="text-h6">社員一覧</div>
          <q-btn
            color="primary"
            icon="add"
            label="社員を追加"
            @click="toCreatePage"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <q-table
          flat
          :rows="employees"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :grid="$q.screen.lt.md"
          hide-bottom
          :pagination="{
            rowsPerPage: 0,
          }"
        >
          <template #[`body-cell-name`]="{ row }: { row: EmployeeModel }">
            <q-td>
              {{ row.lastName }} {{ row.firstName }}
            </q-td>
          </template>
          <template #[`body-cell-department`]="{ row }: { row: EmployeeModel }">
            <q-td>
              {{ row.department.name }}
            </q-td>
          </template>
          <template #[`body-cell-actions`]="{ key }">
            <q-td class="text-right">
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="employeeDetail(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editEmployee(key)" />
              <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeEmployee(key)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
