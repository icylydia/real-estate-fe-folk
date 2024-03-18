<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import RoomForm from 'components/room/RoomForm.vue';
import { useRoomStore } from 'stores/room-store';
import { useBuildingStore } from 'stores/building-store';
import { storeToRefs } from 'pinia';
import { FormValidationResult } from 'vee-validate';
import useErrorHandler from 'components/app/useErrorHandler';
import { Optional } from 'src/utils/framework';

const loading = ref(true);
const saving = ref(false);
const { formModel: building } = storeToRefs(useBuildingStore());
const form = ref<InstanceType<typeof RoomForm>>();
const { toastHandler } = useErrorHandler();
const router = useRouter();

const buildingId = computed(() => {
  const id = useRoute().params.buildingId;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const simplifiedBuilding = computed(() => {
  return {
    id: building.value.id,
    name: building.value.name,
    type: building.value.type,
  };
});

onMounted(async () => {
  useRoomStore().resetFormModel();
  try {
    useBuildingStore().resetFormModel();
    await useBuildingStore().getBuilding(buildingId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    await toastHandler(error);
    loading.value = false;
  }
});

const save = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation || !validation.valid) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const room = await useRoomStore().createRoom(data);
    await router.push({
      name: 'room-detail',
      params: { id: room.id },
    });
  } catch (error) {
    await toastHandler('保存に失敗しました。');
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
          <div class="text-h5">新規区画</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="loading || saving" />
        <q-card-section>
          <room-form
            new-room
            :room-building="simplifiedBuilding"
            v-if="!loading && simplifiedBuilding.id && simplifiedBuilding.name"
            ref="form"
          />
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
            @click="save"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
