<script setup lang="ts">
import TenantForm from 'components/tenant/TenantForm.vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { useTenantStore } from 'stores/tenant-store';
import { storeToRefs } from 'pinia';

const router = useRouter();

const save = async () => {
  await router.push({ name: 'tenant-list' });
};

const { reset } = useTenantStore();
const { formModel } = storeToRefs(useTenantStore());
onMounted(() => {
  reset();
  formModel.value.emergencyContact = {};
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-form>
        <q-card-section>
          <div class="text-h5">新規入居者</div>
        </q-card-section>
      </q-form>
      <q-separator></q-separator>
      <q-card-section>
        <tenant-form new-tenant />
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
