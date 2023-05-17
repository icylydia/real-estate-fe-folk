<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <building-form />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="cancel"
        />
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
import BuildingForm from 'components/building/BuildingForm.vue';
import { mapActions, mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';

export default defineComponent({
  name: 'BuildingEditPage',
  components: { BuildingForm },
  async mounted() {
    try {
      await this.getBuildingDetail(this.buildingId);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    ...mapActions(useBuildingStore, ['getBuildingDetail']),
    save() {
      this.$router.push({ name: 'building-detail', params: { id: this.buildingId } });
    },
    cancel() {
      this.$router.push({ name: 'building-detail', params: { id: this.buildingId } });
    },
  },
  computed: {
    ...mapState(useBuildingStore, {
      building: 'formModel',
    }),
    buildingId() {
      const id = this.$route.params.id;
      if (typeof id != 'string') {
        throw new Error('Invalid building id');
      }
      return id;
    },
  }
});
</script>
