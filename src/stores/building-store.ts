import { defineStore } from 'pinia';
import { api } from 'boot/api';
import _ from 'lodash';
import {
  AddressInResponse,
  BuildingDetailResponse,
  BuildingInRequest,
  BuildingInResponse,
  RegularExpenseBase
} from 'src/api';

export type BuildingFormModel = Partial<
  BuildingInRequest & BuildingDetailResponse
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
    list: [] as BuildingInResponse[],
    formModel: defaultFormModel,
    regularExpenseModel: {} as RegularExpenseBase,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = defaultFormModel;
    },

    resetRegularExpenseModel() {
      this.regularExpenseModel = {} as RegularExpenseBase;
    },

    async getBuildingList(params: GetBuildingListRequest) {
      this.reset();
      const defaultParams: GetBuildingListRequest = {
        itemsPerPage: 15,
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
    },

    async getBuildingDetail(id: string) {
      this.reset();
      this.formModel = await api.getBuilding(id);
    },

    callCreateBuildingApi() {
      return api.createBuilding(this.formModel)
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
