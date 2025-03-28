<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { useBuildingStore } from 'stores/building-store';
import type { RoomInResponse } from 'src/api';
import _ from 'lodash';
import { useRoom } from 'src/utils/room';

const loading = ref(false);
const submitting = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();

const buildingId = computed(() => {
  const id = useRoute().params.buildingId;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const rooms = ref<RoomInResponse[]>([]);

const dropAt = ref<'top' | 'bottom'>('top');

const { contractStatusToChipProps } = useRoom();

onMounted(async () => {
  loading.value = true;
  try {
    await useBuildingStore().getBuilding(buildingId.value);
    const originalRooms = useBuildingStore().formModel.rooms ?? [];
    rooms.value = _.cloneDeep(originalRooms);
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
});

const goBack = async () => {
  try {
    await router.push({
      name: 'building-detail',
      params: { id: buildingId.value },
    });
  } catch (error) {
    await toastHandler(error);
  }
}

const onDragStart = async (event: DragEvent, room: RoomInResponse) => {
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return
  }
  dataTransfer.setData('room-id', room.id!);
  dataTransfer.effectAllowed = 'move';
}

const findQItem = (event: DragEvent): (HTMLElement | null) => {
  let element = (event.target as HTMLElement) ?? null;
  while (element) {
    if (element.classList.contains('room-item')) {
      return element;
    }
    element = (element.parentElement as HTMLElement) ?? null;
  }
  return null;
}

const onDragLeave = async (event: DragEvent) => {
  event.preventDefault();
  const roomItem = findQItem(event);
  if (!roomItem) {
    return;
  }
  roomItem.classList.remove('border-bottom', 'border-top');
}

const onDragOver = async (event: DragEvent) => {
  event.preventDefault();
  const roomItem = findQItem(event);
  if (!roomItem) {
    return;
  }
  roomItem.classList.remove('border-bottom', 'border-top');

  const rect = roomItem.getBoundingClientRect();
  const mouseY = event.clientY;
  const midY = rect.top + rect.height / 2;

  if (mouseY < midY) {
    roomItem.classList.add('border-top');
    dropAt.value = 'top';
  } else {
    roomItem.classList.add('border-bottom');
    dropAt.value = 'bottom';
  }
}

const onDrop = async (event: DragEvent, room: RoomInResponse) => {
  const roomItem = findQItem(event);
  if (!roomItem) {
    return;
  }
  roomItem.classList.remove('border-bottom', 'border-top');

  const startId = event.dataTransfer?.getData('room-id')

  if (!startId) {
    return;
  }
  const endId = room.id!;

  const startIndex = rooms.value.findIndex((r) => r.id == startId);
  let endIndex = rooms.value.findIndex((r) => r.id == endId);

  if (startIndex === -1 || endIndex === -1) {
    return;
  }
  if (startIndex === endIndex) {
    return;
  }

  if (dropAt.value === 'top') {
    const startRoom = rooms.value.splice(startIndex, 1)[0]!;
    endIndex = rooms.value.findIndex((r) => r.id == endId);
    rooms.value.splice(endIndex, 0, startRoom);
  } else {
    const startRoom = rooms.value.splice(startIndex, 1)[0]!;
    endIndex = rooms.value.findIndex((r) => r.id == endId);
    rooms.value.splice(endIndex + 1, 0, startRoom);
  }
}

const submit = async () => {
  submitting.value = true;
  try {
    await useBuildingStore().sortRooms(rooms.value, buildingId.value)
    await goBack();
  } catch (error) {
    await toastHandler(error);
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label overline>区画並び替え</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="sym_r_help">
                <q-tooltip class="bg-primary text-body2">
                  区画をドラッグ&ドロップで<br>並び替えることができます。
                </q-tooltip>
              </q-icon>
            </q-item-section>
          </q-item>
          <q-item
            v-for="room in rooms"
            :key="room.id"
            draggable="true"
            @dragstart="onDragStart($event, room)"
            @dragleave="onDragLeave"
            @dragover="onDragOver"
            @drop="onDrop($event, room)"
            class="room-item"
            clickable
            v-ripple
          >
            <q-item-section>
              <q-item-label>
                {{ room.name }}
              </q-item-label>
              <q-item-label caption>
                {{ room.roomLayoutNumber }} {{ room.roomLayoutUnit }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-chip v-bind="contractStatusToChipProps(room.contractStatus)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="確認"
          @click="submit"
          :disable="loading || submitting"
        />
        <q-btn
          style="width: 100px"
          color="negative"
          label="戻る"
          @click="goBack"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<style scoped>
.border-top {
  border-top: 1px solid #c8c8c8;
}
.border-bottom {
  border-bottom: 1px solid #c8c8c8;
}
</style>
