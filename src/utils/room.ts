import { RoomInResponse } from "src/api";

export const useRoom = () => {
  const fileCategoryOptions:  { label: string, value: string }[] = [
    {
      label: '売買契約',
      value: 'contract',
    },
    {
      label: '資産管理・物件管理',
      value: 'propertyManagement',
    },
    {
      label: '賃貸借管理',
      value: 'rentalManagement',
    },
    {
      label: '保険',
      value: 'insurance',
    },
    {
      label: '税務',
      value: 'tax',
    },
    {
      label: 'ローン・融資',
      value: 'loan',
    },
    {
      label: '工事関係',
      value: 'construction',
    },
    {
      label: 'その他',
      value: 'other',
    },
  ];
  const contractStatusToChipProps = (status?: RoomInResponse.ContractStatusEnum) => {
    switch (status) {
      case RoomInResponse.ContractStatusEnum.Signed:
        return {
          label: '契約済み',
          color: 'blue',
        }
      case RoomInResponse.ContractStatusEnum.Empty:
        return {
          label: '空室',
          color: 'green',
        }
      default:
        return {
          label: '不明',
          color: 'grey',
        }
    }
  }
  return {
    fileCategoryOptions,
    contractStatusToChipProps,
  }
}
