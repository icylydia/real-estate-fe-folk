<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { onMounted, ref } from 'vue';
import { useExpenseStore } from 'stores/expense-store';
import { useRoute, useRouter } from 'vue-router';

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const expenseId = typeof route.params.id == 'string' ? route.params.id : '';
const { getExpense } = useExpenseStore();

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

const cancel = async () => {
  try {
    await router.push({
      name: 'expense-detail',
      params: { id: expenseId },
    });
  } catch (error) {
    console.log(error);
  }
};
const save = async () => {
  try {
    await router.push({
      name: 'expense-detail',
      params: { id: expenseId },
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
        <expense-form />
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
