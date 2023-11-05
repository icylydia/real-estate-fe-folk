import { defineStore } from 'pinia';
import { IncomeDetailResponse, IncomeInRequest, IncomeInResponse, PaginationResponsePagination } from 'src/api';
import { api } from 'boot/api';

interface GetIncomeListRequest {
  itemsPerPage?: number;
  page?: number;
  year?: number;
  month?: number;
  onlyUnconfirmed?: boolean;
  query?: string;
}

export type IncomeModel = Partial<
  IncomeInRequest & IncomeInResponse & IncomeDetailResponse
>
const defaultFormModel: IncomeModel = {}
export const useIncomeStore = defineStore('income', {
  state: () => ({
    searchParams: {} as GetIncomeListRequest,
    list: [] as IncomeInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    reset() {
      this.searchParams = {
        itemsPerPage: 15,
        page: 1,
        onlyUnconfirmed: false,
      };
      this.list = [];
      this.formModel = {};
    },
    async getIncomeList(
      itemsPerPage?: number,
      page?: number,
      year?: number,
      month?: number,
      onlyUnconfirmed?: boolean,
      query?: string
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getIncomes(
        itemsPerPage,
        page,
        year,
        month,
        onlyUnconfirmed,
        query,
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
  },
});
