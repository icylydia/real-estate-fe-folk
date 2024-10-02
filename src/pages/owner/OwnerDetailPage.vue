<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import BuildingList from 'components/owner/BuildingList.vue';
import OwnerForm from 'components/owner/OwnerForm.vue';
import { RouteParamValue, useRoute, useRouter } from 'vue-router';
import { useOwnerStore } from 'stores/owner-store';
import useErrorHandler from 'components/app/useErrorHandler';
const { toastHandler } = useErrorHandler();

const loading = ref(false);

const route = useRoute()
const ownerId = ref<string | RouteParamValue[]>(route.params.id)
const router = useRouter()
const toEdit = async () => {
  try {
    if (!(ownerId.value instanceof String || typeof ownerId.value == 'string')) {
      throw new Error('Invalid owner id');
    }
    await router.push({ name: 'owner-edit', params: { id: ownerId.value } });
  } catch (error) {
    await toastHandler(error);
  }
}

const { getOwner, reset } = useOwnerStore();
onMounted(async () => {
  loading.value = true;
  try {
    if (!(ownerId.value instanceof String || typeof ownerId.value == 'string')) {
      console.log(typeof ownerId.value);
      throw new Error('Invalid owner id');
    }
    reset();
    await getOwner(ownerId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    await toastHandler(error);
    loading.value = false;
  }
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <owner-form readonly v-if="!loading" />
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
    <q-card bordered class="q-mt-md" v-if="!loading">
      <q-card-section>
        <building-list />
      </q-card-section>
    </q-card>
  </q-page>
</template>
