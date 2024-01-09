<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import RoomForm from 'components/room/RoomForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoomStore } from 'stores/room-store';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof RoomForm>>();
const { toastHandler } = useErrorHandler();
const router = useRouter();

const roomId = computed(() => {
  const id = useRoute().params.id;
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

const onSave = async () => {
  const validation = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const newRoom = {
      ...useRoomStore().formModel,
      ...data,
    };
    await useRoomStore().updateRoom(roomId.value, newRoom);
    await router.push({
      name: 'room-detail',
      params: { id: roomId.value },
    });
  } catch (error) {
    toastHandler(error);
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
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <room-form ref="form" v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="onCancel"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
