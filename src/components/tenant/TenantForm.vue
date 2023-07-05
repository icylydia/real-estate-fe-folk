<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { useGender } from 'src/utils/gender';
import { storeToRefs } from 'pinia';
import { useTenant } from 'src/utils/tenant';
import { useEmergencyContact } from 'src/utils/emergency-contact';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newTenant: {
    type: Boolean,
    default: false,
  },
});

const { validatePostalCode, updateAddressFromPostalCode } = useTenantStore();
const { formModel: tenant } = storeToRefs(useTenantStore());
const { selectOptions: genderOptions } = useGender();
const {
  guarantorCompanyStatusOptions,
  guarantorCompanyOptions,
} = useTenant();
const { selectOptions: relationshipOptions } = useEmergencyContact();
const $q = useQuasar();

const searchAddress = async () => {
  if (!validatePostalCode()) {
    $q.notify({
      type: 'negative',
      message: '郵便番号は不正です',
    });
    return;
  }
  try {
    await updateAddressFromPostalCode();
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
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.lastName" label="姓" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.firstName" label="名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="tenant.gender"
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
        <q-input v-model="tenant.phone" label="電話番号" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="tenant.email" label="メールアドレス" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="tenant.guarantorCompanyStatus"
          label="保証会社加入状況"
          :readonly="readonly"
          emit-value
          map-options
          :options="guarantorCompanyStatusOptions"
          clearable
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="tenant.guarantorCompanyName"
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
  </q-list>
  <div class="text-h6">
    住所情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input
          v-model="tenant.address!.postalCode"
          label="郵便番号"
          placeholder="xxx-xxxx"
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
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
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.address!.prefecture" label="都道府県" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.address!.detailAddress1" label="市区町村" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="tenant.address!.detailAddress2" label="丁目" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="tenant.address!.detailAddress3" label="それ以降の住所" :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
  <div class="text-h6">
    緊急連絡先情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.emergencyContact!.lastName" label="姓" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.emergencyContact!.firstName" label="名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="tenant.emergencyContact!.gender"
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
        <q-select
          v-model="tenant.emergencyContact!.relationship"
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
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="tenant.emergencyContact!.phone" label="電話番号" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="tenant.emergencyContact!.email" label="メールアドレス" :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
