import { defineStore } from 'pinia';
import { DepartmentInResponse } from 'src/api';
import { api } from 'boot/api';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    list: [] as DepartmentInResponse[],
  }),
  actions: {
    reset() {
      this.list = [];
    },
    async getDepartmentList() {
      this.reset();
      this.list = await api.getDepartments();
    },
  }
});
