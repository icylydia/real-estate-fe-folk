import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { TenantDetailResponse, TenantInRequest, TenantInResponse } from 'src/api';

export type TenantFormModel = Partial<
  TenantInRequest & TenantInResponse & TenantDetailResponse
>

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantList: [] as TenantInResponse[],
    formModel: {} as TenantFormModel,
  }),
  actions: {
    async getTenantList() {
      const resp = await api.getTenants();
      this.tenantList = resp.items || [];
    },
    async getTenant(id: string) {
      this.formModel = await api.getTenant(id);
    },
    reset() {
      this.tenantList = [];
    },
  },
});
