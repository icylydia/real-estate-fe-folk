import { defineStore } from 'pinia';
import { RentalContractRegularIncome } from 'src/api';
import { api } from 'boot/api';
import _ from 'lodash';

export const useRegularIncomeStore = defineStore('regularIncome', {
  state: () => ({
    model: {} as RentalContractRegularIncome,
  }),
  actions: {
    resetModel(model: RentalContractRegularIncome = {}) {
      this.model = _.cloneDeep(model);
    },
    async createRegularIncome(data: RentalContractRegularIncome) {
      return await api.createRegularIncome(data);
    },

    async updateRegularIncome(id: string, data: RentalContractRegularIncome) {
      return await api.updateRegularIncome(data, id);
    },

    async deleteRegularIncome(id: string) {
      return await api.deleteRegularIncome(id);
    },
  },
});
