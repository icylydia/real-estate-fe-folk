<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import OwnerForm from 'components/owner/OwnerForm.vue';
import { useOwnerStore } from 'stores/owner-store';

const router = useRouter();

const save = async () => {
  await router.push({ name: 'owner-list' });
};

const { reset } = useOwnerStore();
onMounted(() => {
  reset();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規オーナー</div>
        </q-card-section>
      </q-form>
      <q-separator></q-separator>
      <q-card-section>
        <owner-form new-owner />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>
