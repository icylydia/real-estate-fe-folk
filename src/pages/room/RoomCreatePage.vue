<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規部屋</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <room-form new-room :new-room-building-id="buildingId" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
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

<script lang="ts">
import { defineComponent } from 'vue';
import RoomForm from 'components/room/RoomForm.vue';

export default defineComponent({
  name: 'RoomCreatePage',
  components: { RoomForm },
  methods: {
    save() {
      this.$router.push({ name: 'building-detail', params: { id: this.buildingId } });
    },
  },
  computed: {
    buildingId() {
      const id = this.$route.params.buildingId;
      if (typeof id != 'string') {
        throw new Error('Invalid building id');
      }
      return id;
    },
  }
});
</script>

