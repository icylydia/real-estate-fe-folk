<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBuildingStore } from 'stores/building-store';
import { useBuilding } from 'src/utils/building';
import { PropType, ref } from 'vue';

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

defineEmits([
  'update:show',
  'submit',
]);

const { regularExpenseModel: model } = storeToRefs(useBuildingStore());
const { regularExpenseOptions: nameOptions } = useBuilding();

const filteredNameOptions = ref<string[]>(nameOptions);

const createNameOption = (name: string, done: (item: string, mode: string) => void) => {
  if (name.length > 0) {
    done(name, 'add-unique')
  }
};

const filterNameFn = (val: string, update: (callbackFn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredNameOptions.value = nameOptions
      return
    }
    const needle = val.toLowerCase()
    filteredNameOptions.value = nameOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
};

const onMonthChange = (values: number[]) => {
  let inOrder = true;
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] + 1 !== values[i + 1]) {
      inOrder = false;
      break;
    }
  }
  if (!inOrder) {
    values.sort((a, b) => a - b);
  }
};
</script>

<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event.target.value)"
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
                    v-model="model.name"
                    label="項目"
                    use-input
                    input-debounce="0"
                    :options="filteredNameOptions"
                    clearable
                    @new-value="createNameOption"
                    @filter="filterNameFn"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-select
                    v-model="model.months"
                    label="月"
                    :options="[1,2,3,4,5,6,7,8,9,10,11,12]"
                    clearable
                    multiple
                    @update:model-value="onMonthChange"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-input
                    v-model="model.defaultAmount"
                    label="金額"
                    clearable
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="$emit('submit', model); $emit('update:show', false);" />
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
