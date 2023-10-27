import { defineStore } from 'pinia';
import { api } from 'boot/api';
import _ from 'lodash';
import {
  AddressInResponse,
  BuildingDetailResponse,
  BuildingInRequest,
  BuildingListResponseItems,
  ModelFile,
  PaginationResponsePagination,
  RegularExpenseBase
} from 'src/api';

export type BuildingFormModel = Partial<
  BuildingInRequest & BuildingDetailResponse
>

export type FileModel = Partial<
  ModelFile & {
    file: File;
  }
>

const defaultFormModel: BuildingFormModel = {
  address: {},
  accesses: [],
}

interface GetBuildingListRequest {
  itemsPerPage?: number;
  page?: number;
  name?: string;
  location?: string;
}

export const useBuildingStore = defineStore('building', {
  state: () => ({
    searchParams: {} as GetBuildingListRequest,
    list: [] as BuildingListResponseItems[],
    formModel: defaultFormModel,
    regularExpenseModel: {} as RegularExpenseBase,
    fileModel: {} as FileModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = defaultFormModel;
    },

    resetFormModel() {
      this.formModel = defaultFormModel;
    },

    resetRegularExpenseModel() {
      this.regularExpenseModel = {} as RegularExpenseBase;
    },

    resetFileModel() {
      this.fileModel = {} as FileModel;
    },

    async getBuildingList(params: GetBuildingListRequest): Promise<PaginationResponsePagination> {
      const defaultParams: GetBuildingListRequest = {
        itemsPerPage: 10,
        page: 1,
      }
      const query = _.defaults(params, defaultParams)
      const resp = await api.getBuildings(
        query.itemsPerPage,
        query.page,
        query.name,
        query.location,
      );
      this.list = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },

    async getBuildingDetail(id: string) {
      this.reset();
      this.formModel = await api.getBuilding(id);
    },

    createBuilding() {
      return api.createBuilding(this.formModel)
    },

    updateBuilding(id: string, data: BuildingInRequest) {
      return api.updateBuilding(data, id);
    },

    deleteBuilding(id: string) {
      return api.deleteBuilding(id);
    },

    validatePostalCode() {
      const postalCode = this.formModel.address?.postalCode;
      if (!postalCode) {
        return false;
      }
      return RegExp(/^\d{3}-\d{4}$/).exec(postalCode) !== null;
    },

    async updateAddressFromPostalCode() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const postalCode = this.formModel.address!.postalCode!;
      const resp = await api.getAddressByPostalCode(postalCode);
      this.setAddressExceptPostalCode(resp)
    },

    setAddressExceptPostalCode(address: AddressInResponse) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        postalCode,
        ...addressExceptPostalCode
      } = address;
      const originalPostalCode = this.formModel.address?.postalCode;
      this.formModel.address = {
        postalCode: originalPostalCode,
        ...addressExceptPostalCode,
      }
    },
  },
});
