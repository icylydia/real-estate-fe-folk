<script setup lang="ts">
import { PropType } from 'vue';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { RentalContractRegularIncome } from 'src/api';
import { useRentalContract } from 'src/utils/rental-contract';
import { usePayment } from 'src/utils/payment';
import { useRegularIncomeStore } from 'stores/regular-income-store';

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
  submit: [value: RentalContractRegularIncome]
}>();

const { model } = storeToRefs(useRegularIncomeStore());
const { regularIncomeCategoryOptions: categoryOptions } = useRentalContract();
const { paymentMethodOptions } = usePayment();

const dayOptions: Array<{
  label: string;
  value: string;
}> = (() => {
  const options: Array<{
    label: string;
    value: string;
  }> = [{
    label: '月初',
    value: 'firstDay',
  }];
  for (let i = 1; i <= 31; i++) {
    options.push({
      label: `${i}日`,
      value: i.toString(),
    });
  }
  options.push({
    label: '月末',
    value: 'lastDay',
  });
  return options;
})();

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
          <div class="text-h6">経常収入</div>
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
                    :disable="model.paymentMethod !== RentalContractRegularIncome.PaymentMethodEnum.Other"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-input
                    v-model="model.amount"
                    label="金額"
                    clearable
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-select
                    :model-value="model.targetMonths"
                    @update:model-value="model.targetMonths = $event.sort((a: number, b: number) => a - b)"
                    emit-value
                    label="月"
                    :options="monthOptions"
                    clearable
                    multiple
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-6">
                <q-item-section>
                  <q-select
                    v-model="model.targetDay"
                    label="日"
                    :options="dayOptions"
                    emit-value
                    map-options
                    clearable
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

<style scoped lang="scss">
.card {
  width: 700px;
  max-width: 80vw;
}
</style>
