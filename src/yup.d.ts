import type * as yup from 'yup';
import type { AnyObject, Flags, Maybe } from 'yup';

declare module 'yup' {
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends Flags = ''
  > extends yup.StringSchema<TType, TContext, TDefault, TFlags> {
    phone(): StringSchema;
    birthday(): StringSchema;
    postalCode(): StringSchema;
    date(): StringSchema;
    yearMonth(): StringSchema;
  }
}
