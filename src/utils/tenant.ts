export const useTenant = () => {
  const guarantorCompanyStatusOptions: { label: string, value: string }[] = [
    {
      label: 'なし',
      value: 'none',
    },
    {
      label: '審査待ち',
      value: 'pending',
    },
    {
      label: '加入済',
      value: 'joined',
    },
    {
      label: '審査拒否',
      value: 'rejected',
    },
  ];
  const describeGuarantorCompanyStatus = (value?: any): string => {
    const target = guarantorCompanyStatusOptions.find(option => option.value === value);
    return target ? target.label : '未知';
  }
  const guarantorCompanyOptions: Array<string> = [
    '日本賃貸保証',
    'SBIギャランティ',
    'レジデンシャルパートナーズ',
    'ニッポンインシュア',
    '日本賃貸住宅保証機構',
  ];
  return {
    guarantorCompanyStatusOptions,
    describeGuarantorCompanyStatus,
    guarantorCompanyOptions,
  }
}
