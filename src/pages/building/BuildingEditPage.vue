<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { computed } from 'vue';
import { useBuildingStore } from 'stores/building-store';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();
const { toastHandler } = useErrorHandler();
const {
  updateBuilding: callApi,
} = useBuildingStore();
const {
  formModel: building,
} = storeToRefs(useBuildingStore());

const buildingId = computed(() => {
  const id = route.params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const onSave = async () => {
  try {
    await callApi(buildingId.value, building.value);
  } catch (e) {
    toastHandler(e);
  }
  await router.push({ name: 'building-list' });
};

const onCancel = async () => {
  await router.push({ name: 'building-list' });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <building-form />
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
