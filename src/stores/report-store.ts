import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { MonthlyIncomeAndExpenseReportRequest, MonthlyIncomeAndExpenseReportResponse } from 'src/api';

export const useReportStore = defineStore('report', {
  state: () => ({
    monthlyIncomeAndExpenseReports: [] as MonthlyIncomeAndExpenseReportResponse[],
  }),
  actions: {
    resetMonthlyReport(): void {
      this.monthlyIncomeAndExpenseReports = []
    },
    async getMonthlyReport(
      payload: MonthlyIncomeAndExpenseReportRequest
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      const response = await api.getMonthlyIncomeAndExpense(payload);
      this.monthlyIncomeAndExpenseReports = [response]
      return response
    },
    async disableMonthlyReport(
      id: number
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      const response = await api.disableMonthlyIncomeAndExpense(id.toString());
      this.monthlyIncomeAndExpenseReports = [response]
      return response
    },
    async enableMonthlyReport(
      id: number
    ): Promise<MonthlyIncomeAndExpenseReportResponse> {
      const response = await api.enableMonthlyIncomeAndExpense(id.toString());
      this.monthlyIncomeAndExpenseReports = [response]
      return response
    },
    async deleteMonthlyReport(
      id: number
    ): Promise<void> {
      await api.deleteMonthlyIncomeAndExpense(id.toString());
      this.monthlyIncomeAndExpenseReports = []
    }
  },
});
