<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'stores/department-store';
import { QTableProps } from 'quasar';
import { EmployeeModel } from 'stores/employee-store';
import { useRouter } from 'vue-router';

const { formModel: department } = storeToRefs(useDepartmentStore());

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
  }
];

const router = useRouter();

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
  <q-table
    flat
    :rows="department.employees"
    :columns="columns"
    row-key="id"
    :grid="$q.screen.lt.md"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #top-left>
      <div class="text-h6">部員一覧</div>
    </template>
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
</template>
