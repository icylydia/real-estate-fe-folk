import { defineStore } from 'pinia';
import { ExpenseDetailResponse, ExpenseInRequest, ExpenseInResponse, PaginationResponsePagination } from 'src/api';
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
const defaultFormModel: ExpenseModel = {
  building: undefined,
  room: undefined,
  owner: undefined,
  tenant: undefined,
}

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    searchParams: {} as GetExpenseListRequest,
    list: [] as ExpenseInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    resetFormModel() {
      this.formModel = defaultFormModel;
    },
    async getExpenseList(
      itemsPerPage?: number,
      page?: number,
      year?: number,
      month?: number,
      query?: string,
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getExpenses(
        itemsPerPage,
        page,
        year,
        month,
        query,
      );
      this.list = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getExpense(id: string) {
      this.formModel = await api.getExpense(id);
    },
    async createExpense(data: ExpenseInRequest) {
      return api.createExpense(data);
    },
    async updateExpense(id: string, data: ExpenseInRequest) {
      return api.updateExpense(data, id);
    },
    async deleteExpense(id: string) {
      return api.deleteExpense(id);
    },
    async confirmAll(ids: string[]) {
      return api.updateExpenseConfirmed({ ids });
    },
    async rejectAll(ids: string[]) {
      return api.updateExpenseRejected({ ids });
    },
  },
});
