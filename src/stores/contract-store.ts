import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { RentalContractInResponse } from 'src/api';

export const useContractStore = defineStore('contract', {
  state: () => ({
    rentalContractList: [] as RentalContractInResponse[],
  }),
  actions: {
    async getRentalContractList() {
      const resp = await api.getRentalContracts();
      this.rentalContractList = resp.items || [];
    },
    reset() {
      this.rentalContractList = [];
    },
  }
});
