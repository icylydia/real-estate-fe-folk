<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  comment: {
    type: String,
    default: '',
  },
});

defineEmits([
  'update:show',
  'update:comment',
  'submit',
]);
</script>

<template>
  <q-dialog
    :model-value="show"
    @update:model-value="$emit('update:show', $event)"
    persistent
  >
    <q-card>
      <q-card-section>
        <q-form>
          <q-input
            :model-value="comment"
            @update:model-value="$emit('update:comment', $event)"
            label="コメント"
            type="textarea"
            style="width: 480px"
          />
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="negative"
          label="キャンセル"
          @click="$emit('update:show', false)"
        />
        <q-btn
          color="primary"
          label="保存"
          @click="$emit('submit', comment)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
