import { defineStore } from 'pinia';
import { EntrustContractManagementFeeBase } from 'src/api';
import _ from 'lodash';
import { api } from 'boot/api';
import { Optional } from 'src/utils/framework';

const defaultManagementFeeModel: EntrustContractManagementFeeBase = {
  benefitType: EntrustContractManagementFeeBase.BenefitTypeEnum.Percentage,
}

export const useManagementFeeStore = defineStore('managementFee', {
  state: () => ({
    model: defaultManagementFeeModel as EntrustContractManagementFeeBase,
  }),
  actions: {
    resetModel(model: Optional<EntrustContractManagementFeeBase> = undefined) {
      if (model === undefined) {
        model = defaultManagementFeeModel;
      }
      this.model = _.cloneDeep(model);
    },
    async createManagementFee(data: EntrustContractManagementFeeBase) {
      return await api.createManagementFee(data);
    },

    async updateManagementFee(id: string, data: EntrustContractManagementFeeBase) {
      return await api.updateManagementFee(data, id);
    },

    async deleteManagementFee(id: string) {
      return await api.deleteManagementFee(id);
    },
  },
});
