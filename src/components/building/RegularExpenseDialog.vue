<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { PropType } from 'vue';
import { usePayment } from 'src/utils/payment';
import { RegularExpenseBase } from 'src/api';
import _ from 'lodash';
import { useRegularExpenseStore } from 'stores/regular-expense-store';
import QInputCurrency from 'components/extension/QInputCurrency.vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String as PropType<'add' | 'edit'>,
    default: 'add',
  },
});

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [value: RegularExpenseBase]
}>();

const { model } = storeToRefs(useRegularExpenseStore());
const { paymentMethodOptions, expenseCategoryOptions: categoryOptions } = usePayment();

const monthOptions: Array<{
  label: string;
  value: number;
}> = (() => {
  const options: Array<{
    label: string;
    value: number;
  }> = [];
  for (let i = 1; i <= 12; i++) {
    options.push({
      label: `${i}月`,
      value: i,
    });
  }
  return options;
})();

const submit = () => {
  const value = _.cloneDeep(model.value);
  emit('submit', value);
  emit('update:show', false);
}
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event)"
      persistent
    >
      <q-card class="card">
        <q-card-section class="bg-primary">
          <div class="text-h6">経常支出</div>
        </q-card-section>
        <q-card-section>
          <q-form>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <q-select
                    v-model="model.category"
                    label="カテゴリ"
                    :options="categoryOptions"
                    clearable
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-select
                    v-model="model.paymentMethod"
                    label="支払方法"
                    :options="paymentMethodOptions"
                    clearable
                    emit-value
                    map-options
                    @update:model-value="model.otherPaymentDescription = ''"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    v-model="model.otherPaymentDescription"
                    label="その他支払方法"
                    clearable
                    :disable="model.paymentMethod !== RegularExpenseBase.PaymentMethodEnum.Other"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input-currency
                    :model-value="model.amount"
                    @update:model-value="(value) => {
                      model.amount = value;
                      if (value) {
                        const tax = Math.round(value * 0.1);
                        model.tax = tax;
                      } else {
                        model.tax = undefined;
                      }
                    }"
                    label="金額(税抜)"
                    clearable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-input
                    v-model="model.tax"
                    label="消費税"
                    clearable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-select
                    :model-value="model.targetMonths"
                    @update:model-value="model.targetMonths = $event?.sort((a: number, b: number) => a - b) ?? null"
                    emit-value
                    label="月"
                    :options="monthOptions"
                    clearable
                    multiple
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-input
                    v-model="model.note"
                    label="備考"
                    clearable
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: 700px;
  max-width: 80vw;
}
</style>
