import * as yup from 'yup';
import { AnyObject, Flags, Maybe } from 'yup';

declare module 'yup' {
  // @ts-ignore
  interface StringSchema<
    TType extends Maybe<string> = string | undefined,
    TContext = AnyObject,
    TDefault = undefined,
    TFlags extends Flags = ''
  > extends yup.StringSchema<TType, TContext, TDefault, TFlags> {
    phone(): StringSchema;
    birthday(): StringSchema;
  }
}
