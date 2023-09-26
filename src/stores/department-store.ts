import { defineStore } from 'pinia';
import { DepartmentDetailResponse, DepartmentInRequest, DepartmentInResponse } from 'src/api';
import { api } from 'boot/api';
import _ from 'lodash';

export type DepartmentFormModel = Partial<
  DepartmentInRequest & DepartmentInResponse & DepartmentDetailResponse
>

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    list: [] as DepartmentInResponse[],
    formModel: {} as DepartmentFormModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = {};
    },
    async getDepartmentList() {
      this.list = await api.getDepartments();
    },
    getFlattenedDepartmentList() {
      const result: DepartmentInResponse[] = [];
      const flatten = (department: DepartmentInResponse) => {
        result.push(_.omit(department, ['subDepartments']));
        department.subDepartments?.forEach(flatten);
      }
      this.list.forEach(flatten);
      return result;
    },
    async getDepartment(id: string) {
      this.formModel = await api.getDepartment(id);
    },
    async createDepartment(data: DepartmentInRequest) {
      return await api.createDepartment(data);
    },
  },
});
