<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { IncomeModel, useIncomeStore } from 'stores/income-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';

const router = useRouter();
const route = useRoute();

const loading = ref(false);

const { getIncome,updateIncome } = useIncomeStore();

const form = ref<InstanceType<typeof IncomeForm>>();
const { formModel: income } = storeToRefs(useIncomeStore());

const incomeId = typeof route.params.id == 'string' ? route.params.id : '';
const cancel = async () => {
  try {
    await router.push({
      name: 'income-detail',
      params: { id: incomeId },
    });
  } catch (error) {
    console.log(error);
  }
};
const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newIncome: IncomeModel = {
      ...income.value,
      ...data,
    };
    await updateIncome(incomeId, newIncome);
    await router.push({
      name: 'income-detail',
      params: { id: incomeId },
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
  
};


onMounted(async () => {
  loading.value = true;
  try {
    await getIncome(incomeId);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <income-form ref="form"/>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="cancel"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
