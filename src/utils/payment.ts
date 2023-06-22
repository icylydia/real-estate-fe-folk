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
      label: 'その他',
      value: 'other',
    },
  ];
  const incomeCategoryOptions = _.filter(categoryOptions, (option) => {
    return ['monthlyRent', 'securityDeposit', 'keyMoney', 'cleaningFee', 'other'].includes(option.value);
  });
  const expenseCategoryOptions = _.filter(categoryOptions, (option) => {
    return ['cleaningFee', 'ownerBenefits', 'securityDepositRefund', 'other'].includes(option.value);
  });

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
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const describeCategory = (value?: any): string => {
    const target = categoryOptions.find(option => option.value === value);
    return target ? target.label : '未知';
  }
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const describeIncomeConfirmStatus = (value?: any): string => {
    switch (value) {
      case 'unconfirmed':
        return '未確認';
      case 'confirmed':
        return '確認済み';
      case 'rejected':
        return '却下';
      default:
        return '未知';
    }
  }
  return {
    categoryOptions,
    incomeCategoryOptions,
    expenseCategoryOptions,
    paymentMethodOptions,
    describeCategory,
    describeIncomeConfirmStatus,
  }
}
