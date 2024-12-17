import { defineStore } from 'pinia';
import type { DepartmentDetailResponse, DepartmentInRequest, DepartmentInResponse } from 'src/api';
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
    async updateDepartment(id: string, data: DepartmentInRequest) {
      return await api.updateDepartment(data, id);
    },
    async deleteDepartment(id: string) {
      return await api.deleteDepartment(id);
    },
  },
  getters: {
    flatteredDepartmentList: (state) => {
      const result: DepartmentInResponse[] = [];
      const flatten = (department: DepartmentInResponse) => {
        result.push(_.omit(department, ['subDepartments']));
        department.subDepartments?.forEach(flatten);
      }
      state.list.forEach(flatten);
      if (state.formModel.id) {
        _.remove(result, { id: state.formModel.id });
      }
      return result;
    },
  }
});
