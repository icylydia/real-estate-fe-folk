import { defineStore } from 'pinia';
import { IncomeDetailResponse, IncomeInRequest, IncomeInResponse } from 'src/api';
import _ from 'lodash';
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
    async getIncomeList(params: GetIncomeListRequest) {
      const defaultParams: GetIncomeListRequest = {
        itemsPerPage: 15,
        page: 1,
      }
      const query = _.defaults(params, defaultParams)
      const resp = await api.getIncomes(
        query.itemsPerPage,
        query.page,
        query.year,
        query.month,
        query.onlyUnconfirmed,
        query.query,
      );
      this.list = resp.items ?? [];
    },
    async getIncome(id: string) {
      this.formModel = await api.getIncome(id);
    },
    async createIncome(data: IncomeInRequest) {
      return await api.createIncome(data);
    },
    async updateIncome(id: string, data: IncomeInRequest) {
      await api.updateIncome(data, id);
    },
    async deleteIncome(id: string) {
      await api.deleteIncome(id);
    },
  },
});
