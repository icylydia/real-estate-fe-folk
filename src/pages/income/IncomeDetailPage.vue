<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useIncomeStore } from 'stores/income-store';
import { storeToRefs } from 'pinia';
import { IncomeInResponse } from 'src/api';
import useErrorHandler from 'components/app/useErrorHandler';
import { useQuasar } from 'quasar';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();
const { formModel: income } = storeToRefs(useIncomeStore());
const $q = useQuasar();

const incomeId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const toEdit = async () => {
  try {
    await router.push({
      name: 'income-edit',
      params: { id: incomeId.value },
    });
  } catch (error) {
    await toastHandler(error);
  }
};

const backToList = async () => {
  try {
    await router.push({
      name: 'income-list',
    });
  } catch (error) {
    await toastHandler(error);
  }
};

onMounted(async () => {
  await reload();
});

const reload = async () => {
  loading.value = true;
  try {
    await useIncomeStore().getIncome(incomeId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    await toastHandler(error);
  }
};

const approve = async () => {
  try {
    await useIncomeStore().confirmAll([incomeId.value]);
    await reload();
  } catch (error) {
    await toastHandler(error);
  }
};

const reject = async () => {
  try {
    await useIncomeStore().rejectAll([incomeId.value]);
    await reload();
  } catch (error) {
    await toastHandler(error);
  }
};

const remove = async () => {
  $q.dialog({
    title: '収入削除',
    message: '収入を削除しますか？',
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!income.value.id) {
      return;
    }
    try {
      await useIncomeStore().deleteIncome(income.value.id);
    } catch {
      await toastHandler('収入の削除に失敗しました。');
    }
    await router.push({
      name: 'income-list',
    });
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <income-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <template v-if="!loading && income.confirmStatus == IncomeInResponse.ConfirmStatusEnum.Unconfirmed">
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
        <template v-if="!loading && income.confirmStatus == IncomeInResponse.ConfirmStatusEnum.Rejected">
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
