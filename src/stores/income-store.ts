import { defineStore } from 'pinia';
import { IncomeInRequest, IncomeInResponse } from 'src/api';
import _ from 'lodash';
import { api } from 'boot/api';

interface GetIncomeListRequest {
  itemsPerPage?: number;
  page?: number;
  year?: number;
  month?: number;
  query?: string;
}

export type IncomeModel = Partial<
  IncomeInRequest & IncomeInResponse
>
export const useIncomeStore = defineStore('income', {
  state: () => ({
    searchParams: {} as GetIncomeListRequest,
    list: [] as IncomeInResponse[],
    formModel: {} as IncomeModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = {};
    },
    async getIncomeList(params: GetIncomeListRequest) {
      this.reset();
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
        query.query,
      );
      this.list = resp.items ?? [];
    },
    async getIncome(id: string) {
      this.reset();
      this.formModel = await api.getIncome(id);
    }
  },
});
