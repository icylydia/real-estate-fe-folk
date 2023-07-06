export const useBuilding = () => {
  const regularExpenseOptions: Array<string> = [
    '電気代',
    '水道料金',
    'ガス代',
    '点検費用',
    '清掃料',
  ];
  return {
    regularExpenseOptions,
  }
}
