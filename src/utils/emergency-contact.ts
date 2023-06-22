export const useEmergencyContact = () => {
  const selectOptions: { label: string, value: string }[] = [
    {
      label: '配偶者',
      value: 'spouse',
    },
    {
      label: '家族',
      value: 'family',
    },
    {
      label: '友人',
      value: 'friend',
    },
    {
      label: 'その他',
      value: 'other',
    },
  ];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const describe = (value?: any): string => {
    const target = selectOptions.find(option => option.value === value);
    return target ? target.label : '未知';
  }
  return {
    selectOptions,
    describe,
  }
}
