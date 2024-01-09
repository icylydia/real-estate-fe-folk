<script setup lang="ts">
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { nextTick, onMounted, ref } from 'vue';
import { useDepartmentStore } from 'stores/department-store';
import { useRoute, useRouter } from 'vue-router';
import EmployeeList from 'components/department/EmployeeList.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);

const departmentId = typeof route.params.id === 'string' ? route.params.id : '';

const { getDepartment, reset: resetDepartmentStore } = useDepartmentStore();

onMounted(async () => {
  try {
    loading.value = true;
    resetDepartmentStore()
    await getDepartment(departmentId);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
});

const toEdit = () => {
  router.push({
    name: 'department-edit',
    params: { id: departmentId },
  });
};

const backToList = () => {
  router.push({
    name: 'department-list',
  });
};

</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <department-form readonly v-if="!loading" />
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
    <q-card bordered class="q-mt-md">
      <q-card-section>
        <employee-list />
      </q-card-section>
    </q-card>
  </q-page>
</template>
