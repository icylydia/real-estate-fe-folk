<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useIncomeStore } from 'stores/income-store';
import { FormValidationResult } from 'vee-validate';

const router = useRouter();
const loading = ref(false);


const form = ref<InstanceType<typeof IncomeForm>>();

const onSave = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newIncome　= await useIncomeStore().createIncome(data);
    await router.push({
      name: 'income-detail',
      params: { id: newIncome.id }
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useIncomeStore().resetFormModel();
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
        <q-linear-progress indeterminate v-if="loading" />
        <q-card-section>
          <income-form new-income ref="form" />
        </q-card-section>
        <q-separator></q-separator>
        <q-card-actions align="right">
          <q-btn
            style="width: 100px"
            color="primary"
            label="保存"
            @click="onSave"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>
