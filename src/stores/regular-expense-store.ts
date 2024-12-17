import { defineStore } from 'pinia';
import type { RegularExpenseBase } from 'src/api';
import { api } from 'boot/api';
import _ from 'lodash';

export const useRegularExpenseStore = defineStore('regularExpense', {
  state: () => ({
    model: {} as RegularExpenseBase,
  }),
  actions: {
    resetModel(model: RegularExpenseBase = {}) {
      this.model = _.cloneDeep(model);
    },
    async createRegularExpense(data: RegularExpenseBase) {
      return await api.createRegularExpense(data);
    },

    async updateRegularExpense(id: string, data: RegularExpenseBase) {
      return await api.updateRegularExpense(data, id);
    },

    async deleteRegularExpense(id: string) {
      return await api.deleteRegularExpense(id);
    },
  },
});
