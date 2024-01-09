<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TenantFormModel, useTenantStore } from 'stores/tenant-store';
import TenantForm from 'components/tenant/TenantForm.vue';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();
const { toastHandler } = useErrorHandler();

const route = useRoute();
const router = useRouter();
const tenantId = typeof route.params.id == 'string' ? route.params.id : '';
const { formModel: tenant } = storeToRefs(useTenantStore());

onMounted(async () => {
  loading.value = true;
  try {
    useTenantStore().resetFormModel();
    await useTenantStore().getTenant(tenantId);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    toastHandler(error);
  }
});

const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newTenant: TenantFormModel = {
      ...tenant.value,
      ...data,
    };
    await useTenantStore().updateTenant(tenantId, newTenant);
    await router.push({
      name: 'tenant-detail',
      params: { id: tenantId }
    });
  } catch (error) {
    toastHandler(error);
  } finally {
    loading.value = false;
  }
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
        <tenant-form ref="form" v-if="!loading" />
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
