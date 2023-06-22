export const useGender = () => {
  const selectOptions: { label: string, value: string }[] = [
    {
      label: '男性',
      value: 'male',
    },
    {
      label: '女性',
      value: 'female',
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
