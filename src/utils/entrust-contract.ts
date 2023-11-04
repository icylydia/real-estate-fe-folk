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

export const useEntrustContract = () => {
  return {
    benefitTypeOptions,
  };
}
