<script setup lang="ts">
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useTenantStore } from 'stores/tenant-store';
import { FormValidationResult } from 'vee-validate';
import { Optional } from 'src/utils/framework';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();

const router = useRouter();
const { toastHandler } = useErrorHandler();

const save = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation?.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newTenant = await useTenantStore().createTenant(data);
    await router.push({
      name: 'tenant-detail',
      params: { id: newTenant.id }
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useTenantStore().resetFormModel();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規入居者</div>
        </q-card-section>
      </q-form>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <tenant-form new-tenant ref="form" />
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
    </q-card>
  </q-page>
</template>
