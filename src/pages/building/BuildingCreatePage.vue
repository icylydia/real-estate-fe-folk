<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBuildingStore } from 'stores/building-store';
import useErrorHandler from 'components/app/useErrorHandler';
import { FormValidationResult } from 'vee-validate';
import _ from 'lodash';

const loading = ref(false);
const form = ref<InstanceType<typeof BuildingForm>>();
const { toastHandler } = useErrorHandler();
const router = useRouter();


onMounted(async () => {
  loading.value = true;
  useBuildingStore().resetFormModel();
  await nextTick(() => {
    loading.value = false;
  });
});

const onSave = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  try {
    loading.value = true;
    const data = validation.values;
    const necessaryData = _.omit(data, ['image', 'regularExpenses']);
    const newBuilding = {
      ...useBuildingStore().formModel,
      ...necessaryData,
    };
    const building = await useBuildingStore().createBuilding(newBuilding);
    await router.push({
      name: 'building-detail',
      params: { id: building.id },
    })
  } catch (e) {
    toastHandler('保存に失敗しました。');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規物件</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="loading" />
        <q-card-section>
          <building-form new-building ref="form" v-if="!loading" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="negative"
            label="取消"
            @click="$router.back()"
          ></q-btn>
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
