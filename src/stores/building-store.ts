import { defineStore } from 'pinia';
import { BuildingInRequest, BuildingInResponse } from 'src/api/building';
import { api } from 'boot/axios';
import { AddressInResponse } from 'src/api/address';

export type BuildingFormModel = Partial<BuildingInRequest & BuildingInResponse>

const defaultFormModel: BuildingFormModel = {
  address: {},
  accesses: [],
}

export const useBuildingStore = defineStore('building', {
  state: () => ({
    list: [] as BuildingInResponse[],
    formModel: defaultFormModel,
  }),
  actions: {
    reset() {
      this.list = [];
      this.formModel = defaultFormModel;
    },

    async getBuildingList(page = 1, itemsPerPage = 15) {
      this.reset();
      const resp = await api.building.list({
        page,
        itemsPerPage
      });
      this.list = resp.items || [];
    },

    async getBuildingDetail(id: number) {
      this.reset();
      this.formModel = await api.building.detail(id);
    },

    callCreateBuildingApi() {
      return api.building.create(this.formModel)
    },

    validatePostalCode() {
      const postalCode = this.formModel.address?.postalCode;
      if (!postalCode) {
        return false;
      }
      return postalCode.match(/^〒?[0-9]{3}-?[0-9]{4}$/) !== null;
    },

    async updateAddressFromPostalCode() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const postalCode = this.formModel.address!.postalCode!;
      const resp = await api.address.getAddressByPostalCode(postalCode);
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
    }
  },
});
