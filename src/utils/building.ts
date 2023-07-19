export const useBuilding = () => {
  const regularExpenseOptions: Array<string> = [
    '修繕積立金',
    'PM(賃貸管理)費用',
    'BM(建物管理)費用',
    '水道代',
    '電気代',
    'ガス代',
    '広告費',
    'インターネット費用',
    '仲介手数料',
  ];
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
  return {
    regularExpenseOptions,
    fileCategoryOptions,
  }
}
