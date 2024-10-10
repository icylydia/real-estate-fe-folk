import { RoomInResponse } from 'src/api';

export const useRoom = () => {
  const roomLayoutUnitOptions: { label: string, value: string }[] = [
    {
      label: 'R',
      value: 'R',
    },
    {
      label: 'K',
      value: 'K',
    },
    {
      label: 'DK',
      value: 'DK',
    },
    {
      label: 'LDK',
      value: 'LDK',
    },
    {
      label: '店舗',
      value: 'SHOP',
    },
    {
      label: '事務所',
      value: 'OFFICE',
    },
  ];
  const fileCategoryOptions:  { label: string, value: string }[] = [
    {
      label: '契約書類',
      value: 'contract',
    },
    {
      label: '申込書',
      value: 'applicationForm',
    },
    {
      label: '保険関係',
      value: 'insurance',
    },
    {
      label: '工事修繕',
      value: 'construction',
    },
    {
      label: '税務関係',
      value: 'tax',
    },
    {
      label: '点検報告',
      value: 'inspectionReport',
    },
    {
      label: '作業報告',
      value: 'workReport',
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
          label: '契約中',
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
  };
  const describeRoomLayoutUnit = (unit: any): string => {
    if (!unit) return '';
    const dictionary: Map<string, string> = new Map([
      ['R', 'R'],
      ['K', 'K'],
      ['DK', 'DK'],
      ['LDK', 'LDK'],
      ['SHOP', '店舗'],
      ['OFFICE', '事務所'],
    ]);
    return dictionary.get(unit) || '未知';
  };
  return {
    roomLayoutUnitOptions,
    fileCategoryOptions,
    contractStatusToChipProps,
    describeRoomLayoutUnit,
  }
}
