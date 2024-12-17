<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import type { ExpenseModel } from 'stores/expense-store';
import { useExpenseStore } from 'stores/expense-store';
import { useRoute, useRouter } from 'vue-router';
import type { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import useErrorHandler from 'components/app/useErrorHandler';
import type { Optional } from 'src/utils/framework';

const loading = ref(false);
const saving = ref(false);
const router = useRouter();
const form = ref<InstanceType<typeof ExpenseForm>>();
const { formModel: expense } = storeToRefs(useExpenseStore());
const { toastHandler } = useErrorHandler();

const expenseId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useExpenseStore().resetFormModel();
    await useExpenseStore().getExpense(expenseId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
});

const cancel = async () => {
  try {
    await router.push({
      name: 'expense-detail',
      params: { id: expenseId.value },
    });
  } catch (error) {
    console.log(error);
  }
};

const save = async () => {
  const validation: Optional<FormValidationResult<any>> = await form.value?.validate();
  if (!validation || !validation.valid) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const newExpense: ExpenseModel = {
      ...expense.value,
      ...data,
    };
    await useExpenseStore().updateExpense(expenseId.value, newExpense);
    await router.push({
      name: 'expense-detail',
      params: { id: expenseId.value },
    });
  } catch (error) {
    await toastHandler(error)
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <expense-form ref="form" v-if="!loading" />
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
