<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useExpenseStore } from 'stores/expense-store';
import { usePayment } from 'src/utils/payment';

defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  newExpense: {
    type: Boolean,
    default: false,
  }
});

const { formModel: expense } = storeToRefs(useExpenseStore());

const {
  expenseCategoryOptions: categoryOptions,
  paymentMethodOptions,
} = usePayment();
</script>

<template>
  <div class="text-h6">
    支出基本情報{{ readonly ? '（閲覧）' : '（編集）'}}
  </div>
  <q-list class="row">
    <q-item class="col-12" v-if="!newExpense">
      <q-item-section>
        <q-input v-model="expense.id" label="支出ID" readonly />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="expense.title" label="件名" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-select
          v-model="expense.category"
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
            v-model="expense.paymentMethod"
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
        <q-input v-model="expense.amount" label="金額" :readonly="readonly" />
      </q-item-section>
    </q-item>
    <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <q-item-section>
        <q-input v-model="expense.date" label="日付" :readonly="readonly" />
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
        <q-input v-model="expense.note" label="説明" autogrow clearable :readonly="readonly" />
      </q-item-section>
    </q-item>
  </q-list>
</template>
