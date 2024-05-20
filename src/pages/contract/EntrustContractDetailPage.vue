<script setup lang="ts">
import EntrustContractForm from 'components/contract/EntrustContractForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useContractStore } from 'stores/contract-store';
import { useRoute, useRouter } from 'vue-router';
import useErrorHandler from 'components/app/useErrorHandler';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const router = useRouter();
const { toastHandler } = useErrorHandler();
const { entrustContractFormModel: contract } = storeToRefs(useContractStore());

const toEdit = async () => {
  try {
    await router.push({ name: 'entrust-contract-edit', params: { id: contractId.value } });
  } catch (error) {
    await toastHandler(error);
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
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    loading.value = false;
    await toastHandler(error);
  }
});

const statusToActive = async () => {
  try {
    await useContractStore().activeEntrustContract(contractId.value);
  } catch (error) {
    await toastHandler(error);
  }
};

const statusToTerminated = async () => {
  try {
    await useContractStore().terminateEntrustContract(contractId.value);
  } catch (error) {
    await toastHandler(error);
  }
};
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
        <q-btn-dropdown
          color="primary"
          label="状態変更"
          v-if="!loading && contract.status"
          :disable="['terminated'].includes(contract.status.toString())"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="statusToActive"
              v-if="['beforeStart'].includes(contract.status.toString())"
            >
              <q-item-section>
                <q-item-label>契約確定</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="statusToTerminated"
              v-if="['active'].includes(contract.status.toString())"
            >
              <q-item-section>
                <q-item-label>解約確定</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-btn-dropdown>
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
