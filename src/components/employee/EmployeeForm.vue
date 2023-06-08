<script setup lang="ts">
import { ref } from 'vue';
import { useDepartmentStore } from 'stores/department-store';
import { DepartmentInResponse } from 'src/api';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from 'stores/employee-store';
import { useGender } from 'src/utils/gender';

const options = ref<Array<{
  name: string | undefined;
  id: string | number | undefined;
}> | undefined>(undefined);

const { selectOptions: genderOptions } = useGender()

enum DepartmentLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const departmentsStatus = ref<DepartmentLoadingStatus>(DepartmentLoadingStatus.BeforeLoad);

const {getFlattenedDepartmentList, getDepartmentList} = useDepartmentStore();

const departmentToOption = (department: DepartmentInResponse) => ({
  name: department.name,
  id: department.id,
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
      return v.name && v.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
};

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newEmployee: {
    type: Boolean,
    default: false,
  },
});

const { formModel: employee } = storeToRefs(useEmployeeStore());
</script>

<template>
  <div class="text-h6">
    社員基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newEmployee">
      <q-item-section>
        <q-input v-model="employee.id" label="社員ID" readonly />
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
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.lastNameKana" label="姓(カナ)" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="employee.firstNameKana" label="名(カナ)" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="employee.gender"
          label="性別"
          :readonly="readonly"
          emit-value
          map-options
          :options="genderOptions"
          clearable
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
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
          v-model="employee.departments"
          use-chips
          label="部署"
          :options="options"
          option-label="name"
          option-value="id"
          @filter="filterFn"
          :readonly="readonly"
          use-input
          multiple
        >
        </q-select>
      </q-item-section>
    </q-item>
  </q-list>
</template>
