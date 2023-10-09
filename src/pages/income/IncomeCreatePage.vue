<script setup lang="ts">
import IncomeForm from 'components/payment/IncomeForm.vue';
import { useRouter,useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { IncomeModel, useIncomeStore } from 'stores/income-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
const router = useRouter();
const route = useRoute();

const loading = ref(false);

const { createIncome } = useIncomeStore();

const form = ref<InstanceType<typeof IncomeForm>>();
//const { formModel: income } = storeToRefs(useIncomeStore());

//const incomeId = typeof route.params.id == 'string' ? route.params.id : '';

const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newIncome= await createIncome(data);
    await router.push({
      name: 'income-list',
    });
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規収入</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <income-form new-income ref="form" />
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
