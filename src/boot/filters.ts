import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      jpyCurrency: (value: number) => string;
      percentage: (value: number) => string;
    }
  }
}

const jpyCurrency = (value: number) => new Intl.NumberFormat('ja-JP', {
  currency: 'JPY',
  notation: 'compact',
  maximumFractionDigits: 2,
}).format(value);

const percentage = (value: number) => {
  const num = Number(value) * 100;
  return `${num.toFixed(2)}%`;
};

export default boot(({ app }) => {
  app.config.globalProperties.$filters = {
    jpyCurrency,
    percentage,
  };
});
