<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { computed, onMounted, ref } from 'vue';
import { useBuildingStore } from 'stores/building-store';
import type { FormValidationResult } from 'vee-validate';
import _ from 'lodash';
import type { Optional } from 'src/utils/framework';
import type { BuildingInRequest } from 'src/api';

const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof BuildingForm>>();
const router = useRouter();
const route = useRoute();
const { toastHandler } = useErrorHandler();

const buildingId = computed(() => {
  const id = route.params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useBuildingStore().resetFormModel();
    await useBuildingStore().getBuilding(buildingId.value);
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
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
    await useBuildingStore().updateBuilding(buildingId.value, newBuilding);
    await router.push({
      name: 'building-detail',
      params: { id: buildingId.value },
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
  }
};

const onCancel = () => {
  router.back();
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="saving" />
      <q-card-section>
        <building-form ref="form" v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="onCancel"
          :disable="loading || saving"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
          :disable="loading || saving"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
