<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import OwnerForm from 'components/owner/OwnerForm.vue';
import { useOwnerStore } from 'stores/owner-store';
import { FormValidationResult } from 'vee-validate';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const form = ref<InstanceType<typeof OwnerForm>>();

const router = useRouter();
const { toastHandler } = useErrorHandler();

const save = async () => {
  const validation: FormValidationResult<any> | undefined = await form.value?.validate();
  if (!validation || !validation.valid || !validation.values) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newOwner = await useOwnerStore().createOwner(data);
    await router.push({
      name: 'owner-detail',
      params: { id: newOwner.id }
    });
  } catch (error: any) {
    await toastHandler(error);
  } finally {
    loading.value = false;
  }
};

const { reset } = useOwnerStore();
onMounted(() => {
  reset();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規オーナー</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <owner-form new-owner ref="form" />
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
