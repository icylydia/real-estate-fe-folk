<script setup lang="ts">
import { PropType } from 'vue';
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { useContractStore } from 'stores/contract-store';
import { usePayment } from 'src/utils/payment';
import { useEntrustContract } from 'src/utils/entrust-contract';
import QInputPercentage from 'components/extension/QInputPercentage.vue';
import { EntrustContractManagementFeeBase } from 'src/api';

const { managementFeeModel: model } = storeToRefs(useContractStore());
const {
  incomeCategoryOptions: categoryOptions,
} = usePayment();
const { benefitTypeOptions } = useEntrustContract();

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

const emit = defineEmits([
  'update:show',
  'submit',
]);

const submit = () => {
  const value = _.cloneDeep(model.value);
  emit('submit', value);
  emit('update:show', false);
};
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
          <div class="text-h6">管理費用</div>
        </q-card-section>
        <q-card-section>
          <q-form>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <q-select
                    v-model="model.incomeCategory"
                    label="カテゴリ"
                    :options="categoryOptions"
                    clearable
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-select
                    v-model="model.benefitType"
                    label="利益区分"
                    :options="benefitTypeOptions"
                    clearable
                    emit-value
                    map-options
                    @update:model-value="model.amount = undefined; model.percentage = undefined"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input
                    v-model="model.amount"
                    label="利益金額"
                    :disable="model.benefitType !== EntrustContractManagementFeeBase.BenefitTypeEnum.Fixed"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                <q-item-section>
                  <q-input-percentage
                    v-model="model.percentage"
                    label="利益率"
                    :disable="model.benefitType !== EntrustContractManagementFeeBase.BenefitTypeEnum.Percentage"
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
