import { defineStore } from 'pinia';
import type {
  OwnerDetailResponse,
  OwnerInRequest,
  OwnerInResponse,
  OwnerOptionsResponse,
  PaginationResponsePagination
} from 'src/api';
import { api } from 'boot/api';

export type OwnerFormModel = Partial<
  OwnerInRequest & OwnerInResponse & OwnerDetailResponse
>

const defaultFormModel: OwnerFormModel = {}

export const useOwnerStore = defineStore('owner', {
  state: () => ({
    ownerList: [] as OwnerInResponse[],
    formModel: defaultFormModel,
    ownerOptions: [] as OwnerOptionsResponse[],
  }),
  actions: {
    reset() {
      // TODO: remove this method
      this.ownerList = [];
      this.formModel = defaultFormModel;
    },
    async getOwnerList(
      itemsPerPage?: number,
      page?: number,
      id?: string,
      name?: string,
      email?: string,
      phone?: string,
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getOwners(
        itemsPerPage,
        page,
        id,
        name,
        email,
        phone,
      );
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
    async resetPassword(id: string): Promise<OwnerInResponse> {
      return api.resetOwnerInitialPassword(id);
    },
    resetOwnerOptions() {
      this.ownerOptions = [];
    },
    async getOwnerOptions() {
      this.ownerOptions = await api.getOwnerOptions() ?? [];
    },
  },
});
