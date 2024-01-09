<script setup lang="ts">
import RentalContractForm from 'components/contract/RentalContractForm.vue';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useContractStore } from 'stores/contract-store';
import useErrorHandler from 'components/app/useErrorHandler';
import { storeToRefs } from 'pinia';

const loading = ref(false);
const router = useRouter()
const { toastHandler } = useErrorHandler();
const { rentalContractFormModel: contract } = storeToRefs(useContractStore())

const contractId = computed(() => {
  const id = useRoute().params.id;
  if (typeof id != 'string') {
    throw new Error('Invalid building id');
  }
  return id;
});

const toEdit = async () => {
  try {
    await router.push({ name: 'rental-contract-edit', params: { id: contractId.value } });
  } catch (error) {
    toastHandler(error);
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    useContractStore().resetRentalContractFormModel();
    await useContractStore().getRentalContract(contractId.value);
    await nextTick(() => {
      loading.value = false;
    });
  } catch (error) {
    toastHandler(error);
    loading.value = false;
  }
});

const statusToActive = async () => {
  try {
    await useContractStore().activeRentalContract(contractId.value);
  } catch (error) {
    toastHandler(error);
  }
};

const statusToPreRenewal = async () => {
  try {
    await useContractStore().preRenewRentalContract(contractId.value);
  } catch (error) {
    toastHandler(error);
  }
};

const statusToPreTerminated = async () => {
  try {
    await useContractStore().preTerminateRentalContract(contractId.value);
  } catch (error) {
    toastHandler(error);
  }
};

const statusToTerminated = async () => {
  try {
    await useContractStore().terminateRentalContract(contractId.value);
  } catch (error) {
    toastHandler(error);
  }
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <rental-contract-form readonly v-if="!loading" />
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
              v-if="['beforeStart', 'toBeRenewed', 'toBeTerminated'].includes(contract.status.toString())"
            >
              <q-item-section>
                <q-item-label>契約確定</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="statusToPreRenewal"
              v-if="['active', 'toBeTerminated'].includes(contract.status.toString())"
            >
              <q-item-section>
                <q-item-label>再契約予定</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="statusToPreTerminated"
              v-if="['active', 'toBeRenewed'].includes(contract.status.toString())"
            >
              <q-item-section>
                <q-item-label>解約予定</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="statusToTerminated"
              v-if="['toBeTerminated'].includes(contract.status.toString())"
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
          v-if="!loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>
