import { defineStore } from 'pinia';
import type { ExpenseDetailResponse, ExpenseInRequest, ExpenseInResponse, PaginationResponsePagination } from 'src/api';
import { api } from 'boot/api';

interface GetExpenseListRequest {
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

export type ExpenseModel = Partial<
  ExpenseInRequest & ExpenseInResponse  & ExpenseDetailResponse
> & {
  totalAmount?: number;
}
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
      building?: string,
      room?: string,
      category?: string,
      targetYear?: number,
      targetMonth?: number,
      dateFrom?: string,
      dateTo?: string,
      confirmStatuses?: Array<string>,
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getExpenses(
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
    async getExpense(id: string): Promise<void> {
      const expense = await api.getExpense(id);
      const amount = expense.amount ?? 0;
      const tax = expense.tax?? 0;
      const totalAmount = amount + tax;
      this.formModel = {
        ...expense,
        totalAmount,
      }
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
