<script setup lang="ts">
import EntrustContractForm from 'components/contract/EntrustContractForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useContractStore } from 'stores/contract-store';
import type { FormValidationResult } from 'vee-validate';
import type { Optional } from 'src/utils/framework';
import useErrorHandler from 'components/app/useErrorHandler';
import _ from 'lodash';


const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof EntrustContractForm>>();
const router = useRouter();
const { toastHandler } = useErrorHandler();

const onSave = async () => {
  try {
    const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
    if (!validation?.valid) {
      return;
    }
    saving.value = true;
    const data = validation.values;
    const necessaryData = _.omit(data, ['managementFees']);
    const payload = {
      ...useContractStore().entrustContractFormModel,
      ...necessaryData,
    };
    const created = await useContractStore().createEntrustContract(payload);
    await router.push({
      name: 'entrust-contract-detail',
      params: { id: created.id }
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  useContractStore().resetEntrustContractFormModel();
  await nextTick(() => {
    loading.value = false;
  });
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規管理委託契約</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="saving" />
      <q-card-section>
        <entrust-contract-form new-contract ref="form" v-if="!loading" />
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
          @click="onSave"
          :disable="loading || saving"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
