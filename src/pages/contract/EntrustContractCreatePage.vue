<script setup lang="ts">
import EntrustContractForm from 'components/contract/EntrustContractForm.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useContractStore } from 'stores/contract-store';
import { FormValidationResult } from 'vee-validate';


const loading = ref(false);
const form = ref<InstanceType<typeof EntrustContractForm>>();
const router = useRouter();

const onSave = async () => {
  try {
    const validation: FormValidationResult<any> = await form.value?.validate();
    if (!validation.valid) {
      return;
    }
    loading.value = true;
    const data = validation.values;
    const newContract = await useContractStore().createEntrustContract(data);
    await router.push({
      name: 'entrust-contract-detail',
      params: { id: newContract.id }
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useContractStore().resetEntrustContractFormModel();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規管理委託契約</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <entrust-contract-form new-contract ref="form" />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="$router.back()"
        ></q-btn>
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="onSave"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
