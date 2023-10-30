<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { onMounted, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';

const loading = ref(false);

const save = async () => {
  loading.value = true;
  try {
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  useContractStore().resetRentalContractFormModel();
});
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-card-section>
        <div class="text-h5">新規賃貸借契約</div>
      </q-card-section>
      <q-separator></q-separator>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <rental-contract-form new-contract ref="form" />
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
