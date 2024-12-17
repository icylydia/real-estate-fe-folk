<script setup lang="ts">
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { DepartmentFormModel } from 'stores/department-store';
import { useDepartmentStore } from 'stores/department-store';
import type { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import useErrorHandler from 'components/app/useErrorHandler';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const departmentId = typeof route.params.id == 'string' ? route.params.id : '';
const form = ref<InstanceType<typeof DepartmentForm>>();
const { formModel: department } = storeToRefs(useDepartmentStore());
const { toastHandler } = useErrorHandler()

onMounted(async () => {
  loading.value = true;
  try {
    await  useDepartmentStore().getDepartment(departmentId);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
});

const save =  async () => {
  const validation: FormValidationResult<any> | undefined = await form.value?.validate();
  if (!validation || !validation.valid || !validation.values) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    const newDepartment: DepartmentFormModel = {
      ...department.value,
      ...data,
    };
    await useDepartmentStore().updateDepartment(departmentId, newDepartment);
    await router.push({
      name: 'department-detail',
      params: { id: departmentId }
    });
  } catch {
    await toastHandler('部署の更新に失敗しました。')
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'department-detail',
    params: { id: departmentId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading || saving" />
      <q-card-section>
        <department-form ref="form" v-if="!loading" />
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
