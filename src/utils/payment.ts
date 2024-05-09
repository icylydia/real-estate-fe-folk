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
      label: '水道光熱費',
      value: 'utilityCharges',
    },
    {
      label: 'その他',
      value: 'otherIncome',
    },
  ];

  const expenseCategoryOptions: Array<{
    label: string,
    value: string,
  }> = [
    {
      label: 'PM費用',
      value: 'propertyManagementFees',
    },
    {
      label: 'BM費用',
      value: 'buildingManagementFees',
    },
    {
      label: '管理修繕金',
      value: 'managementRepairFees',
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
      label: 'インターネット費用',
      value: 'internetExpenses',
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
    const dictionary: Map<string, string> = new Map([
      ['monthlyRent', '月額賃料'],
      ['managementFees', '管理共益費'],
      ['keyMoney', '礼金'],
      ['securityDeposit', '敷金'],
      ['guaranteeDeposit', '保証金'],
      ['renewalFees', '更新料'],
      ['parkingFees', '駐車料'],
      ['bicycleParkingFees', '駐輪料金'],
      ['cleaningFees', '清掃料金'],
      ['electricityCharges', '電気料金'],
      ['waterCharges', '水道料金'],
      ['gasCharges', 'ガス代'],
      ['utilityCharges', '水道光熱費'],
      ['otherIncome', 'その他'],
    ]);
    return dictionary.get(value) || '未知';
  };
  const describeExpenseCategory = (value?: any): string => {
    if (!value) return '未知';
    const dictionary: Map<string, string> = new Map([
      ['propertyManagementFees', 'PM費用'],
      ['buildingManagementFees', 'BM費用'],
      ['managementRepairFees', '管理修繕金'],
      ['transferHandlingFees', '振込手数料'],
      ['lowVoltageElectricityCharges', '低圧電気料金'],
      ['electricityCharges', '電気料金'],
      ['gasCharges', 'ガス代'],
      ['waterCharges', '水道料金'],
      ['internetExpenses', 'インターネット費用'],
      ['adjustmentFees', '精算金'],
      ['securityDepositRefund', '敷金返還'],
      ['otherExpenses', 'その他'],
    ]);
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
    expenseCategoryOptions,
    paymentMethodOptions,
    confirmStatusOptions,
    describeIncomeCategory,
    describeExpenseCategory,
    describeIncomeConfirmStatus,
  }
}
