import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      jpyCurrency: (value: number) => string;
      percentage: (value: number) => string;
      dateTime: (value: string, precision?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year') => string;
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

const dateTime = (value: string, precision: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' = 'second') => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  switch (precision) {
    case 'second':
      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
    case 'minute':
      return `${year}年${month}月${day}日 ${hour}:${minute}`;
    case 'hour':
      return `${year}年${month}月${day}日 ${hour}`;
    case 'day':
      return `${year}年${month}月${day}日`;
    case 'month':
      return `${year}年${month}月`;
    case 'year':
      return `${year}年`;
    default:
      return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$filters = {
    jpyCurrency,
    percentage,
    dateTime,
  };
});
