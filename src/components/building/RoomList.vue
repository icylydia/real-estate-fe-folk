<template>
  <q-table
    flat
    :rows="rooms"
    :columns="columns"
    row-key="id"
    :grid="$q.screen.lt.md"
    hide-bottom
    :pagination="{
      rowsPerPage: 0,
    }"
  >
    <template #top-left>
      <div class="text-h6">部屋一覧</div>
    </template>
    <template #top-right>
      <q-btn label="新規" color="primary" class="float-right text-capitalize shadow-3" icon="sym_r_add" @click="createRoom()" />
    </template>
    <template #[`body-cell-layout`]="{ row }: { row: RoomInResponse }">
      <q-td>
        {{ row.roomLayoutNumber }}{{ row.roomLayoutUnit }}
      </q-td>
    </template>
    <template #[`body-cell-area`]="{ row }: { row: RoomInResponse }">
      <q-td class="text-right">
        {{ row.exclusiveArea }} m<sup>2</sup>
      </q-td>
    </template>
    <template #[`body-cell-actions`]="{ key }">
      <q-td class="text-right">
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_visibility" @click="roomDetail(key)" />
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_edit" @click="editRoom(key)" />
        <q-btn class="q-ml-sm" size="sm" flat dense icon="sym_r_delete" @click="removeRoom(key)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { QTableProps } from 'quasar';
import { RoomInResponse } from 'src/api';

const columns: QTableProps['columns'] = [
  {
    label: '部屋名',
    field: 'name',
    name: 'name',
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
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';

export default defineComponent({
  name: 'RoomList',
  methods: {
    roomDetail(key: number) {
      this.$router.push({ name: 'room-detail', params: { id: key } });
    },
    editRoom(key: number) {
      this.$router.push({ name: 'room-edit', params: { id: key } });
    },
    removeRoom(key: number) {
      console.log('remove room', key);
    },
    createRoom() {
      this.$router.push({ name: 'room-create' });
    },
  },
  computed: {
    ...mapState(useBuildingStore, {
      rooms: store => store.formModel.rooms,
    })
  }
});
</script>
