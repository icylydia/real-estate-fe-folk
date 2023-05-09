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
import { mapActions } from 'pinia';

export default defineComponent({
  name: 'RoomDetailPage',
  components: { RoomForm },
  async mounted() {
    try {
      await this.getRoomDetail(this.roomId);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    ...mapActions(useRoomStore, ['getRoomDetail']),
    toEdit() {
      this.$router.push({ name: 'room-edit', params: { id: this.roomId } });
    },
  },
  computed: {
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

