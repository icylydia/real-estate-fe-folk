<script setup lang="ts">
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDepartmentStore } from 'stores/department-store';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const departmentId = typeof route.params.id == 'string' ? route.params.id : '';

const { getDepartment } = useDepartmentStore();

onMounted(async () => {
  loading.value = true;
  try {
    await getDepartment(departmentId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = () => {
  router.push({
    name: 'department-detail',
    params: { id: departmentId }
  });
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
        <department-form />
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
