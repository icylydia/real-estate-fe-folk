<script setup lang="ts">
import EmployeeForm from 'components/employee/EmployeeForm.vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useEmployeeStore } from 'stores/employee-store';

const route = useRoute();
const router = useRouter();

const employeeId = typeof route.params.id == 'string' ? route.params.id : '';

const toEdit = () => {
  router.push({
    name: 'employee-edit',
    params: { id: employeeId },
  });
};

const backToList = () => {
  router.push({
    name: 'employee-list',
  });
};

const loading = ref(false);

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
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <employee-form readonly />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="primary"
          label="一覧へ"
          @click="backToList"
          :disable="loading"
        />
        <q-btn
          style="width: 100px"
          color="negative"
          label="編集"
          @click="toEdit"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
