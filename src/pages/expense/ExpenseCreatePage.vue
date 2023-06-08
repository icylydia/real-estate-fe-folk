<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const save = async () => {
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
      <q-form>
        <q-card-section>
          <div class="text-h5">新規支出</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <expense-form new-expense />
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
