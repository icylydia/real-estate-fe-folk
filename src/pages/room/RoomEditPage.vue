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
          color="primary"
          label="保存"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RoomForm from 'components/room/RoomForm.vue';

export default defineComponent({
  name: 'RoomEditPage',
  components: { RoomForm },
  methods: {
    save() {
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

