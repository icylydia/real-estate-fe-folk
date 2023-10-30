<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TenantFormModel, useTenantStore } from 'stores/tenant-store';
import TenantForm from 'components/tenant/TenantForm.vue';
import { FormValidationResult } from 'vee-validate';
import { storeToRefs } from 'pinia';
import _ from 'lodash';
import { AddressBase, EmergencyContactBase, WorkplaceBase } from 'src/api';

const loading = ref(false);
const form = ref<InstanceType<typeof TenantForm>>();

const route = useRoute();
const router = useRouter();
const tenantId = typeof route.params.id == 'string' ? route.params.id : '';
const { formModel: tenant } = storeToRefs(useTenantStore());

onMounted(async () => {
  loading.value = true;
  try {
    useTenantStore().resetFormModel();
    await useTenantStore().getTenant(tenantId);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const save = async () => {
  const validation: FormValidationResult<any> = await form.value?.validate();
  if (!validation.valid) {
    return;
  }
  loading.value = true;
  try {
    const data = _.pick(validation.values, [
      'lastName',
      'firstName',
      'gender',
      'phone',
      'email',
      'guarantorCompanyStatus',
      'guarantorCompanyName',
    ])
    const address: AddressBase = {
      postalCode: validation.values.addressPostalCode,
      prefectureId: validation.values.addressPrefectureId,
      detailAddress1: validation.values.addressDetailAddress1,
      detailAddress2: validation.values.addressDetailAddress2,
      detailAddress3: validation.values.addressDetailAddress3,
    }
    const emergencyContact: EmergencyContactBase = {
      lastName: validation.values.emergencyContactLastName,
      firstName: validation.values.emergencyContactFirstName,
      gender: validation.values.emergencyContactGender,
      relationship: validation.values.emergencyContactRelationship,
      phone: validation.values.emergencyContactPhone,
      email: validation.values.emergencyContactEmail,
      address: {
        postalCode: validation.values.emergencyContactAddressPostalCode,
        prefectureId: validation.values.emergencyContactAddressPrefectureId,
        detailAddress1: validation.values.emergencyContactAddressDetailAddress1,
        detailAddress2: validation.values.emergencyContactAddressDetailAddress2,
        detailAddress3: validation.values.emergencyContactAddressDetailAddress3,
      }
    }
    const workplace: WorkplaceBase = {
      name: validation.values.workplaceName,
      phone: validation.values.workplacePhone,
      address: {
        postalCode: validation.values.workplaceAddressPostalCode,
        prefectureId: validation.values.workplaceAddressPrefectureId,
        detailAddress1: validation.values.workplaceAddressDetailAddress1,
        detailAddress2: validation.values.workplaceAddressDetailAddress2,
        detailAddress3: validation.values.workplaceAddressDetailAddress3,
      }
    }
    const newTenant: TenantFormModel = {
      ...tenant.value,
      ...data,
      address,
      emergencyContact,
      workplace,
    };
    console.log(tenant.value)
    console.log({ newTenant });
    await useTenantStore().updateTenant(tenantId, newTenant);
    await router.push({
      name: 'tenant-detail',
      params: { id: tenantId }
    });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cancel = () => {
  router.push({
    name: 'tenant-detail',
    params: { id: tenantId }
  });
};
</script>

<template>
  <q-page padding>
    <q-card bordered>
      <q-linear-progress indeterminate v-if="loading" />
      <q-card-section>
        <tenant-form ref="form" />
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
