import { defineStore } from 'pinia';
import { api } from 'boot/api';
import _ from 'lodash';
import {
  BuildingDetailResponse,
  BuildingInRequest,
  BuildingListResponseItems, BuildingOptionsResponse,
  ModelFile,
  PaginationResponsePagination,
  RegularExpenseBase, RoomOptionsResponse
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

    async getBuilding(id: string) {
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
  },
});
