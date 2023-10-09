<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { onMounted, ref } from 'vue';
import { useExpenseStore } from 'stores/expense-store';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ExpenseInResponse } from 'src/api';

const loading = ref(false);
const { getExpense } = useExpenseStore();

const { formModel: expense } = storeToRefs(useExpenseStore());
const router = useRouter();
const route = useRoute();
const expenseId = typeof route.params.id == 'string' ? route.params.id : '';

onMounted(async () => {
  loading.value = true;
  try {
    await getExpense(expenseId);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
});

const toEdit = async () => {
  try {
    await router.push({
      name: 'expense-edit',
      params: { id: expenseId },
    });
  } catch (error) {
    console.log(error);
  }
};

const backToList = async () => {
  try {
    await router.push({
      name: 'expense-list',
    });
  } catch (error) {
    console.log(error);
  }
};
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
