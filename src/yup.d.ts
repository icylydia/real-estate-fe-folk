import * as yup from 'yup';
import { AnyObject, Flags, Maybe } from 'yup';

declare module 'yup' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends Flags = ''
  > extends yup.StringSchema<TType, TContext, TDefault, TFlags> {
    phone(): StringSchema;
    birthday(): StringSchema;
    postalCode(): StringSchema;
  }
}
