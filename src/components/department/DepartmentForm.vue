<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from 'stores/department-store';
import { DepartmentInResponse, EmployeeBase } from 'src/api';
import { computed, ref } from 'vue';
import { useEmployeeStore } from 'stores/employee-store';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm } from 'vee-validate';

const props = defineProps({
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

const leaderOptions = ref<EmployeeBase[] | undefined>(undefined);
enum EmployeeLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}

const employeeLoadingStatus = ref<EmployeeLoadingStatus>(EmployeeLoadingStatus.BeforeLoad);

const { getEmployeeList } = useEmployeeStore();
const { list: employees } = storeToRefs(useEmployeeStore());

const leaderFilter = (val: string, update: () => void) => {
  if (
    employeeLoadingStatus.value === EmployeeLoadingStatus.BeforeLoad
    || employeeLoadingStatus.value === EmployeeLoadingStatus.Aborted
  ) {
    employeeLoadingStatus.value = EmployeeLoadingStatus.Loading;
    getEmployeeList()
      .then(() => {
        employeeLoadingStatus.value = EmployeeLoadingStatus.Loaded;
        leaderOptions.value = employees.value;
        update();
      })
      .catch(() => {
        employeeLoadingStatus.value = EmployeeLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    leaderOptions.value = employees.value;
  } else {
    leaderOptions.value = employees.value.filter((v) => {
      const fullName = v.lastName ?? '' + v.firstName ?? '';
      return fullName.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
}

const parentDepartmentOptions = ref<DepartmentInResponse[] | undefined>(undefined);
enum DepartmentLoadingStatus {
  BeforeLoad = 0,
  Loading = 1,
  Loaded = 2,
  Aborted = 3,
}
const { getDepartmentList } = useDepartmentStore();
const { list: parentDepartments } = storeToRefs(useDepartmentStore());

const departmentLoadingStatus = ref<DepartmentLoadingStatus>(DepartmentLoadingStatus.BeforeLoad);

const departmentFilter = (val: string, update: () => void) => {
  if (
    departmentLoadingStatus.value === DepartmentLoadingStatus.BeforeLoad
    || departmentLoadingStatus.value === DepartmentLoadingStatus.Aborted
  ) {
    departmentLoadingStatus.value = DepartmentLoadingStatus.Loading;
    getDepartmentList()
      .then(() => {
        departmentLoadingStatus.value = DepartmentLoadingStatus.Loaded;
        parentDepartmentOptions.value = parentDepartments.value;
        update();
      })
      .catch(() => {
        departmentLoadingStatus.value = DepartmentLoadingStatus.Aborted;
      });
  }
  if (val === '') {
    parentDepartmentOptions.value = parentDepartments.value;
  } else {
    parentDepartmentOptions.value = parentDepartments.value.filter((v) => {
      const name = v.name ?? '';
      return name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }
  update();
}

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  name: string().required().label('部署名'),
  parent: object().nullable().label('親部署'),
  leader: object().nullable().label('部署リーダー'),
}));

const initialValues: any = computed(() => {
  if (props.newDepartment) {
    return {};
  }
  return department.value;
});

const { validate } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
});
</script>

<template>
  <div class="text-h6" v-if="!newDepartment">
    部署基本情報{{ readonly ? '（閲覧）' : '（編集）' }}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newDepartment">
      <q-item-section>
        <q-input v-model="department.id" label="部署ID" readonly />
      </q-item-section>
    </q-item>
    <Field name="name" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="部署名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="parent" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            use-chips
            label="親部署"
            :options="parentDepartmentOptions"
            :option-label="(option: DepartmentInResponse) => option.name ?? ''"
            option-value="id"
            @filter="departmentFilter"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="leader" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            use-chips
            label="部署リーダー"
            :options="leaderOptions"
            :option-label="(option: EmployeeBase) => option.lastName + ' ' + option.firstName"
            option-value="id"
            @filter="leaderFilter"
            :readonly="readonly"
            use-input
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
</template>
