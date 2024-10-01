<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRouter } from 'vue-router';
import { nextTick, onMounted, ref } from 'vue';
import { useIncomeStore } from 'stores/income-store';
import { FormValidationResult } from 'vee-validate';
import { Optional } from 'src/utils/framework';
import useErrorHandler from 'components/app/useErrorHandler';
import { IncomeInRequest } from 'src/api';

const router = useRouter();
const loading = ref(true);
const saving = ref(false);
const form = ref<InstanceType<typeof IncomeForm>>();
const { toastHandler } = useErrorHandler();

const onSave = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation || !validation.valid || !validation.values) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values as IncomeInRequest;
    const newIncome　= await useIncomeStore().createIncome(data);
    await router.push({
      name: 'income-detail',
      params: { id: newIncome.id }
    });
  } catch (error) {
    await toastHandler(error)
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  useIncomeStore().resetFormModel();
  nextTick(() => {
    loading.value = false;
  });
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規収入</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="saving" />
        <q-card-section>
          <income-form new-income ref="form" v-if="!loading" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
            :disable="loading || saving"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
