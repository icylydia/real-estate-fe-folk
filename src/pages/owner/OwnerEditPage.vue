<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOwnerStore } from 'stores/owner-store';
import OwnerForm from "components/owner/OwnerForm.vue";

const loading = ref(false);

const route = useRoute();
const router = useRouter();
const ownerId = typeof route.params.id == 'string' ? route.params.id : '';
const { getOwner } = useOwnerStore();

onMounted(async () => {
  loading.value = true;
  try {
    await getOwner(ownerId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = () => {
  router.push({
    name: 'owner-detail',
    params: { id: ownerId }
  });
};

const cancel = () => {
  router.push({
    name: 'owner-detail',
    params: { id: ownerId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <owner-form />
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
