<script setup lang="ts">
import { PropType } from 'vue';

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
</script>

<template>

</template>

<style scoped lang="scss">
.card {
  width: 700px;
  max-width: 80vw;
}
</style>
