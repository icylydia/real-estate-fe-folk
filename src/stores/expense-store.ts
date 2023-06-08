import { defineStore } from 'pinia';
import { ExpenseInRequest, ExpenseInResponse } from 'src/api';
import _ from 'lodash';
import { api } from 'boot/api';

interface GetExpenseListRequest {
  itemsPerPage?: number;
  page?: number;
  year?: number;
  month?: number;
  query?: string;
}

export type ExpenseModel = Partial<
  ExpenseInRequest & ExpenseInResponse
>

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    searchParams: {} as GetExpenseListRequest,
    list: [] as ExpenseInResponse[],
    formModel: {} as ExpenseModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = {};
    },
    async getExpenseList(params: GetExpenseListRequest) {
      this.reset();
      const defaultParams: GetExpenseListRequest = {
        itemsPerPage: 15,
        page: 1,
      }
      const query = _.defaults(params, defaultParams)
      const resp = await api.getExpenses(
        query.itemsPerPage,
        query.page,
        query.year,
        query.month,
        query.query,
      );
      this.list = resp.items ?? [];
    },
    async getExpense(id: string) {
      this.reset();
      this.formModel = await api.getExpense(id);
    },
  },
});
