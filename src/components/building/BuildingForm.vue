<script lang="ts" setup>
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import QInputArea from 'components/extension/QInputArea.vue';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import _ from 'lodash';
import { useFileStore } from 'stores/file-store';
import { useBuildingStore } from 'stores/building-store';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string, number } from 'yup';
import type { ValidationResult } from 'vee-validate';
import { Field, useForm } from 'vee-validate';
import { useBuilding } from 'src/utils/building';
import { useAddressStore } from 'stores/address-store';
import useErrorHandler from 'components/app/useErrorHandler';
import QInputPercentage from 'components/extension/QInputPercentage.vue';

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newBuilding: {
    type: Boolean,
    default: false,
  },
});

const { formModel: building } = storeToRefs(useBuildingStore());
const mainPhotoName = computed(() => {
  if (building.value.image) {
    const fullUrl = new URL(building.value.image);
    return fullUrl.pathname.split('/').pop();
  }
  return '';
});

const {
  buildingTypeOptions,
  buildingStructureOptions,
  landRightsOptions,
  landUseZoneOptions,
} = useBuilding();

const { toastHandler } = useErrorHandler();

const {
  defaultMainPhotoUrl,
} = storeToRefs(useFileStore());

const searchAddress = async () => {
  const validationResult: ValidationResult = await validateField('address.postalCode');
  const postalCode = _.get(values, 'address.postalCode');
  if (!validationResult.valid || !postalCode) {
    return;
  }
  try {
    const address = await useAddressStore().getAddressByPostalCode(postalCode);
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
  } catch (e) {
    await toastHandler(e);
  }
};

const { uploadMainPhoto } = useFileStore();
const mainPhoto = ref<File|null>(null);
const uploadingPhoto = ref(false);
const onMainPhotoChange = async (file: File) => {
  uploadingPhoto.value = true;
  mainPhoto.value = file;
  try {
    const resp = await uploadMainPhoto(mainPhoto.value);
    building.value.image = resp.url;
  } catch (error) {
    await toastHandler(error);
  } finally {
    uploadingPhoto.value = false;
  }
}

/**********************
 * Form validation
 **********************/
const validationSchema = toTypedSchema(object({
  id: string().notRequired().nullable().label('物件番号'),
  name: string().required().label('物件名'),
  type: string().required().label('物件類'),
  description: string().notRequired().nullable().label('物件説明'),
  price: string().notRequired().nullable().label('価格'),
  grossYield: string().notRequired().nullable().label('表面利回り'),
  grossArea: string().notRequired().nullable().label('建物面積'),
  landArea: string().notRequired().nullable().label('土地面積'),
  buildingStructure: string().notRequired().nullable().label('建物構造'),
  floorsAboveGround: number()
    .notRequired()
    .nullable()
    .integer()
    .min(0)
    .label('地上階数'),
  floorsUnderGround: number()
    .notRequired()
    .nullable()
    .integer()
    .min(0)
    .label('地下階数'),
  completionDate: string()
    .yearMonth()
    .transform((value) => value === '' ? null : value)
    .notRequired()
    .nullable()
    .label('新築年月'),
  totalUnits: number()
    .notRequired()
    .nullable()
    .integer()
    .min(0)
    .label('総戸数'),
  landRights: string().notRequired().nullable().label('土地权利'),
  landUseZone: string().notRequired().nullable().label('用途地域'),
  buildingCoverageRatio: string().notRequired().nullable().label('建ぺい率'),
  floorAreaRatio: string().notRequired().nullable().label('容積率'),
  defaultPromptUpdate: string().notRequired().nullable().label('催促期間（Nヶ月前）'),
  note: string().notRequired().nullable().label('備考'),
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
}));

const initialValues: any = useBuildingStore().formModel;

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
    物件基本情報{{ readonly ? '（閲覧）' : '（編集）' }}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newBuilding">
      <q-item-section>
        <q-input
          v-model="building.id"
          label="物件ID"
          readonly
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-img
          ratio="1.6"
          height="200px"
          width="320px"
          :src="building.image || defaultMainPhotoUrl"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-file
          label="物件画像"
          accept="image/*"
          :readonly="readonly"
          :loading="uploadingPhoto"
          @update:model-value="onMainPhotoChange"
          :display-value="mainPhotoName"
          :model-value="[]"
        >
          <template #prepend>
            <q-icon name="sym_r_photo"/>
          </template>
        </q-file>
      </q-item-section>
    </q-item>
    <Field name="name" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="物件名"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="type" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            emit-value
            map-options
            label="物件類"
            :options="buildingTypeOptions"
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="description" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="物件説明"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="price" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-currency
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="価格"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="grossYield" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-percentage
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="表面利回り"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="grossArea" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-area
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="建物面積"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="landArea" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-area
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="土地面積"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="buildingStructure" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            emit-value
            map-options
            label="建物構造"
            :options="buildingStructureOptions"
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="floorsAboveGround" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="地上階数"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="floorsUnderGround" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="地下階数"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="completionDate" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="新築年月"
            :readonly="readonly"
            hint="フォーマット: 2021-01"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="totalUnits" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="総戸数"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="landRights" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            emit-value
            map-options
            label="土地权利"
            :options="landRightsOptions"
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="landUseZone" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-select
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            emit-value
            map-options
            label="用途地域"
            :options="landUseZoneOptions"
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="buildingCoverageRatio" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-percentage
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="建ぺい率"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="floorAreaRatio" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input-percentage
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="容積率"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="defaultPromptUpdate" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="催促期間（Nヶ月前）"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="note" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="備考"
            autogrow
            clearable
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
  </q-list>
  <q-separator class="q-my-md"/>
  <div class="q-mt-md text-h6">
    物件位置情報{{ readonly ? '（閲覧）' : '（編集）' }}
  </div>
  <q-list class="row">
    <Field name="address.postalCode" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
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
          @click="searchAddress"
          :disable="readonly"
        />
      </q-item-section>
    </q-item>
    <Field name="address.prefectureName" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="都道府県"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress1" #="{errorMessage, value, handleChange}">
      <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="市区町村"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress2" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
            :error-message="errorMessage"
            :error="!!errorMessage"
            label="丁目"
            :readonly="readonly"
          />
        </q-item-section>
      </q-item>
    </Field>
    <Field name="address.detailAddress3" #="{errorMessage, value, handleChange}">
      <q-item class="col-12">
        <q-item-section>
          <q-input
            :model-value="value"
            @update:model-value="handleChange"
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
