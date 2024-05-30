<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { useGender } from 'src/utils/gender';
import { storeToRefs } from 'pinia';
import { useTenant } from 'src/utils/tenant';
import { useEmergencyContact } from 'src/utils/emergency-contact';
import { computed, ref } from 'vue';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import { Field, useForm, ValidationResult } from 'vee-validate';
import { useAddressStore } from 'stores/address-store';
import { AddressInResponse } from 'src/api';
import _ from 'lodash';

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newTenant: {
    type: Boolean,
    default: false,
  },
});

const { formModel: tenant } = storeToRefs(useTenantStore());
const { selectOptions: genderOptions } = useGender();
const {
  guarantorCompanyStatusOptions,
  guarantorCompanyOptions,
} = useTenant();
const { selectOptions: relationshipOptions } = useEmergencyContact();

const updateAddressFromPostalCode = (address: AddressInResponse) => {
  setValues({
    address: {
      postalCode: address.postalCode,
      prefectureId: address.prefectureId,
      prefectureName: address.prefectureName,
      detailAddress1: address.detailAddress1,
      detailAddress2: address.detailAddress2,
      detailAddress3: address.detailAddress3,
    },
  });
};

const updateEmergencyContactAddressFromPostalCode = (address: AddressInResponse) => {
  setValues({
    emergencyContact: {
      address: {
        postalCode: address.postalCode,
        prefectureId: address.prefectureId,
        prefectureName: address.prefectureName,
        detailAddress1: address.detailAddress1,
        detailAddress2: address.detailAddress2,
        detailAddress3: address.detailAddress3,
      },
    },
  });
};

const updateWorkplaceAddressFromPostalCode = (address: AddressInResponse) => {
  setValues({
    workplace: {
      address: {
        postalCode: address.postalCode,
        prefectureId: address.prefectureId,
        prefectureName: address.prefectureName,
        detailAddress1: address.detailAddress1,
        detailAddress2: address.detailAddress2,
        detailAddress3: address.detailAddress3,
      },
    },
  });
};

const searchAddress = async (field: string, callback: (address: AddressInResponse) => void) => {
  const validationResult: ValidationResult = await validateField(field);
  const postalCode = _.get(values, field);
  if (!validationResult.valid || !postalCode) {
    return;
  }
  try {
    const address = await useAddressStore().getAddressByPostalCode(postalCode);
    callback(address);
  } catch (e) {
    //
  }
};

const filteredGuarantorCompanyOptions = ref<string[]>(guarantorCompanyOptions);
const createGuarantorCompanyOption = (inputValue: string, doneFn: (item?: any, mode?: 'add' | 'add-unique' | 'toggle' | undefined) => void) => {
  if (inputValue.length > 0) {
    if (!guarantorCompanyOptions.includes(inputValue)) {
      doneFn(inputValue, 'add-unique')
    }
  }
};

const filterGuarantorCompanyFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredGuarantorCompanyOptions.value = guarantorCompanyOptions
      return
    }
    const needle = val.toLowerCase()
    filteredGuarantorCompanyOptions.value = guarantorCompanyOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  lastName: string().required().label('姓'),
  firstName: string().required().label('名'),
  gender: string().oneOf([
    'male', 'female', 'other',
  ]).notRequired().label('性別'),
  phone: string()
    .phone()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('電話番号'),
  email: string().email().notRequired().nullable().label('メールアドレス'),
  guarantorCompanyStatus: string().oneOf([
    'none', 'pending', 'joined', 'rejected',
  ]).notRequired().label('保証会社加入状況'),
  guarantorCompanyName: string().notRequired().nullable().label('保証会社名'),
  address: object({
    postalCode: string()
      .postalCode()
      .nullable()
      .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
      .label('郵便番号'),
    prefectureId: string().notRequired().nullable().label('都道府県ID'),
    prefectureName: string().notRequired().nullable().label('都道府県'),
    detailAddress1: string().notRequired().nullable().label('市区町村'),
    detailAddress2: string().notRequired().nullable().label('丁目'),
    detailAddress3: string().notRequired().nullable().label('それ以降の住所'),
  }).notRequired().nullable().label('住所'),
  emergencyContact: object({
    lastName: string().notRequired().nullable().label('姓'),
    firstName: string().notRequired().nullable().label('名'),
    gender: string().oneOf([
      'male', 'female', 'other',
    ]).notRequired().label('性別'),
    relationship: string().oneOf([
      'spouse', 'family', 'friend', 'other',
    ]).notRequired().label('続柄'),
    phone: string()
      .phone()
      .nullable()
      .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
      .label('電話番号'),
    email: string().email().notRequired().nullable().label('メールアドレス'),
    address: object({
      postalCode: string()
        .postalCode()
        .nullable()
        .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
        .label('郵便番号'),
      prefectureId: string().notRequired().nullable().label('都道府県ID'),
      prefectureName: string().notRequired().nullable().label('都道府県'),
      detailAddress1: string().notRequired().nullable().label('市区町村'),
      detailAddress2: string().notRequired().nullable().label('丁目'),
      detailAddress3: string().notRequired().nullable().label('それ以降の住所'),
    }).notRequired().nullable().label('住所'),
  }),
  workplace: object({
    name: string().notRequired().nullable().label('会社名'),
    phone: string()
      .phone()
      .nullable()
      .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
      .label('電話番号'),
    address: object({
      postalCode: string()
        .postalCode()
        .nullable()
        .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
        .label('郵便番号'),
      prefectureId: string().notRequired().nullable().label('都道府県ID'),
      prefectureName: string().notRequired().nullable().label('都道府県'),
      detailAddress1: string().notRequired().nullable().label('市区町村'),
      detailAddress2: string().notRequired().nullable().label('丁目'),
      detailAddress3: string().notRequired().nullable().label('それ以降の住所'),
    }).notRequired().nullable().label('住所'),
  }),
}));

