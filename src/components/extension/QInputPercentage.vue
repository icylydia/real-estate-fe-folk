<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const formattedValue = computed(() => {
  if (props.modelValue == undefined) return '';
  let value: number = typeof props.modelValue === 'string' ? parseFloat(props.modelValue) : props.modelValue;
  if (!props.modelValue || !value) value = 0;
  return Intl.NumberFormat(
    'ja-JP',
    { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 }
  ).format(value / 100);
});


const handleUpdateModelValue = (value: string | number | null) => {
  if (value === null) {
    emit('update:modelValue', null);
    return;
  }
  if (typeof value === 'number') {
    value = value.toString();
  }
  const digits = value.replace(/((?![\d.]).)/g, '');
  const parsedValue = parseFloat(digits);
  const emitValue = isNaN(parsedValue) ? undefined : parsedValue;
  emit('update:modelValue', emitValue);
};
</script>

<template>
  <q-input
    v-bind="$props"
    :model-value="formattedValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>
