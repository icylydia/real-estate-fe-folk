<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { computed, onMounted, ref } from 'vue';
import { useExpenseStore } from 'stores/expense-store';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();

const expenseId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const toEdit = async () => {
  try {
    await router.push({
      name: 'expense-edit',
      params: { id: expenseId.value },
    });
  } catch (error) {
    toastHandler(error);
  }
};

const backToList = async () => {
  try {
    await router.push({
      name: 'expense-list',
    });
  } catch (error) {
    toastHandler(error);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    useExpenseStore().resetFormModel();
    await useExpenseStore().getExpense(expenseId.value);
  } catch (error) {
    toastHandler(error);
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
        <expense-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧へ"
          @click="backToList"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="negative"
          label="編集"
          @click="toEdit"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
