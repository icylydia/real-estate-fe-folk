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
}
export const useRentalContract = () => {
  return {
    describeStatus,
  };
};
