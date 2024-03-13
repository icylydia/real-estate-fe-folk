import { ContractBase } from 'src/api';

const describeStatus = (status?: ContractBase.StatusEnum ): { description: string, color: string } => {
  switch (status) {
    case ContractBase.StatusEnum.BeforeStart:
      return {
        description: '契約予定',
        color: 'lime-7',
      };
    case ContractBase.StatusEnum.Active:
      return {
        description: '契約中',
        color: 'blue',
      };
    case ContractBase.StatusEnum.ToBeRenewed:
      return {
        description: '再契約予定',
        color: 'amber',
      }
    case ContractBase.StatusEnum.ToBeTerminated:
      return {
        description: '解約予定',
        color: 'green',
      };
    case ContractBase.StatusEnum.Terminated:
      return {
        description: '解約済み',
        color: 'red',
      };
    default:
      return {
        description: '不明',
        color: 'grey',
      };
  }
};

const regularIncomeCategoryOptions: { label: string, value: string }[] = [
  {
    label: '月額賃料',
    value: 'monthlyRent',
  },
  {
    label: '管理共益費',
    value: 'managementFees',
  },
  {
    label: '礼金',
    value: 'keyMoney',
  },
  {
    label: '敷金',
    value: 'securityDeposit',
  },
  {
    label: '保証金',
    value: 'guaranteeDeposit',
  },
  {
    label: '更新料',
    value: 'renewalFees',
  },
  {
    label: '精算金',
    value: 'adjustmentFees',
  },
  {
    label: '駐車料',
    value: 'parkingFees',
  },
  {
    label: '駐輪料金',
    value: 'bicycleParkingFees',
  },
  {
    label: '清掃料金',
    value: 'cleaningFees',
  },
  {
    label: '電気料金',
    value: 'electricityCharges',
  },
  {
    label: '水道料金',
    value: 'waterCharges',
  },
  {
    label: 'ガス代',
    value: 'gasCharges',
  },
  {
    label: 'その他',
    value: 'otherIncome',
  },
];

export const useRentalContract = () => {
  return {
    describeStatus,
    regularIncomeCategoryOptions,
  };
};
