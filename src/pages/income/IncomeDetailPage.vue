<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useIncomeStore } from 'stores/income-store';
import { storeToRefs } from 'pinia';
import { IncomeInResponse } from 'src/api';

const router = useRouter();
const route = useRoute();
const incomeId = typeof route.params.id == 'string' ? route.params.id : '';
const toEdit = async () => {
  try {
    await router.push({
      name: 'income-edit',
      params: { id: incomeId },
    });
  } catch (error) {
    console.log(error);
  }
};

const backToList = async () => {
  try {
    await router.push({
      name: 'income-list',
    });
  } catch (error) {
    console.log(error);
  }
};

const loading = ref(false);

const { getIncome } = useIncomeStore();
const { formModel: income } = storeToRefs(useIncomeStore());

onMounted(async () => {
  loading.value = true;
  try {
    await getIncome(incomeId);
  } catch (error) {
    console.log(error);
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
        <income-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <template v-if="!loading && income.confirmStatus == IncomeInResponse.ConfirmStatusEnum.Unconfirmed">
          <q-btn
            style="width: 100px"
            color="primary"
            label="承認"
          />
          <q-btn
            style="width: 100px"
            color="negative"
            label="拒否"
          />
          <q-separator vertical class="q-mx-lg" />
        </template>
        <template v-if="!loading && income.confirmStatus == IncomeInResponse.ConfirmStatusEnum.Rejected">
          <q-btn
            style="width: 100px"
            color="primary"
            label="承認"
          />
          <q-btn
            style="width: 100px"
            color="negative"
            label="削除"
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
