import { defineStore } from 'pinia';
import {OwnerDetailResponse, OwnerInRequest, OwnerInResponse, PaginationResponsePagination} from 'src/api';
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
    async getOwnerList(itemsPerPage?: number, page?: number, query?: string) {
      const resp = await api.getOwners(itemsPerPage, page, query);
      this.ownerList = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getOwner(id: string) {
      this.formModel = await api.getOwner(id);
    },
    async createOwner(data: OwnerInRequest) {
      return api.createOwner(data);
    },
    async updateOwner(id: string, data: OwnerInRequest) {
      await api.updateOwner(data, id);
    },
    async deleteOwner(id: string) {
      await api.deleteOwner(id);
    },
  },
});
