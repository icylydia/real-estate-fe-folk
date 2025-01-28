<script setup lang="ts">
import { ref } from 'vue';
import type { QPopupProxy } from 'quasar';

defineProps({
  modelValue: {
    type: String,
    required: false,
  },
});

const currentView = ref<'Years' | 'Months'>('Years');

const emit = defineEmits(['update:modelValue']);

const handleUpdateModelValue = (value: string | number | null) => {
  emit('update:modelValue', value);
};

const popupProxy = ref<QPopupProxy | null>(null);

const handleUpdateDate = (value: string | number | null) => {
  emit('update:modelValue', value);
  if (currentView.value === 'Years') {
    currentView.value = 'Months';
  } else {
    currentView.value = 'Years';
    popupProxy.value?.hide();
  }
};

const handleBeforeShow = () => {
  currentView.value = 'Years';
};
</script>

<template>
<q-input
    v-bind="$props"
    :model-value="modelValue"
    @update:model-value="handleUpdateModelValue"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy
          ref="popupProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
          @before-show="handleBeforeShow"
        >
          <q-date
            minimal
            default-view="Years"
            emit-immediately
            mask="YYYY-MM"
            no-unset
            :model-value="modelValue"
            @update:model-value="handleUpdateDate"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
