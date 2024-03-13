<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { RentalContractFormModel, useContractStore } from 'stores/contract-store';
import { FormValidationResult } from 'vee-validate';
import { Optional } from 'src/utils/framework';
import _ from 'lodash';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();
const { toastHandler } = useErrorHandler();
const router = useRouter();

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
  } catch (error) {
    await toastHandler(error);
  } finally {
    await nextTick(() => {
      loading.value = false;
    });
  }
});
const onSave = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation?.valid) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const necessaryData = _.omit(data, ['regularIncomes']);
    const newContract: RentalContractFormModel = {
      ...useContractStore().rentalContractFormModel,
      ...necessaryData,
    };
    await useContractStore().updateRentalContract(contractId.value, newContract);
    await router.push({
      name: 'rental-contract-detail',
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
    name: 'rental-contract-detail',
    params: { id: contractId.value }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="saving" />
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
          :disable="loading || saving"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
          :disable="loading || saving"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
