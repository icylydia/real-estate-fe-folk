<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <room-form readonly />
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
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoomForm from 'components/room/RoomForm.vue';
import { useRoomStore } from 'stores/room-store';
import { mapActions, mapState } from "pinia";

export default defineComponent({
  name: 'RoomDetailPage',
  components: { RoomForm },
  data() {
    return {
      loading: false,
    }
  },
  async mounted() {
    try {
      this.loading = true;
      await this.getRoomDetail(this.roomId);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(useRoomStore, ['getRoomDetail']),
    toEdit() {
      this.$router.push({ name: 'room-edit', params: { id: this.roomId } });
    },
    backToBuilding() {
      this.$router.push({ name: 'building-detail', params: { id: this.room.buildingId } });
    },
  },
  computed: {
    ...mapState(useRoomStore, {
      room: 'formModel',
    }),
    roomId() {
      const id = this.$route.params.id;
      if (typeof id != 'string') {
        throw new Error('Invalid room id');
      }
      return id;
    },
  }
})
</script>

