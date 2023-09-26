<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
import { onMounted, ref } from 'vue';
import { useEmployeeStore } from 'stores/employee-store';
import { useRouter } from 'vue-router';

const loading = ref(false);
const form = ref<InstanceType<typeof EmployeeForm>>();
const router = useRouter();

const save = async () => {
  const validation = await form.value?.validate();
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
    const newEmployee = await useEmployeeStore().createEmployee(data);
    await router.push({
      name: 'employee-detail',
      params: { id: newEmployee.id },
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  useEmployeeStore().reset();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規社員</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-linear-progress indeterminate v-if="loading" />
        <q-card-section>
          <employee-form new-employee ref="form" />
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
      </q-form>
    </q-card>
  </q-page>
</template>
