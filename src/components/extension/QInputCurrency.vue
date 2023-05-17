<template>
  <q-input
    v-bind="$props"
    :model-value="formattedValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { QInput } from 'quasar';

export default defineComponent({
  name: 'QInputCurrency',
  extends: QInput,
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    formattedValue(): string {
      return Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(this.modelValue);
    },
  },
  methods: {
    handleUpdateModelValue(value: string) {
      const parsedValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
      this.$emit('update:modelValue', parsedValue);
    },
  },
})
</script>
