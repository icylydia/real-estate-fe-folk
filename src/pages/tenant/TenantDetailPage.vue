<script setup lang="ts">
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useTenantStore } from 'stores/tenant-store';
import ContractList from 'components/tenant/ContractList.vue';

const loading = ref(false);

const route = useRoute()
const tenantId = ref(route.params.id)
const router = useRouter()
const toEdit = async () => {
  try {
    if (typeof tenantId.value != 'string') {
      throw new Error('Invalid tenant id');
    }
    await router.push({ name: 'tenant-edit', params: { id: tenantId.value } });
  } catch (error) {
    console.log(error);
  }
}

const { getTenant, reset } = useTenantStore();
onMounted(async () => {
  loading.value = true;
  try {
    if (typeof tenantId.value != 'string') {
      throw new Error('Invalid tenant id');
    }
    reset();
    await getTenant(tenantId.value);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <tenant-form readonly v-if="!loading" />
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
        <contract-list />
      </q-card-section>
    </q-card>
  </q-page>
</template>
