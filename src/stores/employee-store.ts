import { defineStore } from 'pinia';
import { EmployeeInRequest, EmployeeInResponse } from 'src/api';
import { api } from 'boot/api';

export type EmployeeModel = Partial<
  EmployeeInResponse & EmployeeInRequest
>

export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    list: [] as EmployeeInResponse[],
    formModel: {} as EmployeeModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = {} as EmployeeModel;
    },
    async getEmployeeList() {
      this.list = await api.getEmployees();
    },
    async getEmployeeDetail(id: string) {
      this.formModel = await api.getEmployee(id);
    },
    async createEmployee(data: EmployeeModel) {
      return await api.createEmployee(data);
    },
  }
});
