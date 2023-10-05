<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDepartmentStore } from 'stores/department-store';
import { DepartmentInResponse } from 'src/api';
import { storeToRefs } from 'pinia';
import { useEmployeeStore } from 'stores/employee-store';
import { useGender } from 'src/utils/gender';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm } from 'vee-validate';

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

const props = defineProps({
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

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  lastName: string().required().label('姓'),
  firstName: string().required().label('名'),
  lastNameKana: string().nullable().label('姓(カナ)'),
  firstNameKana: string().nullable().label('名(カナ)'),
  gender: string().nullable().label('性別'),
  email: string().email().nullable().label('メールアドレス'),
  phone: string()
    .phone()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('電話番号'),
  birthday: string()
    .birthday()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('生年月日'),
}));

const initialValues: any = computed( () => {
  if (props.newEmployee) {
    return {};
  }
  return employee.value;
});

const { validate } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
})
</script>

<template>
  <div class="text-h6" v-if="!newEmployee">
    社員基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newEmployee">
      <q-item-section>
        <q-input v-model="employee.id" label="社員ID" readonly />
      </q-item-section>
    </q-item>
    <Field name="lastName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="姓"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="firstName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="lastNameKana" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="姓(カナ)"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="firstNameKana" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="名(カナ)"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="gender" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
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
    </Field>
    <Field name="email" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="メールアドレス"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="phone" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="電話番号"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="birthday" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="生年月日"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="departments" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
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
    </Field>
  </q-list>
</template>
