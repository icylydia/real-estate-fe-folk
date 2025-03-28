import { defineStore } from 'pinia';
import { api } from 'boot/api';
import {
  ContractBase,
  EntrustContractBase,
  RentalContractBase,
} from 'src/api';
import type {
  RentalContractRenewRequest,
  EntrustContractInRequest,
  EntrustContractInResponse,
  EntrustContractManagementFeeBase,
  PaginationResponsePagination,
  RentalContractInRequest,
  RentalContractInResponse,
  RentalContractRegularIncome,
} from 'src/api';

export type RentalContractFormModel = Partial<
  RentalContractInResponse
>

export type EntrustContractFormModel = Partial<
  EntrustContractInResponse
>

const defaultRentalContractFormModel: RentalContractFormModel = {
  building: undefined,
  room: undefined,
  tenant: undefined,
  promptRemind: true,
  regularIncomes: [],
}

const defaultEntrustContractFormModel: EntrustContractFormModel = {
  building: undefined,
  owner: undefined,
  remittanceType: EntrustContractBase.RemittanceTypeEnum.Overseas,
  japanBank: undefined,
  overseasBank: undefined,
  managementFees: [],
}

export interface GetRentalContractListRequest {
  itemsPerPage?: number;
  page?: number;
  building?: string;
  room?: string;
  tenant?: string;
  status?: ContractBase.StatusEnum;
}

export interface GetEntrustContractListRequest {
  itemsPerPage?: number;
  page?: number;
  building?: string;
  owner?: string;
  status?: ContractBase.StatusEnum;
}


export const useContractStore = defineStore('contract', {
  state: () => ({
    rentalContractSearchParams: {} as GetRentalContractListRequest,
    rentalContractList: [] as RentalContractInResponse[],
    entrustContractSearchParams: {} as GetEntrustContractListRequest,
    entrustContractList: [] as EntrustContractInResponse[],
    rentalContractFormModel: {...defaultRentalContractFormModel},
    entrustContractFormModel: {...defaultEntrustContractFormModel},
  }),
  actions: {
    async getRentalContractList(payload: GetRentalContractListRequest) {
      const { itemsPerPage, page, building, room, tenant, status } = payload;
      const resp = await api.getRentalContracts(itemsPerPage, page, building, room, tenant, status?.toString());
      this.rentalContractList = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async createRentalContract(data: RentalContractInRequest) {
      return api.createRentalContract(data);
    },
    async getRentalContract(id: string) {
      this.rentalContractFormModel = await api.getRentalContract(id);
    },
    async updateRentalContract(id: string, data: RentalContractInRequest) {
      return api.updateRentalContract(data, id);
    },
    async deleteRentalContract(id: string) {
      return api.deleteRentalContract(id);
    },
    async activeRentalContract(id: string) {
      this.rentalContractFormModel = await api.updateRentalContractActive(id);
    },
    async preRenewRentalContract(id: string) {
      this.rentalContractFormModel = await api.updateRentalContractPreRenewal(id);
    },
    async preTerminateRentalContract(id: string) {
      this.rentalContractFormModel = await api.updateRentalContractPreTerminate(id);
    },
    async terminateRentalContract(id: string) {
      this.rentalContractFormModel = await api.updateRentalContractTerminate(id);
    },
    async promptRemindRentalContract(id: string) {
      return api.updateRentalContractPromptRenewal(id);
    },
    resetRentalContractFormModel() {
      this.rentalContractFormModel = {...defaultRentalContractFormModel};
    },
    async renewRentalContract(id: string, payload: RentalContractRenewRequest): Promise<RentalContractInResponse> {
      return api.renewRentalContract(payload, id)
    },
    async getEntrustContractList(payload: GetEntrustContractListRequest) {
      const { itemsPerPage, page, building, owner, status } = payload;
      const resp = await api.getEntrustContracts(itemsPerPage, page, building, owner, status?.toString());
      this.entrustContractList = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getEntrustContract(id: string) {
      this.entrustContractFormModel = await api.getEntrustContract(id);
    },
    async createEntrustContract(data: EntrustContractInRequest) {
      return api.createEntrustContract(data);
    },
    async updateEntrustContract(id: string, data: EntrustContractInRequest) {
      return api.updateEntrustContract(data, id);
    },
    async deleteEntrustContract(id: string) {
      return api.deleteEntrustContract(id);
    },
    async activeEntrustContract(id: string) {
      this.entrustContractFormModel = await  api.updateEntrustContractActive(id);
    },
    async terminateEntrustContract(id: string) {
      this.entrustContractFormModel = await  api.updateEntrustContractTerminate(id);
    },
    resetEntrustContractFormModel() {
      this.entrustContractFormModel = {...defaultEntrustContractFormModel};
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

    appendRegularIncome(income: RentalContractRegularIncome) {
      if (this.rentalContractFormModel.regularIncomes) {
        this.rentalContractFormModel.regularIncomes.push(income)
      } else {
        this.rentalContractFormModel.regularIncomes = [income]
      }
    },

    replaceRegularIncome(income: RentalContractRegularIncome) {
      if (this.rentalContractFormModel.regularIncomes) {
        const index = this.rentalContractFormModel.regularIncomes.findIndex(re => re.id === income.id)
        if (index !== -1) {
          this.rentalContractFormModel.regularIncomes[index] = income
        }
      }
    },

    removeRegularIncome(id: number) {
      if (this.rentalContractFormModel.regularIncomes) {
        this.rentalContractFormModel.regularIncomes = this.rentalContractFormModel.regularIncomes.filter(income => income.id !== id)
      }
    },

    appendManagementFee(managementFee: EntrustContractManagementFeeBase) {
      if (this.entrustContractFormModel.managementFees) {
        this.entrustContractFormModel.managementFees.push(managementFee)
      } else {
        this.entrustContractFormModel.managementFees = [managementFee]
      }
    },

    replaceManagementFee(managementFee: EntrustContractManagementFeeBase) {
      if (this.entrustContractFormModel.managementFees) {
        const index = this.entrustContractFormModel.managementFees.findIndex(re => re.id === managementFee.id)
        if (index !== -1) {
          this.entrustContractFormModel.managementFees[index] = managementFee
        }
      }
    },

    removeManagementFee(id: number) {
      if (this.entrustContractFormModel.managementFees) {
        this.entrustContractFormModel.managementFees = this.entrustContractFormModel.managementFees.filter(fee => fee.id !== id)
      }
    },
  }
});
