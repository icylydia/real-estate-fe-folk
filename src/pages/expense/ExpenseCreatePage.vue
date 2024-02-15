<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useExpenseStore } from 'stores/expense-store';
import { FormValidationResult } from 'vee-validate';
import { Optional } from 'src/utils/framework';
import useErrorHandler from 'components/app/useErrorHandler';

const router = useRouter();
const loading = ref(false);
const form = ref<InstanceType<typeof ExpenseForm>>();
const { toastHandler } = useErrorHandler();

const save = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation || !validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newExpense = await useExpenseStore().createExpense(data);
    await router.push({
      name: 'expense-detail',
      params: { id: newExpense.id },
    });
  } catch (error) {
    await toastHandler(error)
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useExpenseStore().resetFormModel();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規支出</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <expense-form new-expense ref="form" />
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
      </q-form>
    </q-card>
  </q-page>
</template>
