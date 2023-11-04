<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { computed, onMounted, ref } from 'vue';
import { useBuildingStore } from 'stores/building-store';
import { FormValidationResult } from 'vee-validate';

const loading = ref(false);
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
    toastHandler(error);
  } finally {
    loading.value = false;
  }
});

const onSave = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    console.log('invalid', validation)
    return;
  }
  try {
    loading.value = true;
    const data = validation.values;
    const newBuilding = {
      ...useBuildingStore().formModel,
      ...data,
    };
    await useBuildingStore().updateBuilding(buildingId.value, newBuilding);
    await router.push({
      name: 'building-detail',
      params: { id: buildingId.value },
    });
  } catch (e) {
    toastHandler(e);
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  router.back();
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <building-form ref="form" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="onCancel"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
