import { defineStore } from 'pinia';
import { api } from 'boot/api';
import { ContractBase, RentalContractInResponse } from 'src/api';

export const useContractStore = defineStore('contract', {
  state: () => ({
    rentalContractList: [] as RentalContractInResponse[],
  }),
  actions: {
    async getRentalContractList() {
      const resp = await api.getRentalContracts();
      this.rentalContractList = resp.items || [];
    },
    reset() {
      this.rentalContractList = [];
    },
    statusToChipProps(status?: ContractBase.StatusEnum) {
      if (!status) {
        return {
          label: '不明',
          color: 'grey',
        };
      }
      switch (status) {
        case ContractBase.StatusEnum.Draft:
          return {
            label: '下書き',
            color: 'grey',
          };
        case ContractBase.StatusEnum.BeforeStart:
          return {
            label: '実行待ち',
            color: 'orange',
          };
        case ContractBase.StatusEnum.Active:
          return {
            label: '実行中',
            color: 'green',
          };
        case ContractBase.StatusEnum.Completed:
          return {
            label: '完了済み',
            color: 'blue',
          };
        case ContractBase.StatusEnum.Canceled:
          return {
            label: 'キャンセル済み',
            color: 'red',
          };
        default:
          return {
            label: '不明',
            color: 'grey',
          };
      }
    },
  }
});
