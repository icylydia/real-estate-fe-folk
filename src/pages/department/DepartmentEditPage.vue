<script setup lang="ts">
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DepartmentFormModel, useDepartmentStore } from 'stores/department-store';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import useErrorHandler from 'components/app/useErrorHandler';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const departmentId = typeof route.params.id == 'string' ? route.params.id : '';
const form = ref<InstanceType<typeof DepartmentForm>>();
const { formModel: department } = storeToRefs(useDepartmentStore());
const { toastHandler } = useErrorHandler()

onMounted(async () => {
  loading.value = true;
  try {
    await  useDepartmentStore().getDepartment(departmentId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save =  async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
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
  } catch (error) {
    toastHandler('部署の更新に失敗しました。')
  } finally {
    loading.value = false;
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
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <department-form ref="form" />
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
