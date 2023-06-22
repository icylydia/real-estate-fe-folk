import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  ContractBase,
  EntrustContractBase,
  EntrustContractInResponse,
  RentalContractBase,
  RentalContractInResponse
} from 'src/api';

export const useContractStore = defineStore('contract', {
  state: () => ({
    rentalContractList: [] as RentalContractInResponse[],
    entrustContractList: [] as EntrustContractInResponse[],
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
            color: 'orange',
          };
        case ContractBase.StatusEnum.Active:
          return {
            label: '契約中',
            color: 'green',
          };
        case ContractBase.StatusEnum.ToBeFinished:
          return {
            label: '解約予定',
            color: 'blue',
          };
        case ContractBase.StatusEnum.Finished:
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
            color: 'primary',
          }
        case EntrustContractBase.BenefitTypeEnum.Percentage:
          return {
            label: '割合',
            color: 'primary',
          }
        default:
          return null;
      }
    },
  }
});
