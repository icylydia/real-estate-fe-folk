import { defineStore } from 'pinia';
import { api } from 'boot/api';
import _ from 'lodash';
import {
  BuildingDetailResponse,
  BuildingInRequest,
  BuildingListResponseItems, BuildingOptionsResponse, FileBase,
  PaginationResponsePagination,
  RegularExpenseBase, RoomOptionsResponse
} from 'src/api';

export type BuildingFormModel = Partial<
  BuildingInRequest & BuildingDetailResponse
>

const defaultFormModel: BuildingFormModel = {
  address: {},
  accesses: [],
  regularExpenses: [],
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
    fileModel: {} as FileBase,
    buildingOptions: [] as BuildingOptionsResponse[],
    roomOptions: [] as RoomOptionsResponse[],
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
      this.fileModel = {} as FileBase;
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

    async getBuilding(id: string) {
      this.formModel = await api.getBuilding(id);
    },

    createBuilding(data: BuildingInRequest) {
      return api.createBuilding(data)
    },

    updateBuilding(id: string, data: BuildingInRequest) {
      return api.updateBuilding(data, id);
    },

    deleteBuilding(id: string) {
      return api.deleteBuilding(id);
    },

    resetBuildingOptions() {
      this.buildingOptions = [];
    },

    async getBuildingOptions() {
      const resp = await api.getBuildingOptions();
      this.buildingOptions = resp ?? [];
    },

    resetRoomOptions() {
      this.roomOptions = [];
    },

    async getRoomOptions(buildingId: string) {
      const resp = await api.getRoomOptions(buildingId);
      this.roomOptions = resp ?? [];
    },

    appendFile(file: FileBase) {
      if (this.formModel.files) {
        this.formModel.files.push(file)
      } else {
        this.formModel.files = [file]
      }
    },

    removeFile(id: string) {
      if (this.formModel.files) {
        this.formModel.files = this.formModel.files.filter(file => file.id !== id)
      }
    },
  },
});
