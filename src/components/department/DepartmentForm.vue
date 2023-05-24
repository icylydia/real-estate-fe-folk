<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'stores/department-store';
import { EmployeeBase } from 'src/api';
import { ref } from 'vue';
import { useEmployeeStore } from 'stores/employee-store';

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newDepartment: {
    type: Boolean,
    default: false,
  },
})

const { formModel: department } = storeToRefs(useDepartmentStore());

const options = ref<EmployeeBase[] | undefined>(undefined);
enum EmployeeLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const employeeLoadingStatus = ref<EmployeeLoadingStatus>(EmployeeLoadingStatus.BeforeLoad);

const { getEmployeeList } = useEmployeeStore();
const { list: employees } = storeToRefs(useEmployeeStore());

const filterFn = (val: string, update: () => void) => {
  if (
    employeeLoadingStatus.value === EmployeeLoadingStatus.BeforeLoad
    || employeeLoadingStatus.value === EmployeeLoadingStatus.Aborted
  ) {
    employeeLoadingStatus.value = EmployeeLoadingStatus.Loading;
    getEmployeeList()
      .then(() => {
        employeeLoadingStatus.value = EmployeeLoadingStatus.Loaded;
        options.value = employees.value;
        update();
      })
      .catch(() => {
        employeeLoadingStatus.value = EmployeeLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    options.value = employees.value;
  } else {
    options.value = employees.value.filter((v) => {
      const fullName = v.lastName ?? '' + v.firstName ?? '';
      return fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
}
</script>

<template>
  <div class="text-h6">
    部署基本情報{{ readonly ? '（閲覧）' : '（編集）' }}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newDepartment">
      <q-item-section>
        <q-input v-model="department.id" label="部署ID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="department.name" label="部署名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="department.leader"
          use-chips
          label="部署リーダー"
          :options="options"
          :option-label="(option: EmployeeBase) => option.lastName + ' ' + option.firstName"
          option-value="id"
          @filter="filterFn"
          :readonly="readonly"
          use-input
        >
        </q-select>
      </q-item-section>
    </q-item>
  </q-list>
</template>
