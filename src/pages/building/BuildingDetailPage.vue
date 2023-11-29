<script setup lang="ts">
import BuildingForm from 'components/building/BuildingForm.vue';
import RoomList from 'components/building/RoomList.vue';
import ContractList from 'components/tenant/ContractList.vue';
import FileList from 'components/building/FileList.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBuildingStore } from 'stores/building-store';
import useErrorHandler from 'components/app/useErrorHandler';
import RentalContractList from 'components/building/RentalContractList.vue';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();

const buildingId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    await useBuildingStore().getBuilding(buildingId.value);
  } catch (error) {
    toastHandler(error);
  } finally {
    loading.value = false;
  }
});

const toEdit = async () => {
  try {
    await router.push({
      name: 'building-edit',
      params: { id: buildingId.value },
    });
  } catch (error) {
    toastHandler(error);
  }
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <building-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="編集"
          @click="toEdit"
        />
      </q-card-actions>
    </q-card>
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <room-list />
      </q-card-section>
    </q-card>
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <rental-contract-list />
      </q-card-section>
    </q-card>
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <file-list />
      </q-card-section>
    </q-card>
  </q-page>
</template>
