import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { TenantInResponse } from 'src/api';

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    tenantList: [] as TenantInResponse[],
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
