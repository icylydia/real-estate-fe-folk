export const useBuilding = () => {
  const buildingTypeOptions: Array<{ label: string, value: string }> = [
    {
      label: '一戸建',
      value: 'detachedHouse',
    },
    {
      label: '一棟もの',
      value: 'building',
    },
    {
      label: '区分',
      value: 'division',
    },
  ];
  const buildingStructureOptions: Array<{ label: string, value: string }> = [
    {
      label: '木造(W)',
      value: 'wood',
    },
    {
      label: '鉄骨造(S)',
      value: 'steel',
    },
    {
      label: '鉄筋コンクリート造(RC)',
      value: 'reinforcedConcrete',
    },
    {
      label: '鉄筋鉄骨コンクリート造(SRC)',
      value: 'steelReinforcedConcrete',
    },
  ];
  const landRightsOptions: Array<{ label: string, value: string }> = [
    {
      label: '所有権',
      value: 'freehold',
    },
    {
      label: '借地権',
      value: 'leasehold',
    }
  ];
  const landUseZoneOptions: Array<{ label: string, value: string }> = [
    {
      label: '第一種低層住居専用地域',
      value: 'lowRiseResidential1',
    },
    {
      label: '第二種低層住居専用地域',
      value: 'lowRiseResidential2',
    },
    {
      label: '第一種中高層住居専用地域',
      value: 'mediumHighRiseResidential1',
    },
    {
      label: '第二種中高層住居専用地域',
      value: 'mediumHighRiseResidential2',
    },
    {
      label: '第一種住居地域',
      value: 'residential1',
    },
    {
      label: '第二種住居地域',
      value: 'residential2',
    },
    {
      label: '準住居地域',
      value: 'quasiResidential',
    },
    {
      label: '田園住居地域',
      value: 'ruralResidential',
    },
    {
      label: '近隣商業地域',
      value: 'neighborhoodCommercial',
    },
    {
      label: '商業地域',
      value: 'commercial',
    },
    {
      label: '準工業地域',
      value: 'quasiIndustrial',
    },
    {
      label: '工業地域',
      value: 'industrial',
    },
  ];
  const regularExpenseOptions: Array<string> = [
    '修繕積立金',
    '管理費',
    '固定資産税',
    '都市計画税',
    'PM(賃貸管理)費用',
    'BM(建物管理)費用',
    '水道代',
    '電気代',
    'ガス代',
    'インターネット費用',
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
    buildingTypeOptions,
    buildingStructureOptions,
    landRightsOptions,
    landUseZoneOptions,
    regularExpenseOptions,
    fileCategoryOptions,
  }
}
