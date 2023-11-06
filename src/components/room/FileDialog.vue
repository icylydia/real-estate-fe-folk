<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRoomStore } from 'stores/room-store';
import { useRoom } from 'src/utils/room';
import { ref } from 'vue';

defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

defineEmits([
  'update:show',
  'submit',
]);

const { fileModel: model } = storeToRefs(useRoomStore());
const file = ref<File | undefined>(undefined)
const { fileCategoryOptions } = useRoom();
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
          <div class="text-h6">書類</div>
        </q-card-section>
        <q-card-section>
          <q-form>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <q-select
                    v-model="model.category"
                    label="カテゴリー"
                    :options="fileCategoryOptions"
                    clearable
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <q-file
                    v-model="file"
                    label="ファイル"
                    :clearable="true"
                  >
                    <template v-slot:prepend>
                      <q-icon name="sym_r_attach_file" />
                    </template>
                  </q-file>
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn label="取消" color="negative" @click="$emit('update:show', false)" />
          <q-btn label="確認" color="primary" @click="$emit('submit', model, file); $emit('update:show', false);" />
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
