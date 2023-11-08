<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { useRouter } from 'vue-router';
import { FormValidationResult } from 'vee-validate';
import { useDepartmentStore } from 'stores/department-store';

const loading = ref(false);
const form = ref<InstanceType<typeof DepartmentForm>>();
const router = useRouter();

const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = validation.values;
    const newDepartment = await useDepartmentStore().createDepartment(data);
    await router.push({
      name: 'department-detail',
      params: { id: newDepartment.id },
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useDepartmentStore().reset();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規部署</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <DepartmentForm new-department ref="form" />
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
