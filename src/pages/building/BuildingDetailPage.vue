<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <building-form readonly />
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
import { mapActions, mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import BuildingForm from 'components/building/BuildingForm.vue';

export default defineComponent({
  name: 'BuildingDetailPage',
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
    toEdit() {
      this.$router.push({ name: 'building-edit', params: { id: this.buildingId } });
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
      return parseInt(id);
    },
  }
});
</script>
