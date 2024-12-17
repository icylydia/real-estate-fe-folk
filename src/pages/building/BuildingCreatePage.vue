<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBuildingStore } from 'stores/building-store';
import useErrorHandler from 'components/app/useErrorHandler';
import type { FormValidationResult } from 'vee-validate';
import _ from 'lodash';
import type { Optional } from 'src/utils/framework';
import type { BuildingInRequest } from 'src/api';

const loading = ref(false);
const saving = ref(false);
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
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation?.valid) {
    return;
  }
  try {
    saving.value = true;
    const data = validation.values;
    const necessaryData = _.omit(data, ['image']);
    const newBuilding = {
      ...useBuildingStore().formModel,
      ...necessaryData,
    } as BuildingInRequest;
    const building = await useBuildingStore().createBuilding(newBuilding);
    await router.push({
      name: 'building-detail',
      params: { id: building.id },
    })
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
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
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <building-form new-building ref="form" v-if="!loading" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="negative"
            label="取消"
            @click="router.back()"
            :disable="loading || saving"
          ></q-btn>
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
            :disable="loading || saving"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
