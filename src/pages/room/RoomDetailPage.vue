<script setup lang="ts">
import FileList from 'components/room/FileList.vue';
import RoomForm from 'components/room/RoomForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoomStore } from 'stores/room-store';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const route = useRoute()
const router = useRouter()
const { toastHandler } = useErrorHandler();

const roomId = computed(() => {
  const id = route.params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid room id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useRoomStore().resetFormModel();
    await useRoomStore().getRoomDetail(roomId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    toastHandler(error);
    loading.value = false;
  }
});

const toEdit = async () => {
  await router.push({ name: 'room-edit', params: { id: roomId.value } });
};

const backToBuilding = async () => {
  const buildingId = useRoomStore().formModel.building?.id;
  if (buildingId) {
    await router.push({ name: 'building-detail', params: { id: buildingId } });
  }
};
</script>
<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <room-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="物件へ"
          @click="backToBuilding"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="negative"
          label="編集"
          @click="toEdit"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <file-list />
      </q-card-section>
    </q-card>
  </q-page>
</template>
