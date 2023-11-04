<script setup lang="ts">
import EntrustContractForm from 'components/contract/EntrustContractForm.vue';
import { computed, onMounted, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();

const toEdit = async () => {
  try {
    await router.push({ name: 'entrust-contract-edit', params: { id: contractId.value } });
  } catch (error) {
    toastHandler(error);
  }
};

const contractId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

onMounted(async () => {
  loading.value = true;
  try {
    useContractStore().resetEntrustContractFormModel();
    await useContractStore().getEntrustContract(contractId.value);
  } catch (error) {
    toastHandler(error);
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
        <entrust-contract-form readonly v-if="!loading" />
      </q-card-section>
      <q-separator />
      <q-card-actions align="right">
        <q-btn
          style="width: 100px"
          color="negative"
          label="編集"
          @click="toEdit"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
