<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from 'stores/employee-store';
import { storeToRefs } from 'pinia';
import { FormValidationResult } from 'vee-validate';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const employeeId = typeof route.params.id == 'string' ? route.params.id : '';
const form = ref<InstanceType<typeof EmployeeForm>>();
const { formModel: employee } = storeToRefs(useEmployeeStore());

onMounted(async () => {
  loading.value = true;
  try {
    await useEmployeeStore().getEmployeeDetail(employeeId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
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
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'employee-detail',
    params: { id: employeeId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <employee-form ref="form" />
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
