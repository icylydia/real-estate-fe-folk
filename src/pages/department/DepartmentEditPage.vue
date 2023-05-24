<script setup lang="ts">
import DepartmentForm from 'components/department/DepartmentForm.vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const departmentId = typeof route.params.id == 'string' ? route.params.id : '';

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
