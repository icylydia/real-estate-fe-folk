import _ from 'lodash';

export const usePayment = () => {
  const incomeCategoryOptions: Array<{
    label: string,
    value: string,
  }> = [
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
      label: 'クリーニング費用',
      value: 'cleaningFees2',
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
      label: '水道光熱費',
      value: 'utilityCharges',
    },
    {
      label: 'その他',
      value: 'otherIncome',
    },
  ];

  const managementFeeCategoryOptions: Array<{
    label: string,
    value: string,
  }> = incomeCategoryOptions.filter((option) => {
    return _.includes([
      'monthlyRent',
      'managementFees',
      'parkingFees',
      'bicycleParkingFees',
      'utilityCharges'
    ], option.value);
  });

  const expenseCategoryOptions: Array<{
    label: string,
    value: string,
  }> = [
    {
      label: '賃貸管理費用',
      value: 'propertyManagementFees',
    },
    {
      label: '建物管理費用',
      value: 'buildingManagementFees',
    },
    {
      label: '管理修繕積立金',
      value: 'managementRepairFees',
    },
    {
      label: '修繕金',
      value: 'repairFees',
    },
    {
      label: '振込手数料',
      value: 'transferHandlingFees',
    },
    {
      label: '低圧電気料金',
      value: 'lowVoltageElectricityCharges',
    },
    {
      label: '電気料金',
      value: 'electricityCharges',
    },
    {
      label: 'ガス代',
      value: 'gasCharges',
    },
    {
      label: '水道料金',
      value: 'waterCharges',
    },
    {
      label: '水道光熱費',
      value: 'utilityCharges',
    },
    {
      label: 'インターネット費用',
      value: 'internetExpenses',
    },
    {
      label: 'ケーブルテレビ',
      value: 'cableTVCharges',
    },
    {
      label: '精算金',
      value: 'adjustmentFees',
    },
    {
      label: '敷金返還',
      value: 'securityDepositRefund',
    },
    {
      label: '納税管理費',
      value: 'taxManagementFees',
    },
    {
      label: '業務委託料',
      value: 'outsourcingFees',
    },
    {
      label: '広告料',
      value: 'advertisingFees',
    },
    {
      label: '海外送金手数料',
      value: 'internationalTransferFees',
    },
    {
      label: '事務所使用料',
      value: 'officeUsageFees',
    },
    {
      label: '点検費用',
      value: 'inspectionFees',
    },
    {
      label: 'クリーニング費用',
      value: 'cleaningFees',
    },
    {
      label: '日常清掃費',
      value: 'dailyCleaningFees',
    },
    {
      label: '定期清掃費',
      value: 'periodicCleaningFees',
    },
    {
      label: '仲介手数料',
      value: 'brokerageCommission',
    },
    {
      label: '更新手数料',
      value: 'renewalCommission',
    },
    {
      label: '税金',
      value: 'tax',
    },
    {
      label: '共用部電気',
      value: 'commonAreaElectricityCharges',
    },
    {
      label: '共用部水道',
      value: 'commonAreaWaterCharges',
    },
    {
      label: 'その他',
      value: 'otherExpenses',
    },
  ];

  const confirmStatusOptions = [
    {
      label: '未確認',
      value: 'unconfirmed',
      color: 'warning',
    },
    {
      label: '確認済み',
      value: 'confirmed',
      color: 'positive',
    },
    {
      label: '却下',
      value: 'rejected',
      color: 'negative',
    },
  ];

  const paymentMethodOptions = [
    {
      label: '現金',
      value: 'cash',
    },
    {
      label: '口座引落',
      value: 'withDraw',
    },
    {
      label: '振込',
      value: 'transfer',
    },
    {
      label: '収納代行',
      value: 'agent',
    },
    {
      label: 'コンビニ',
      value: 'convenienceStore',
    },
    {
      label: 'クレジット',
      value: 'creditCard',
    },
    {
      label: 'その他',
      value: 'other',
    },
  ];

  const describeIncomeCategory = (value?: any): string => {
    if (!value) return '未知';
    const words: [string, string][] = incomeCategoryOptions.map((option) => {
      return [option.value, option.label]
    });
    const dictionary: Map<string, string> = new Map(words);
    return dictionary.get(value) || '未知';
  };
  const describeExpenseCategory = (value?: any): string => {
    if (!value) return '未知';
    const words: [string, string][] = expenseCategoryOptions.map((option) => {
      return [option.value, option.label]
    });

    const dictionary: Map<string, string> = new Map(words);
    return dictionary.get(value) || '未知';
  };
  const describeIncomeConfirmStatus = (value?: any): { description: string, color: string} => {
    switch (value) {
      case 'unconfirmed':
        return {
          description: '未確認',
          color: 'warning',
        };
      case 'confirmed':
        return {
          description: '確認済み',
          color: 'positive',
        };
      case 'rejected':
        return {
          description: '却下',
          color: 'negative',
        };
      default:
        return {
          description: '未知',
          color: 'brown',
        };
    }
  }
  return {
    incomeCategoryOptions,
    managementFeeCategoryOptions,
    expenseCategoryOptions,
    paymentMethodOptions,
    confirmStatusOptions,
    describeIncomeCategory,
    describeExpenseCategory,
    describeIncomeConfirmStatus,
  }
}
