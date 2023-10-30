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
    addressPrefectureId: address.prefectureId,
    addressPrefectureName: address.prefectureName,
    addressDetailAddress1: address.detailAddress1,
    addressDetailAddress2: address.detailAddress2,
    addressDetailAddress3: address.detailAddress3,
  });
};

const updateEmergencyContactAddressFromPostalCode = (address: AddressInResponse) => {
  setValues({
    emergencyContactAddressPrefectureId: address.prefectureId,
    emergencyContactAddressPrefectureName: address.prefectureName,
    emergencyContactAddressDetailAddress1: address.detailAddress1,
    emergencyContactAddressDetailAddress2: address.detailAddress2,
    emergencyContactAddressDetailAddress3: address.detailAddress3,
  });
};

const updateWorkplaceAddressFromPostalCode = (address: AddressInResponse) => {
  setValues({
    workplaceAddressPrefectureId: address.prefectureId,
    workplaceAddressPrefectureName: address.prefectureName,
    workplaceAddressDetailAddress1: address.detailAddress1,
    workplaceAddressDetailAddress2: address.detailAddress2,
    workplaceAddressDetailAddress3: address.detailAddress3,
  });
};

const searchAddress = async (callback: (address: AddressInResponse) => void) => {
  const validationResult: ValidationResult = await validateField('addressPostalCode');
  if (!validationResult.valid || !values['addressPostalCode']) {
    return;
  }
  try {
    const postalCode = values['addressPostalCode'];
    const address = await useAddressStore().getAddressByPostalCode(postalCode);
    callback(address);
  } catch (e) {
    //
  }
};

const filteredGuarantorCompanyOptions = ref<string[]>(guarantorCompanyOptions);
const createGuarantorCompanyOption = (val: string, done: (item: string, mode: string) => void) => {
  if (val.length > 0) {
    if (!guarantorCompanyOptions.includes(val)) {
      done(val, 'add-unique')
    }
  }
}
const filterGuarantorCompanyFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredGuarantorCompanyOptions.value = guarantorCompanyOptions
      return
    }
    const needle = val.toLowerCase()
    filteredGuarantorCompanyOptions.value = guarantorCompanyOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

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
  addressPostalCode: string()
    .postalCode()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('郵便番号'),
  addressPrefectureId: string().notRequired().nullable().label('都道府県ID'),
  addressPrefectureName: string().notRequired().nullable().label('都道府県'),
  addressDetailAddress1: string().notRequired().nullable().label('市区町村'),
  addressDetailAddress2: string().notRequired().nullable().label('丁目'),
  addressDetailAddress3: string().notRequired().nullable().label('それ以降の住所'),
  emergencyContactLastName: string().notRequired().nullable().label('姓'),
  emergencyContactFirstName: string().notRequired().nullable().label('名'),
  emergencyContactGender: string().oneOf([
    'male', 'female', 'other',
  ]).notRequired().label('性別'),
  emergencyContactRelationship: string().oneOf([
    'spouse', 'family', 'friend', 'other',
  ]).notRequired().label('続柄'),
  emergencyContactPhone: string()
    .phone()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('電話番号'),
  emergencyContactEmail: string().email().notRequired().nullable().label('メールアドレス'),
  emergencyContactAddressPostalCode: string()
    .postalCode()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('郵便番号'),
  emergencyContactAddressPrefectureId: string().notRequired().nullable().label('都道府県ID'),
  emergencyContactAddressPrefectureName: string().notRequired().nullable().label('都道府県'),
  emergencyContactAddressDetailAddress1: string().notRequired().nullable().label('市区町村'),
  emergencyContactAddressDetailAddress2: string().notRequired().nullable().label('丁目'),
  emergencyContactAddressDetailAddress3: string().notRequired().nullable().label('それ以降の住所'),
  workplaceName: string().notRequired().nullable().label('会社名'),
  workplacePhone: string()
    .phone()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('電話番号'),
  workplaceAddressPostalCode: string()
    .postalCode()
    .nullable()
    .transform((value, originalValue) => String(originalValue).trim() === '' ? null : value)
    .label('郵便番号'),
  workplaceAddressPrefectureId: string().notRequired().nullable().label('都道府県ID'),
  workplaceAddressPrefectureName: string().notRequired().nullable().label('都道府県'),
  workplaceAddressDetailAddress1: string().notRequired().nullable().label('市区町村'),
  workplaceAddressDetailAddress2: string().notRequired().nullable().label('丁目'),
  workplaceAddressDetailAddress3: string().notRequired().nullable().label('それ以降の住所'),
}));

