import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  ContractBase,
  EntrustContractBase,
  EntrustContractInResponse,
  RentalContractBase,
  RentalContractInResponse
} from 'src/api';

export type RentalContractFormModel = Partial<
  RentalContractInResponse
>

const defaultRentalContractFormModel: RentalContractFormModel = {
  building: {},
  room: {},
  tenant: {},
}

export const useContractStore = defineStore('contract', {
  state: () => ({
    rentalContractList: [] as RentalContractInResponse[],
    entrustContractList: [] as EntrustContractInResponse[],
    rentalContractFormModel: defaultRentalContractFormModel,
  }),
  actions: {
    async getRentalContractList() {
      const resp = await api.getRentalContracts();
      this.rentalContractList = resp.items ?? [];
    },
    async getEntrustContractList() {
      const resp = await api.getEntrustContracts();
      this.entrustContractList = resp.items ?? [];
    },
    reset() {
      this.rentalContractList = [];
      this.entrustContractList = [];
    },
    resetRentalContractFormModel() {
      this.rentalContractFormModel = defaultRentalContractFormModel;
    },
    statusToChipProps(status?: ContractBase.StatusEnum) {
      if (!status) {
        return {
          label: '不明',
          color: 'grey',
        };
      }
      switch (status) {
        case ContractBase.StatusEnum.BeforeStart:
          return {
            label: '契約予定',
            color: 'lime-7',
          };
        case ContractBase.StatusEnum.Active:
          return {
            label: '契約中',
            color: 'blue',
          };
        case ContractBase.StatusEnum.ToBeRenewed:
          return {
            label: '再契約予定',
            color: 'amber',
          }
        case ContractBase.StatusEnum.ToBeTerminated:
          return {
            label: '解約予定',
            color: 'green',
          };
        case ContractBase.StatusEnum.Terminated:
          return {
            label: '解約済み',
            color: 'red',
          };
        default:
          return {
            label: '不明',
            color: 'grey',
          };
      }
    },
    promptRemindStatusToChipProps(status?: RentalContractBase.PromptRemindStatusEnum) {
      if (!status) {
        return null;
      }
      switch (status) {
        case RentalContractBase.PromptRemindStatusEnum.BeforeStart:
          return null;
        case RentalContractBase.PromptRemindStatusEnum.Active:
          return {
            label: '要通知',
            color: 'red',
          };
        case RentalContractBase.PromptRemindStatusEnum.Completed:
          return {
            label: '通知済み',
            color: 'green',
          };
        default:
          return null;
      }
    },
    benefitTypeToChipProps(type?: EntrustContractBase.BenefitTypeEnum) {
      if (!type) {
        return null;
      }
      switch (type) {
        case EntrustContractBase.BenefitTypeEnum.Fixed:
          return {
            label: '定額',
            color: 'pink',
          }
        case EntrustContractBase.BenefitTypeEnum.Percentage:
          return {
            label: '割合',
            color: 'light-blue',
          }
        default:
          return null;
      }
    },
  }
});
