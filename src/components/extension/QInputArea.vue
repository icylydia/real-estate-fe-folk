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
import { QInput } from 'quasar';

export default defineComponent({
  name: 'QInputArea',
  extends: QInput,
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    handleUpdateModelValue(value: string) {
      const parsedValue = Number(value.replace(/[^0-9.]/g, ''));
      this.$emit('update:modelValue', parsedValue);
    },
  },
});
</script>
