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
  return {
    regularExpenseOptions,
  }
}
