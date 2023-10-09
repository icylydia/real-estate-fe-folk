import { defineStore } from 'pinia';
import { ExpenseDetailResponse, ExpenseInRequest, ExpenseInResponse } from 'src/api';
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
  ExpenseInRequest & ExpenseInResponse  & ExpenseDetailResponse
>
const defaultFormModel: ExpenseModel = {}

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    searchParams: {} as GetExpenseListRequest,
    list: [] as ExpenseInResponse[],
    formModel: defaultFormModel,
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
    async createExpense(data: ExpenseInRequest) {
      return await api.createExpense(data);
    },
    async updateExpense(id: string, data: ExpenseInRequest) {
      await api.updateExpense(data, id);
    },
    async deleteExpense(id: string) {
      await api.deleteExpense(id);
    },
  },
});
