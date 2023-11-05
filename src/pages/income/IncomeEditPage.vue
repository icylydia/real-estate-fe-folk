<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { IncomeModel, useIncomeStore } from 'stores/income-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';

const router = useRouter();
const loading = ref(false);
const form = ref<InstanceType<typeof IncomeForm>>();
const { formModel: income } = storeToRefs(useIncomeStore());

const incomeId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const cancel = async () => {
  try {
    await router.push({
      name: 'income-detail',
      params: { id: incomeId.value },
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
    await useIncomeStore().updateIncome(incomeId.value, newIncome);
    await router.push({
      name: 'income-detail',
      params: { id: incomeId.value },
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
    await useIncomeStore().getIncome(incomeId.value);
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
        <income-form ref="form" />
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
