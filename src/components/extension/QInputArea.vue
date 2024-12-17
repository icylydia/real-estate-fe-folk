<template>
  <q-input
    v-bind="$props"
    :model-value="modelValue"
    @update:model-value="handleUpdateModelValue"
    bottom-slots
  >
    <template #hint>
      単位：m<sup>2</sup>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QInputArea',
  props: {
    modelValue: {
      type: [Number, String],
      default: 0,
    },
    precision: {
      type: [Number, String],
      default: 2,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleUpdateModelValue(value: string | number | null) {
      if (value === null) {
        this.$emit('update:modelValue', null);
        return;
      }

      if (typeof value === 'number') {
        this.$emit('update:modelValue', value);
        return;
      }

      let precision = typeof this.precision === 'string' ? parseInt(this.precision, 10) : this.precision;
      if (!precision || precision < 0) precision = 2;
      const parsedValue = Number(value.replace(/[^0-9.]/g, '')).toFixed(precision);
      const parsedValueNumber = Number(parsedValue);
      this.$emit('update:modelValue', parsedValueNumber);
    },
  },
});
</script>
