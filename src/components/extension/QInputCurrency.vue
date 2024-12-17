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
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formattedValue(): string {
      let value = typeof this.modelValue === 'string' ? parseInt(this.modelValue, 10) : this.modelValue;
      if (!this.modelValue || !value) value = 0;
      return Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
    },
  },
  methods: {
    handleUpdateModelValue(value: string | number | null) {
      if (value === null) {
        this.$emit('update:modelValue', undefined);
        return;
      }
      if (typeof value === 'number') {
        this.$emit('update:modelValue', value);
        return;
      }
      const parsedValue = parseInt(value.replace(/\D/g, ''), 10);
      const emitValue = isNaN(parsedValue) ? undefined : parsedValue;
      this.$emit('update:modelValue', emitValue);
    },
  },
})
</script>
