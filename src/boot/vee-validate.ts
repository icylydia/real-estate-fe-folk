import { boot } from 'quasar/wrappers'
import { setLocale } from 'yup'
import { suggestive } from 'yup-locale-ja'
import _ from 'lodash';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// noinspection JSUnusedGlobalSymbols
export default boot(async (/* { app, router, ... } */) => {
  let locale = {
    ...suggestive,
  }
  locale = _.merge(locale, {
    mixed: {
      notType: ({ label }: { label: any }) => (label ? label + 'には' : '') + '正しい値を入力してください',
    },
  })
  setLocale( locale);
})
