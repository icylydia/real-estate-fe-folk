import { Optional } from 'src/utils/framework';

declare module 'vue' {
  interface ComponentCustomProperties {
    $filters: {
      jpyCurrency: (value: Optional<number>) => string;
      percentage: (value: Optional<number>) => string;
      dateTime: (value: string, precision?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year') => string;
      highlight: (value: string, keyword: string | undefined) => string;
    }
  }
}
