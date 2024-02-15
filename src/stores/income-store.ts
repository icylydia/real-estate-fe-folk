import { defineStore } from 'pinia';
import { IncomeDetailResponse, IncomeInRequest, IncomeInResponse, PaginationResponsePagination } from 'src/api';
import { api } from 'boot/api';

interface GetIncomeListRequest {
  itemsPerPage?: number;
  page?: number;
  building?: string;
  room?: string;
  category?: string;
  targetYear?: number;
  targetMonth?: number;
  dateFrom?: string;
  dateTo?: string;
  confirmStatuses?: string[];
}

export type IncomeModel = Partial<
  IncomeInRequest & IncomeInResponse & IncomeDetailResponse
>
const defaultFormModel: IncomeModel = {
  building: undefined,
  room: undefined,
  owner: undefined,
  tenant: undefined,
}
export const useIncomeStore = defineStore('income', {
  state: () => ({
    searchParams: {} as GetIncomeListRequest,
    list: [] as IncomeInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    resetFormModel() {
      this.formModel = defaultFormModel;
    },
    async getIncomeList(
      itemsPerPage?: number,
      page?: number,
      building?: string,
      room?: string,
      category?: string,
      targetYear?: number,
      targetMonth?: number,
      dateFrom?: string,
      dateTo?: string,
      confirmStatuses?: Array<string>,
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getIncomes(
        itemsPerPage,
        page,
        building,
        room,
        category,
        targetYear,
        targetMonth,
        dateFrom,
        dateTo,
        confirmStatuses,
      );
      this.list = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getIncome(id: string) {
      this.formModel = await api.getIncome(id);
    },
    async createIncome(data: IncomeInRequest) {
      return api.createIncome(data);
    },
    async updateIncome(id: string, data: IncomeInRequest) {
      return api.updateIncome(data, id);
    },
    async deleteIncome(id: string) {
      return api.deleteIncome(id);
    },
    async confirmAll(ids: string[]) {
      return api.updateIncomeConfirmed({ ids });
    },
    async rejectAll(ids: string[]) {
      return api.updateIncomeReject({ ids });
    },
  },
});
