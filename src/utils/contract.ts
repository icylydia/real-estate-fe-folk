export const useContract = () => {
  const statusOptions: Array<{
    label: string,
    value: string,
  }> = [
    {
      label: '契約予定',
      value: 'beforeStart',
    },
    {
      label: '契約中',
      value: 'active',
    },
    {
      label: '再契約予定',
      value: 'toBeRenewed',
    },
    {
      label: '解約予定',
      value: 'toBeTerminated',
    },
    {
      label: '解約済み',
      value: 'terminated',
    },
  ];

  return {
    statusOptions,
  };
}
