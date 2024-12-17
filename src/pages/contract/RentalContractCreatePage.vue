<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { useRouter } from 'vue-router';
import type { FormValidationResult } from 'vee-validate';
import type { Optional } from 'src/utils/framework';
import useErrorHandler from 'components/app/useErrorHandler';
import _ from 'lodash';

const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof RentalContractForm>>();
const router = useRouter();
const { toastHandler } = useErrorHandler();

const save = async () => {
  try {
    const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
    if (!validation?.valid) {
      return;
    }
    saving.value = true;
    const data = validation.values;
    const necessaryData = _.omit(data, []);
    const payload = {
      ...useContractStore().rentalContractFormModel,
      ...necessaryData
    };
    const newContract = await useContractStore().createRentalContract(payload);
    await router.push({
      name: 'rental-contract-detail',
      params: { id: newContract.id }
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  useContractStore().resetRentalContractFormModel();
  await nextTick(() => {
    loading.value = false;
  });
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規賃貸借契約</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="saving" />
      <q-card-section>
        <rental-contract-form new-contract ref="form" v-if="!loading" />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="$router.back()"
          :disable="loading || saving"
        ></q-btn>
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
          :disable="loading || saving"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
