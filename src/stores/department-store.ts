import { defineStore } from 'pinia';
import { DepartmentInResponse } from 'src/api';
import { api } from 'boot/api';
import _ from 'lodash';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    list: [] as DepartmentInResponse[],
  }),
  actions: {
    reset() {
      this.list = [];
    },
    async getDepartmentList() {
      this.reset();
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
    }
  },
});
