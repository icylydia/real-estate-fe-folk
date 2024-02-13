<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { OwnerFormModel, useOwnerStore } from 'stores/owner-store';
import OwnerForm from 'components/owner/OwnerForm.vue';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const saving = ref(false);
const form = ref<InstanceType<typeof OwnerForm>>();

const route = useRoute();
const router = useRouter();
const ownerId = typeof route.params.id == 'string' ? route.params.id : '';
const { formModel: owner } = storeToRefs(useOwnerStore());
const { toastHandler } = useErrorHandler();

onMounted(async () => {
  loading.value = true;
  try {
    await useOwnerStore().getOwner(ownerId);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
});

const save = async () => {
  const validation: FormValidationResult<any> | undefined = await form.value?.validate();
  if (!validation || !validation.valid) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const newOwner: OwnerFormModel = {
      ...owner.value,
      ...data,
    };
    await useOwnerStore().updateOwner(ownerId, newOwner);
    await router.push({
      name: 'owner-detail',
      params: { id: ownerId }
    });
  } catch (error) {
    await toastHandler(error)
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'owner-detail',
    params: { id: ownerId }
  });
};

const $q = useQuasar();
const onResetPassword = () => {
  $q.dialog({
    title: 'パスワードリセット',
    message: `オーナー「${owner.value.lastName} ${owner.value.firstName}」のパスワードをリセットしますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!owner.value.id) {
      return;
    }
    try {
      await useOwnerStore().resetPassword(owner.value.id);
      await router.push({
        name: 'owner-detail',
        params: { id: ownerId }
      });
    } catch (error) {
      await toastHandler(error)
    }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <owner-form
          ref="form"
          v-if="!loading"
          @reset-password="onResetPassword"
        />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="取消"
          @click="cancel"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="primary"
          label="保存"
          @click="save"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
