<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import { RoomInResponse } from 'src/api';
import { useRoom } from 'src/utils/room';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useBuildingStore } from 'stores/building-store';
import { useRoomStore } from 'stores/room-store';
import useErrorHandler from 'components/app/useErrorHandler';

const {
  contractStatusToChipProps,
  describeRoomLayoutUnit,
} = useRoom();
const router = useRouter();
const $q = useQuasar();
const { toastHandler } = useErrorHandler();

const columns: QTableProps['columns'] = [
  {
    label: '区画番号',
    field: 'name',
    name: 'name',
    sortable: false,
    align: 'left',
  },
  {
    label: '契約状況',
    field: 'contractStatus',
    name: 'contractStatus',
    sortable: false,
    align: 'left',
  },
  {
    label: '間取り',
    field: 'layout',
    name: 'layout',
    sortable: false,
    align: 'left',
  },
  {
    label: '専有面積',
    field: 'area',
    name: 'area',
    sortable: false,
    align: 'right',
  },
  {
    label: '操作',
    field: 'actions',
    name: 'actions',
    sortable: false,
    align: 'right',
  },
]

const rooms = computed(() => storeToRefs(useBuildingStore()).formModel.value.rooms ?? []);
const buildingId = computed(() => storeToRefs(useBuildingStore()).formModel.value.id);

const roomDetail = (key: number) => {
  router.push({ name: 'room-detail', params: { id: key } });
}
const editRoom = (key: number) => {
  router.push({ name: 'room-edit', params: { id: key } });
}

const removeRoom = async (room: RoomInResponse) => {
  $q.dialog({
    title: '区画削除',
    message: `区画「${room.name}」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!room.id) return;
    try {
      await useRoomStore().deleteRoom(room.id);
      useBuildingStore().removeRoom(room.id);
    } catch (e) {
      await toastHandler('ファイルの削除に失敗しました');
    }
  });
}

const createRoom = () => {
  router.push({ name: 'room-create', params: { buildingId: buildingId.value } });
}
</script>

<template>
  <q-table
    flat
    :rows="rooms"
    :columns="columns"
    row-key="id"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #top-left>
      <div class="text-h6">区画一覧</div>
    </template>
    <template #top-right>
      <q-btn label="追加" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="createRoom()" />
    </template>
    <template #[`body-cell-contractStatus`]="{ row }: { row: RoomInResponse }">
      <q-td>
        <q-chip
          v-bind="contractStatusToChipProps(row.contractStatus)"
        />
      </q-td>
    </template>
    <template #[`body-cell-layout`]="{ row }: { row: RoomInResponse }">
      <q-td>
        {{ row.roomLayoutNumber }}{{ describeRoomLayoutUnit(row.roomLayoutUnit) }}
      </q-td>
    </template>
    <template #[`body-cell-area`]="{ row }: { row: RoomInResponse }">
      <q-td class="text-right">
        {{ row.exclusiveArea }} <template v-if="row.exclusiveArea != undefined">m<sup>2</sup></template>
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ key, row }: { key: number, row: RoomInResponse}">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="roomDetail(key)" />
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editRoom(key)" />
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeRoom(row)" />
      </q-td>
    </template>
  </q-table>
</template>
