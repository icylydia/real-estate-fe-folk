<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTenantStore } from 'stores/tenant-store';
import TenantForm from 'components/tenant/TenantForm.vue';

const loading = ref(false);

const route = useRoute();
const router = useRouter();
const tenantId = typeof route.params.id == 'string' ? route.params.id : '';
const { getTenant } = useTenantStore();

onMounted(async () => {
  loading.value = true;
  try {
    await getTenant(tenantId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = () => {
  router.push({
    name: 'tenant-detail',
    params: { id: tenantId }
  });
};

const cancel = () => {
  router.push({
    name: 'tenant-detail',
    params: { id: tenantId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <tenant-form />
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
