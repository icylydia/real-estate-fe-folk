import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  AddressInResponse,
  PaginationResponsePagination,
  TenantDetailResponse,
  TenantInRequest,
  TenantInResponse
} from 'src/api';

export type TenantFormModel = Partial<
  TenantInRequest & TenantInResponse & TenantDetailResponse
>

const defaultFormModel: TenantFormModel = {
  address: {},
  emergencyContact: {
    address: {},
  },
  workplace: {
    address: {},
  },
}

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantList: [] as TenantInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    reset() {
      this.tenantList = [];
      this.formModel = defaultFormModel;
    },
    resetFormModel() {
      this.formModel = defaultFormModel;
    },
    async getTenantList(itemsPerPage?: number, page?: number, query?: string) {
      const resp = await api.getTenants(itemsPerPage, page, query);
      this.tenantList = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getTenant(id: string) {
      this.formModel = await api.getTenant(id);
    },
    async createTenant(data: TenantInRequest) {
      return await api.createTenant(data);
    },
    async updateTenant(id: string, data: TenantInRequest) {
      await api.updateTenant(data, id);
    },
    async deleteTenant(id: string) {
      await api.deleteTenant(id);
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
    async updateWorkplaceAddressFromPostalCode() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const postalCode = this.formModel.workplace!.address!.postalCode!;
      const resp = await api.getAddressByPostalCode(postalCode);
      this.setWorkplaceAddressExceptPostalCode(resp)
    },
    setWorkplaceAddressExceptPostalCode(address: AddressInResponse) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        postalCode,
        ...addressExceptPostalCode
      } = address;
      const originalPostalCode = this.formModel.workplace?.address?.postalCode;
      this.formModel.workplace = {
        ...this.formModel.workplace,
        address: {
          postalCode: originalPostalCode,
          ...addressExceptPostalCode,
        }
      }
    },
  },
});
