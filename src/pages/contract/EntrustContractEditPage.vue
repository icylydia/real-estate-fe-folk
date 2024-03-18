<script setup lang="ts">
import EntrustContractForm from 'components/contract/EntrustContractForm.vue';
import { computed, onMounted, ref } from 'vue';
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { EntrustContractFormModel, useContractStore } from 'stores/contract-store';
import { FormValidationResult } from 'vee-validate';
import useErrorHandler from 'components/app/useErrorHandler';
import { Optional } from 'src/utils/framework';
import _ from 'lodash';

const router = useRouter();
const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();
const { toastHandler } = useErrorHandler();

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
    useContractStore().resetEntrustContractFormModel();
    await useContractStore().getEntrustContract(contractId.value);
  } catch (error) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
});

const onSave = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation?.valid) {
    return;
  }
  try {
    saving.value = true;
    const data = validation.values;
    const necessaryData = _.omit(data, ['managementFees']);
    const newContract: EntrustContractFormModel = {
      ...useContractStore().entrustContractFormModel,
      ...necessaryData,
    };
    await useContractStore().updateEntrustContract(contractId.value, newContract);
    await router.push({
      name: 'entrust-contract-detail',
      params: { id: contractId.value }
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
  }
};

const onCancel = () => {
  router.push({
    name: 'entrust-contract-detail',
    params: { id: contractId.value }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <entrust-contract-form ref="form" v-if="!loading" />
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
