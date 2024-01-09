<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { RentalContractFormModel, useContractStore } from 'stores/contract-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();

const router = useRouter();
const { rentalContractFormModel: contract } = storeToRefs(useContractStore());

const contractId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useContractStore().resetRentalContractFormModel();
    await useContractStore().getRentalContract(contractId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
});
const onSave = async () => {
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
    await useContractStore().updateRentalContract(contractId.value, newContract);
    await router.push({
      name: 'rental-contract-detail',
      params: { id: contractId.value }
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  router.push({
    name: 'rental-contract-detail',
    params: { id: contractId.value }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <rental-contract-form ref="form" v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="onCancel"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
