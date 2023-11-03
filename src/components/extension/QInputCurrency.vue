<template>
  <q-input
    v-bind="$props"
    :model-value="formattedValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QInputCurrency',
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formattedValue(): string {
      let value = this.modelValue;
      if (!this.modelValue) value = 0;
      return Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
    },
  },
  methods: {
    handleUpdateModelValue(value: string) {
      const parsedValue = parseInt(value.replace(/\D/g, ''), 10);
      const emitValue = isNaN(parsedValue) ? undefined : parsedValue;
      this.$emit('update:modelValue', emitValue);
    },
  },
})
</script>
