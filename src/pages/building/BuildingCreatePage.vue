<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規物件</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <building-form new-building />
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

<script lang="ts" setup>
import BuildingForm from 'components/building/BuildingForm.vue';
</script>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions, mapState } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import useErrorHandler from 'components/app/useErrorHandler.js';

export default defineComponent({
  name: 'BuildingCreatePage',
  setup () {
    const { toastHandler } = useErrorHandler();
    return {
      toastHandler,
    };
  },
  methods: {
    ...mapActions(useBuildingStore, {
      callApi: 'callCreateBuildingApi',
    }),
    async save () {
      try {
        await this.callApi();
      } catch (e) {
        this.toastHandler(e);
      }
      this.$router.push({ name: 'building-list' });
    },
  },
  computed: {
    ...mapState(useBuildingStore, {
      building: 'formModel',
    })
  }
});
</script>
