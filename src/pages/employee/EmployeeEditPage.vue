<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from 'stores/employee-store';
import { storeToRefs } from 'pinia';
import type { FormValidationResult } from 'vee-validate';
import { useQuasar } from 'quasar';
import useErrorHandler from 'components/app/useErrorHandler';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const employeeId = typeof route.params.id == 'string' ? route.params.id : '';
const form = ref<InstanceType<typeof EmployeeForm>>();
const { formModel: employee } = storeToRefs(useEmployeeStore());
const { toastHandler } = useErrorHandler();

onMounted(async () => {
  loading.value = true;
  try {
    await useEmployeeStore().getEmployeeDetail(employeeId);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
});

const save = async () => {
  const validation: FormValidationResult<any> | undefined = await form.value?.validate();
  if (!validation || !validation.valid || !validation.values) {
    return;
  }
  saving.value = true;
  try {
    const data = validation.values;
    if (data.departments) {
      data.departmentIds = data.departments.map((d: any) => d.id);
      delete data.departments;
    }
    const newEmployee = {
      ...employee.value,
      ...data,
    };
    await useEmployeeStore().updateEmployee(employeeId, newEmployee);
    await router.push({
      name: 'employee-detail',
      params: { id: employeeId }
    });
  } catch (error) {
    await toastHandler(error);
  } finally {
    saving.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'employee-detail',
    params: { id: employeeId }
  });
};

const $q = useQuasar();
const onResetPassword = () => {
  $q.dialog({
    title: 'パスワードリセット',
    message: `社員「${employee.value.lastName} ${employee.value.firstName}」のパスワードをリセットしますか？`,
    ok: { label: '確認', color: 'negative'},
    cancel: { label: 'キャンセル', color: 'grey-8'},
    persistent: true,
  }).onOk(async () => {
    if (!employee.value.id) {
      return;
    }
    try {
      await useEmployeeStore().resetPassword(employee.value.id);
      await router.push({
        name: 'employee-detail',
        params: { id: employee.value.id }
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
        <employee-form
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
