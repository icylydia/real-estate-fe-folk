<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <room-form />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="cancel"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoomForm from 'components/room/RoomForm.vue';
import { mapActions } from 'pinia';
import { useRoomStore } from 'stores/room-store';

export default defineComponent({
  name: 'RoomEditPage',
  components: { RoomForm },
  data() {
    return {
      loading: false,
    }
  },
  async mounted() {
    try {
      this.loading = true;
      this.resetFormModel();
      await this.getRoomDetail(this.roomId);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapActions(useRoomStore, ['getRoomDetail', 'resetFormModel']),
    save() {
      this.$router.push({ name: 'room-detail', params: { id: this.roomId } });
    },
    cancel() {
      this.$router.push({ name: 'room-detail', params: { id: this.roomId } });
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

