import { defineStore } from 'pinia';
import type { RegularExpenseBase } from 'src/api';
import { api } from 'boot/api';
import _ from 'lodash';

type RegularExpenseModel = Partial<
  RegularExpenseBase
> & {
  totalAmount?: number;
}

export const useRegularExpenseStore = defineStore('regularExpense', {
  state: () => ({
    model: {} as RegularExpenseModel,
  }),
  actions: {
    updateTotalAmount() {
      const amount = this.model.amount ?? 0;
      const tax = this.model.tax?? 0;
      this.model.totalAmount = amount + tax;
    },
    resetModel(model: RegularExpenseBase = {}) {
      this.model = _.cloneDeep(model);
      this.updateTotalAmount();
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
