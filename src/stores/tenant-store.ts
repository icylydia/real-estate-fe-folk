import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { TenantInRequest, TenantInResponse } from 'src/api';

export type TenantFormModel = Partial<
  TenantInRequest & TenantInResponse
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
    reset() {
      this.tenantList = [];
    },
  },
});
