<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { onMounted, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { useRouter } from 'vue-router';
import { FormValidationResult } from 'vee-validate';

const loading = ref(false);
const form = ref<InstanceType<typeof RentalContractForm>>();
const router = useRouter();

const save = async () => {
  try {
    const validation: FormValidationResult<any> = await form.value?.validate();
    if (!validation.valid) {
      return;
    }
    loading.value = true;
    const data = validation.values;
    const newContract = await useContractStore().createRentalContract(data);
    await router.push({
      name: 'rental-contract-detail',
      params: { id: newContract.id }
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useContractStore().resetRentalContractFormModel();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規賃貸借契約</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <rental-contract-form new-contract ref="form" />
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
