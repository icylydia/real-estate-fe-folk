<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from 'stores/employee-store';

const route = useRoute();
const router = useRouter();

const loading = ref(false);

const employeeId = typeof route.params.id == 'string' ? route.params.id : '';

const { getEmployeeDetail } = useEmployeeStore();

onMounted(async () => {
  loading.value = true;
  try {
    await getEmployeeDetail(employeeId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = () => {
  router.push({
    name: 'employee-detail',
    params: { id: employeeId }
  });
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
        <employee-form />
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
