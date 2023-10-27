<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIncomeStore } from 'stores/income-store';
import { usePayment } from 'src/utils/payment';
import QInputCurrency from 'components/extension/QInputCurrency.vue';
import { PaymentBase } from 'src/api';
import { useForm } from 'vee-validate';
import { computed } from 'vue';

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newIncome: {
    type: Boolean,
    default: false,
  }
});

const { formModel: income } = storeToRefs(useIncomeStore());

const initialValues: any = computed( () => {
  if (props.newIncome) {
    return {};
  }
  return income.value;
});
const { validate } = useForm({
  initialValues,
});

defineExpose({
  validate,
})

const {
  incomeCategoryOptions: categoryOptions,
  paymentMethodOptions,
  describeIncomeConfirmStatus,
} = usePayment();
</script>

<template>
  <div class="row justify-between">
    <div class="text-h6">
      収入基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
    </div>
    <q-badge
      v-if="!newIncome"
      :color="describeIncomeConfirmStatus(income.confirmStatus).color"
      :label="describeIncomeConfirmStatus(income.confirmStatus).description"
    />
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newIncome">
      <q-item-section>
        <q-input v-model="income.id" label="収入ID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="income.title" label="件名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="income.category"
          label="種類"
          :readonly="readonly"
          emit-value
          map-options
          :options="categoryOptions"
          clearable
        >
        </q-select>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-item-section>
          <q-select
            v-model="income.paymentMethod"
            label="支払方法"
            :readonly="readonly"
            emit-value
            map-options
            :options="paymentMethodOptions"
            clearable
          >
          </q-select>
        </q-item-section>
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="income.otherPaymentDescription" label="支払方法" :readonly="readonly || income.paymentMethod != PaymentBase.PaymentMethodEnum.Other" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input-currency v-model="income.amount" label="金額" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="income.date" label="日付" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input label="入居者" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input label="物件" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input label="部屋" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input label="大家さん" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-input v-model="income.note" label="説明" autogrow clearable :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
