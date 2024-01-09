<script setup lang="ts">
import ExpenseForm from 'components/payment/ExpenseForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useExpenseStore } from 'stores/expense-store';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { storeToRefs } from 'pinia';
import { ExpenseInResponse } from 'src/api';
import { useQuasar } from 'quasar';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();
const { formModel: expense } = storeToRefs(useExpenseStore());
const $q = useQuasar();

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
  await reload();
});

const reload = async () => {
  loading.value = true;
  try {
    await useExpenseStore().getExpense(expenseId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    toastHandler(error);
  }
};

const approve = async () => {
  try {
    await useExpenseStore().confirmAll([expenseId.value]);
    await reload();
  } catch (error) {
    toastHandler(error);
  }
};

const reject = async () => {
  try {
    await useExpenseStore().rejectAll([expenseId.value]);
    await reload();
  } catch (error) {
    toastHandler(error);
  }
};

const remove = async () => {
  $q.dialog({
    title: '支出削除',
    message: `支出「${expense.value.title} 」を削除しますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!expense.value.id) {
      return;
    }
    try {
      await useExpenseStore().deleteExpense(expense.value.id);
    } catch (e) {
      toastHandler('支出の削除に失敗しました。');
    }
    await router.push({
      name: 'expense-list',
    });
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <expense-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <template v-if="!loading && expense.confirmStatus == ExpenseInResponse.ConfirmStatusEnum.Unconfirmed">
          <q-btn
            style="width: 100px"
            color="primary"
            label="承認"
            @click="approve"
          />
          <q-btn
            style="width: 100px"
            color="negative"
            label="拒否"
            @click="reject"
          />
          <q-separator vertical class="q-mx-lg" />
        </template>
        <template v-if="!loading && expense.confirmStatus == ExpenseInResponse.ConfirmStatusEnum.Rejected">
          <q-btn
            style="width: 100px"
            color="primary"
            label="承認"
            @click="approve"
          />
          <q-btn
            style="width: 100px"
            color="negative"
            label="削除"
            @click="remove"
          />
          <q-separator vertical class="q-mx-lg" />
        </template>
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
