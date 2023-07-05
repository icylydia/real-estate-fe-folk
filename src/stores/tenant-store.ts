import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { AddressInResponse, TenantDetailResponse, TenantInRequest, TenantInResponse } from 'src/api';

export type TenantFormModel = Partial<
  TenantInRequest & TenantInResponse & TenantDetailResponse
>

const defaultFormModel: TenantFormModel = {
  address: {},
  emergencyContact: {
    address: {},
  },
}

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantList: [] as TenantInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    async getTenantList() {
      const resp = await api.getTenants();
      this.tenantList = resp.items ?? [];
    },
    async getTenant(id: string) {
      this.formModel = await api.getTenant(id);
    },
    reset() {
      this.tenantList = [];
      this.formModel = defaultFormModel;
    },
    validatePostalCode() {
      const postalCode = this.formModel.address?.postalCode;
      if (!postalCode) {
        return false;
      }
      return RegExp(/^\d{3}-\d{4}$/).exec(postalCode) !== null;
    },
    async updateAddressFromPostalCode() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const postalCode = this.formModel.address!.postalCode!;
      const resp = await api.getAddressByPostalCode(postalCode);
      this.setAddressExceptPostalCode(resp)
    },
    setAddressExceptPostalCode(address: AddressInResponse) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        postalCode,
        ...addressExceptPostalCode
      } = address;
      const originalPostalCode = this.formModel.address?.postalCode;
      this.formModel.address = {
        postalCode: originalPostalCode,
        ...addressExceptPostalCode,
      }
    },
    async updateEmergencyContactAddressFromPostalCode() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const postalCode = this.formModel.emergencyContact!.address!.postalCode!;
      const resp = await api.getAddressByPostalCode(postalCode);
      this.setEmergencyContactAddressExceptPostalCode(resp)
    },
    setEmergencyContactAddressExceptPostalCode(address: AddressInResponse) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        postalCode,
        ...addressExceptPostalCode
      } = address;
      const originalPostalCode = this.formModel.emergencyContact?.address?.postalCode;
      this.formModel.emergencyContact = {
        ...this.formModel.emergencyContact,
        address: {
          postalCode: originalPostalCode,
          ...addressExceptPostalCode,
        }
      }
    },
  },
});
