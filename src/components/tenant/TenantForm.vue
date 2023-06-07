<script setup lang="ts">
import { useTenantStore } from 'stores/tenant-store';
import { useGender } from 'src/utils/gender';
import { storeToRefs } from 'pinia';

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

const { formModel: tenant } = storeToRefs(useTenantStore());
const { selectOptions: genderOptions } = useGender()
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
          use-chips
          label="性別"
          :readonly="readonly"
          emit-value
          map-options
          :options="genderOptions"
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
  </q-list>
</template>
