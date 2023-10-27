<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useBuildingStore } from 'stores/building-store';
import useErrorHandler from 'components/app/useErrorHandler';

const {
  resetFormModel,
  callCreateBuildingApi: callApi,
} = useBuildingStore();

const {
  toastHandler,
} = useErrorHandler();

onMounted(() => {
  resetFormModel();
});

const router = useRouter();

const onSave = async () => {
  try {
    await callApi();
  } catch (e) {
    toastHandler(e);
  }
  await router.push({ name: 'building-list' });
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
        <q-card-section>
          <building-form new-building />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
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