const initialValues: any = computed( () => {
  if (props.newTenant) {
    return {};
  }
  const result: any = tenant.value;
  // 住所情報
  if (tenant.value.address) {
    result.addressPostalCode = tenant.value.address.postalCode;
    result.addressPrefectureId = tenant.value.address.prefectureId;
    result.addressPrefectureName = tenant.value.address.prefectureName;
    result.addressDetailAddress1 = tenant.value.address.detailAddress1;
    result.addressDetailAddress2 = tenant.value.address.detailAddress2;
    result.addressDetailAddress3 = tenant.value.address.detailAddress3;
  }
  // 緊急連絡先情報
  if (tenant.value.emergencyContact) {
    result.emergencyContactLastName = tenant.value.emergencyContact.lastName;
    result.emergencyContactFirstName = tenant.value.emergencyContact.firstName;
    result.emergencyContactGender = tenant.value.emergencyContact.gender;
    result.emergencyContactRelationship = tenant.value.emergencyContact.relationship;
    result.emergencyContactPhone = tenant.value.emergencyContact.phone;
    result.emergencyContactEmail = tenant.value.emergencyContact.email;
    if (tenant.value.emergencyContact.address) {
      result.emergencyContactAddressPostalCode = tenant.value.emergencyContact.address.postalCode;
      result.emergencyContactAddressPrefectureId = tenant.value.emergencyContact.address.prefectureId;
      result.emergencyContactAddressPrefectureName = tenant.value.emergencyContact.address.prefectureName;
      result.emergencyContactAddressDetailAddress1 = tenant.value.emergencyContact.address.detailAddress1;
      result.emergencyContactAddressDetailAddress2 = tenant.value.emergencyContact.address.detailAddress2;
      result.emergencyContactAddressDetailAddress3 = tenant.value.emergencyContact.address.detailAddress3;
    }
  }
  // 勤務先情報
  if (tenant.value.workplace) {
    result.workplaceName = tenant.value.workplace.name;
    result.workplacePhone = tenant.value.workplace.phone;
    if (tenant.value.workplace.address) {
      result.workplaceAddressPostalCode = tenant.value.workplace.address.postalCode;
      result.workplaceAddressPrefectureId = tenant.value.workplace.address.prefectureId;
      result.workplaceAddressPrefectureName = tenant.value.workplace.address.prefectureName;
      result.workplaceAddressDetailAddress1 = tenant.value.workplace.address.detailAddress1;
      result.workplaceAddressDetailAddress2 = tenant.value.workplace.address.detailAddress2;
      result.workplaceAddressDetailAddress3 = tenant.value.workplace.address.detailAddress3;
    }
  }
  return result
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
    <Field name="addressPostalCode" #="{errorMessage, value, field}">
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
          @click="searchAddress(updateAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="addressPrefectureName" #="{errorMessage, value, field}">
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
    <Field name="addressDetailAddress1" #="{errorMessage, value, field}">
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
    <Field name="addressDetailAddress2" #="{errorMessage, value, field}">
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
    <Field name="addressDetailAddress3" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactLastName" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactFirstName" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactGender" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactRelationship" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactPhone" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactEmail" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactAddressPostalCode" #="{errorMessage, value, field}">
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
          @click="searchAddress(updateEmergencyContactAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="emergencyContactAddressPrefectureName" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactAddressDetailAddress1" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactAddressDetailAddress2" #="{errorMessage, value, field}">
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
    <Field name="emergencyContactAddressDetailAddress3" #="{errorMessage, value, field}">
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
    <Field name="workplaceName" #="{errorMessage, value, field}">
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
    <Field name="workplacePhone" #="{errorMessage, value, field}">
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
    <Field name="workplacePostalCode" #="{errorMessage, value, field}">
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
          @click="searchAddress(updateWorkplaceAddressFromPostalCode)"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="workplaceAddressPrefectureName" #="{errorMessage, value, field}">
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
    <Field name="workplaceAddressDetailAddress1" #="{errorMessage, value, field}">
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
    <Field name="workplaceAddressDetailAddress2" #="{errorMessage, value, field}">
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
    <Field name="workplaceAddressDetailAddress3" #="{errorMessage, value, field}">
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
