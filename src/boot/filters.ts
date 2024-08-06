import { boot } from 'quasar/wrappers';
import moment from 'moment';
import { Optional } from 'src/utils/framework';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      jpyCurrency: (value: Optional<number>) => string;
      percentage: (value: Optional<number>) => string;
      dateTime: (value: string, precision?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year') => string;
      highlight: (value: string, keyword: string | undefined) => string;
    }
  }
}

const jpyCurrency = (value: Optional<number>): string => {
  if (value === undefined) {
    return '';
  } else {
    return (new Intl.NumberFormat('ja-JP', {
      currency: 'JPY',
      notation: 'compact',
      maximumFractionDigits: 2,
    })).format(value);
  }
}

const percentage = (value: Optional<number>) => {
  if (value === undefined) {
    return '';
  } else {
    const num = Number(value);
    return `${num.toFixed(2)}%`;
  }
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

const highlight = (value: string, keyword: string | undefined) => {
  if (!keyword) {
    return value;
  }
  return value.replace(new RegExp(`(${keyword})`, 'gi'), '<mark>$1</mark>');
}

export default boot(({ app }) => {
  app.config.globalProperties.$filters = {
    jpyCurrency,
    percentage,
    dateTime,
    highlight,
  };
});
