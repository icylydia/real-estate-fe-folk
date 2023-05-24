<template>
  <div class="text-h6">
    社員基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newEmployee">
      <q-item-section>
        <q-input v-model="employee.id" label="物件ID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.lastName" label="姓" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.firstName" label="名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="employee.email" label="メールアドレス" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.phone" label="電話番号" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.birthday" label="生年月日" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-select
          v-model="employee.department"
          use-chips
          label="部署"
          :options="options"
          @filter="filterFn"
          :readonly="readonly"
          use-input
        >
        </q-select>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDepartmentStore } from 'stores/department-store';
import { DepartmentInResponse } from 'src/api';

const options = ref<Array<{
  label: string | undefined;
  value: string | number | undefined;
}> | undefined>(undefined);

enum DepartmentLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const departmentsStatus = ref<DepartmentLoadingStatus>(DepartmentLoadingStatus.BeforeLoad);

const {getFlattenedDepartmentList, getDepartmentList} = useDepartmentStore();

const departmentToOption = (department: DepartmentInResponse) => ({
  label: department.name,
  value: department.id,
});

const getAllDepartmentOptions = () => {
  const departmentList = getFlattenedDepartmentList();
  return departmentList.map(departmentToOption);
};

const filterFn = (val: string, update: () => void) => {
  if (
    departmentsStatus.value === DepartmentLoadingStatus.BeforeLoad
    || departmentsStatus.value === DepartmentLoadingStatus.Aborted
  ) {
    departmentsStatus.value = DepartmentLoadingStatus.Loading;
    getDepartmentList()
      .then(() => {
        departmentsStatus.value = DepartmentLoadingStatus.Loaded;
        options.value = getAllDepartmentOptions();
        update();
      })
      .catch(() => {
        departmentsStatus.value = DepartmentLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    options.value = getAllDepartmentOptions();
  } else {
    options.value = getAllDepartmentOptions().filter((v) => {
      return v.label && v.label.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useEmployeeStore } from 'stores/employee-store';

export default defineComponent({
  name: 'EmployeeForm',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    newEmployee: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useEmployeeStore, {
      employee: 'formModel',
    }),
  },
});
</script>
