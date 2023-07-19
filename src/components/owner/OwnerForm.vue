<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOwnerStore } from 'stores/owner-store';
import { useGender } from 'src/utils/gender';

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newOwner: {
    type: Boolean,
    default: false,
  },
});

const { formModel: owner } = storeToRefs(useOwnerStore());
const { selectOptions: genderOptions } = useGender();
</script>

<template>
  <div class="text-h6">
    オーナー基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newOwner">
      <q-item-section>
        <q-input v-model="owner.id" label="オーナーID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="owner.lastName" label="姓" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="owner.firstName" label="名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="owner.gender"
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
        <q-input v-model="owner.phone" label="電話番号" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="owner.email" label="メールアドレス" :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style scoped lang="scss">

</style>
