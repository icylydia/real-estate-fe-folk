import { ContractBase, EntrustContractManagementFeeBase } from 'src/api';

const benefitTypeOptions: Array<{ label: string, value: string }> = [
  {
    label: '定額',
    value: 'fixed',
  },
  {
    label: '割合',
    value: 'percentage',
  },
];

const benefitTypeToChipProps = (type?: EntrustContractManagementFeeBase.BenefitTypeEnum) => {
  if (!type) {
    return null;
  }
  switch (type) {
    case EntrustContractManagementFeeBase.BenefitTypeEnum.Fixed:
      return {
        label: '定額',
        color: 'pink',
      }
    case EntrustContractManagementFeeBase.BenefitTypeEnum.Percentage:
      return {
        label: '割合',
        color: 'light-blue',
      }
    default:
      return null;
  }
};

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
}

export const useEntrustContract = () => {
  return {
    benefitTypeOptions,
    benefitTypeToChipProps,
    describeStatus,
  };
}
