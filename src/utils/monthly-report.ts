export const useMonthlyReport = () => {
  const fileCategoryOptions: { label: string, value: string }[] = [
    {
      label: '月次報告書',
      value: 'monthlyReport',
    },
    {
      label: '領収書',
      value: 'receipt',
    },
    {
      label: '請求書',
      value: 'bill',
    },
    {
      label: '見積書',
      value: 'estimate',
    },
    {
      label: '収入明細',
      value: 'incomeDetail',
    },
    {
      label: '清掃報告',
      value: 'cleaningReport',
    },
    {
      label: '点検報告',
      value: 'inspectionReport',
    },
    {
      label: '作業報告',
      value: 'workReport',
    },
    {
      label: 'その他',
      value: 'other',
    },
  ];
  return { fileCategoryOptions };
}
