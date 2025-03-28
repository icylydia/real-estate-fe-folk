import * as yup from 'yup';
import moment from 'moment';
import type { AnyMessageParams } from 'yup';

yup.addMethod(yup.string, 'phone', function () {
  return this
    .matches(
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
      '電話番号の形式が正しくありません。',
      );
});

yup.addMethod(yup.string, 'birthday', function () {
  return this
    .matches(
      /^(\d{8})|(\d{4}-\d{2}-\d{2})$/,
      '生年月日の形式が正しくありません。',
      );
});

yup.addMethod(yup.string, 'postalCode', function () {
  return this
    .matches(
      /^\d{3}-?\d{4}$/,
      '郵便番号の形式が正しくありません。',
      );
});

yup.addMethod(yup.string, 'date', function () {
  return this
    .matches(
      /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}$/,
      '日付の形式が正しくありません。',
      );
});

yup.addMethod(yup.string, 'yearMonth', function () {
  return this
    .matches(
      /^\d{4}[-/.]\d{1,2}$/,
      '年月の形式が正しくありません。',
      );
});

yup.addMethod(yup.string, 'laterThan', function (target) {
  return this.test({
    test: (value) => {
      const targetDate = moment(target);
      const valueDate = moment(value);
      return valueDate.isAfter(targetDate);
    },
    message: (params: AnyMessageParams) => {
      return `${params.path}は${target}より後の日付である必要があります。`;
    },
  })
})
