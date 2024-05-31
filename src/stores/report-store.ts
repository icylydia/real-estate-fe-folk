import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  MonthlyIncomeAndExpenseReportInList,
  MonthlyIncomeAndExpenseReportRequest,
  MonthlyIncomeAndExpenseReportResponse
} from 'src/api';

export const useReportStore = defineStore('report', {
  state: () => ({
    monthlyIncomeAndExpenseReports: [] as MonthlyIncomeAndExpenseReportInList[],
  }),
  actions: {
    resetMonthlyReport(): void {
      this.monthlyIncomeAndExpenseReports = []
    },
    async getMonthlyReportList(year: number, month: number): Promise<Array<MonthlyIncomeAndExpenseReportInList>> {
      const response = await api.getMonthlyIncomeAndExpenseList(year, month)
      this.monthlyIncomeAndExpenseReports = response
      return response
    },
    async getMonthlyReport(
      payload: MonthlyIncomeAndExpenseReportRequest
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      return api.getMonthlyIncomeAndExpense(payload);
    },
    async disableMonthlyReport(
      id: number
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      return await api.disableMonthlyIncomeAndExpense(id.toString());
    },
    async enableMonthlyReport(
      id: number
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      return await api.enableMonthlyIncomeAndExpense(id.toString());
    },
    async commentMonthlyReport(
      id: number,
      comment: string
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      return api.commentMonthlyIncomeAndExpense({ comment }, id.toString());
    },
    async deleteMonthlyReport(
      id: number
    ): Promise<void> {
      await api.deleteMonthlyIncomeAndExpense(id.toString());
    }
  },
});
