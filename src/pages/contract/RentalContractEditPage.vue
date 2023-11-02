<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { onMounted, ref } from 'vue';
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { RentalContractFormModel, useContractStore } from 'stores/contract-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();

const route = useRoute();
const router = useRouter();
const contractId = typeof route.params.id == 'string' ? route.params.id : '';
const { rentalContractFormModel: contract } = storeToRefs(useContractStore());

onMounted(async () => {
  loading.value = true;
  try {
    useContractStore().resetRentalContractFormModel();
    await useContractStore().getRentalContract(contractId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
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
    const newContract: RentalContractFormModel = {
      ...contract.value,
      ...data,
    };
    await useContractStore().updateRentalContract(contractId, newContract);
    await router.push({
      name: 'rental-contract-detail',
      params: { id: contractId }
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'rental-contract-detail',
    params: { id: contractId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <rental-contract-form ref="form" />
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
