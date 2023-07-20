import { defineStore } from 'pinia';
import { OwnerDetailResponse, OwnerInRequest, OwnerInResponse } from 'src/api';
import { api } from 'boot/api';

export type OwnerFormModel = Partial<
  OwnerInRequest & OwnerInResponse & OwnerDetailResponse
>

const defaultFormModel: OwnerFormModel = {}

export const useOwnerStore = defineStore('owner', {
  state: () => ({
    ownerList: [] as OwnerInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    reset() {
      this.ownerList = [];
      this.formModel = defaultFormModel;
    },
    async getOwnerList() {
      const resp = await api.getOwners();
      this.ownerList = resp.items ?? [];
    },
    async getOwner(id: string) {
      this.formModel = await api.getOwner(id);
    },
  },
});
