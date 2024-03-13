import _ from 'lodash';

export const usePayment = () => {
  const categoryOptions = [
    {
      label: '月額賃料',
      value: 'monthlyRent',
    },
    {
      label: '敷金',
      value: 'securityDeposit',
    },
    {
      label: '礼金',
      value: 'keyMoney',
    },
    {
      label: '清掃料金',
      value: 'cleaningFee',
    },
    {
      label: 'オーナー収益',
      value: 'ownerBenefits',
    },
    {
      label: '敷金返還',
      value: 'securityDepositRefund',
    },
    {
      label: '管理共益費',
      value: 'maintenanceFee',
    },
    {
      label: '駐車料金',
      value: 'parkingFee',
    },
    {
      label: '更新料',
      value: 'renewalFee',
    },
    {
      label: '管理料',
      value: 'managementFee',
    },
    {
      label: '振込手数料',
      value: 'transactionFee',
    },
    {
      label: '低圧電気料金',
      value: 'lowVoltageFee',
    },
    {
      label: '電気料金',
      value: 'electricityFee',
    },
    {
      label: 'ガス代',
      value: 'gasFee',
    },
    {
      label: '水道料金',
      value: 'waterFee',
    },
    {
      label: '管理修繕金',
      value: 'repairFund',
    },
    {
      label: 'その他',
      value: 'other',
    },
  ];
  const incomeCategoryOptions = _.filter(categoryOptions, (option) => {
    return [
      'monthlyRent',
      'securityDeposit',
      'keyMoney',
      'cleaningFee',
      'maintenanceFee',
      'parkingFee',
      'renewalFee',
      'other',
    ].includes(option.value);
  });
  const expenseCategoryOptions = _.filter(categoryOptions, (option) => {
    return [
      'cleaningFee',
      'ownerBenefits',
      'securityDepositRefund',
      'managementFee',
      'transactionFee',
      'lowVoltageFee',
      'electricityFee',
      'gasFee',
      'waterFee',
      'repairFund',
      'other'
    ].includes(option.value);
  });

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
  const describeCategory = (value?: any): string => {
    const target = categoryOptions.find(option => option.value === value);
    return target ? target.label : '未知';
  };
  const describeIncomeCategory = (value?: any): string => {
    if (!value) return '未知';
    const dictionary: Map<string, string> = new Map([
      ['monthlyRent', '月額賃料'],
      ['managementFees', '管理共益費'],
      ['keyMoney', '礼金'],
      ['securityDeposit', '敷金'],
      ['guaranteeDeposit', '保証金'],
      ['renewalFees', '更新料'],
      ['adjustmentFees', '精算金'],
      ['parkingFees', '駐車料'],
      ['bicycleParkingFees', '駐輪料金'],
      ['cleaningFees', '清掃料金'],
      ['electricityCharges', '電気料金'],
      ['waterCharges', '水道料金'],
      ['gasCharges', 'ガス代'],
      ['other', 'その他'],
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
      ['other', 'その他'],
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
    categoryOptions,
    incomeCategoryOptions,
    expenseCategoryOptions,
    paymentMethodOptions,
    confirmStatusOptions,
    describeCategory,
    describeIncomeCategory,
    describeExpenseCategory,
    describeIncomeConfirmStatus,
  }
}
