import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  PaginationResponsePagination,
  TenantDetailResponse,
  TenantInRequest,
  TenantInResponse, TenantOptionsResponse
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
    renterOptions: [] as TenantOptionsResponse[],
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
    resetRenterOptions() {
      this.renterOptions = [];
    },
    async getRenterOptions() {
      this.renterOptions = await api.getTenantOptions() ?? [];
    }
  },
});