const initialValues: any = computed( () => {
  if (props.newTenant) {
    return {};
  }
  return tenant.value;
});

const { validate, validateField, values, setValues } = useForm({
  validationSchema,
  initialValues,
});

defineExpose({
  validate,
})
</script>

<template>
  <div class="text-h6">
    入居者基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newTenant">
      <q-item-section>
        <q-input v-model="tenant.id" label="入居者ID" readonly />
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
    <Field name="email" #="{errorMessage, value, field}">
      <q-item class="col-12">
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
    <Field name="guarantorCompanyStatus" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="保証会社加入状況"
            :readonly="readonly"
            emit-value
            map-options
            :options="guarantorCompanyStatusOptions"
            clearable
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="guarantorCompanyName" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="保証会社名"
            :readonly="readonly"
            use-input
            input-debounce="0"
            :options="filteredGuarantorCompanyOptions"
            clearable
            @new-value="createGuarantorCompanyOption"
            @filter="filterGuarantorCompanyFn"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
  <q-separator class="q-my-md" />
  <div class="text-h6">
    住所情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <Field name="address.postalCode" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="郵便番号"
            hint="フォーマット: 110-0001"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="住所検索"
          icon="sym_r_location_on"
          @click="searchAddress('address.postalCode', updateAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="address.prefectureName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="都道府県"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress1" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="市区町村"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress2" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="丁目"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress3" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="それ以降の住所"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
  <q-separator class="q-my-md" />
  <div class="text-h6">
    緊急連絡先情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <Field name="emergencyContact.lastName" #="{errorMessage, value, field}">
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
    <Field name="emergencyContact.firstName" #="{errorMessage, value, field}">
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
    <Field name="emergencyContact.gender" #="{errorMessage, value, field}">
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
    <Field name="emergencyContact.relationship" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="続柄"
            :readonly="readonly"
            emit-value
            map-options
            :options="relationshipOptions"
            clearable
          >
          </q-select>
        </q-item-section>
      </q-item>
    </Field>
    <Field name="emergencyContact.phone" #="{errorMessage, value, field}">
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
    <Field name="emergencyContact.email" #="{errorMessage, value, field}">
      <q-item class="col-12">
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
    <Field name="emergencyContact.address.postalCode" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="郵便番号"
            hint="フォーマット: 110-0001"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="住所検索"
          icon="sym_r_location_on"
          @click="searchAddress('emergencyContact.address.postalCode', updateEmergencyContactAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="emergencyContact.address.prefectureName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="都道府県"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="emergencyContact.address.detailAddress1" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="市区町村"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="emergencyContact.address.detailAddress2" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="丁目"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="emergencyContact.address.detailAddress3" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="それ以降の住所"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
  <q-separator class="q-my-md" />
  <div class="text-h6">
    勤務先情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <Field name="workplace.name" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="会社名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="workplace.phone" #="{errorMessage, value, field}">
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
    <Field name="workplace.address.postalCode" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="郵便番号"
            hint="フォーマット: 110-0001"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-btn
          class="q-mr-sm"
          color="primary"
          label="住所検索"
          icon="sym_r_location_on"
          @click="searchAddress('workplace.address.postalCode', updateWorkplaceAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="workplace.address.prefectureName" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="都道府県"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="workplace.address.detailAddress1" #="{errorMessage, value, field}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="市区町村"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="workplace.address.detailAddress2" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="丁目"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="workplace.address.detailAddress3" #="{errorMessage, value, field}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            v-bind="field"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="それ以降の住所"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
</template>
