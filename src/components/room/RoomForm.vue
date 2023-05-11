<template>
  <div class="q-mt-md text-h6">部屋基本情報</div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newRoom">
      <q-item-section>
        <q-input v-model="room.id" label="管理番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="room.buildingId" label="物件番号" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.name" label="部屋名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.price" label="価格" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.monthlyRent" label="賃料" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.maintenanceFund" label="修繕積立金" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.managementFee" label="管理費" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-input v-model="room.roomLayoutNumber" label="間取り" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-3 col-md-3 col-sm-6 col-xs-6">
      <q-item-section>
        <q-select
          v-model="room.roomLayoutUnit"
          label="間取り（単位）"
          :readonly="readonly"
          emit-value
          map-options
          :options="roomLayoutUnitOptions"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.exclusiveArea" label="専有面積" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="room.extraArea" label="その他面積" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input
          v-model="room.miscellaneous"
          label="備考"
          autogrow
          clearable
          :readonly="readonly"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
const roomLayoutUnitOptions = [
  {
    label: 'R',
    value: 'R',
  },
  {
    label: 'K',
    value: 'K',
  },
  {
    label: 'DK',
    value: 'DK',
  },
  {
    label: 'LDK',
    value: 'LDK',
  },
]
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useRoomStore } from 'stores/room-store';

export default defineComponent({
  name: 'RoomForm',
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    newRoom: {
      type: Boolean,
      default: false,
    },
    newRoomBuildingId: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (this.newRoom) {
      this.resetFormModel();
      if (!this.newRoomBuildingId) {
        throw new Error('newRoomBuildingId is required when newRoom is true.');
      }
      this.room.buildingId = this.newRoomBuildingId;
    }
  },
  methods: {
    ...mapActions(useRoomStore, ['resetFormModel']),
  },
  computed: {
    ...mapState(useRoomStore, {
      room: 'formModel',
    }),
  }
})
</script>
