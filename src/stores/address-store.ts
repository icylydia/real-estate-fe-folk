import { defineStore } from 'pinia';
import { api } from 'boot/api';

export const useAddressStore = defineStore('address', {
  actions: {
    async getAddressByPostalCode(postalCode: string) {
      return api.getAddressByPostalCode(postalCode);
    }
  }
});
