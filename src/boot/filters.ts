import { boot } from 'quasar/wrappers';
import moment from 'moment';

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
  const getFormatByPrecision = (precision: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year') => {
    switch (precision) {
      case 'second':
        return 'YYYY-MM-DD HH:mm:ss';
      case 'minute':
        return 'YYYY-MM-DD HH:mm';
      case 'hour':
        return 'YYYY-MM-DD HH';
      case 'day':
        return 'YYYY-MM-DD';
      case 'month':
        return 'YYYY-MM';
      case 'year':
        return 'YYYY';
    }
  }

  const format = getFormatByPrecision(precision);
  return moment(value).format(format);
}

export default boot(({ app }) => {
  app.config.globalProperties.$filters = {
    jpyCurrency,
    percentage,
    dateTime,
  };
});
