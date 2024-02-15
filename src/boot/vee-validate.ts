import { boot } from 'quasar/wrappers'
import { setLocale } from 'yup'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// noinspection JSUnusedGlobalSymbols
export default boot(async (/* { app, router, ... } */) => {
  setLocale({
    mixed: {
      required: '${path} は必須項目です',
    },
    string: {
      min: '${path} は ${min} 文字以上でなければなりません',
      max: '${path} は ${max} 文字以内にしてください',
      email: '${path} は有効なメールアドレスではありません',
    }
  })
})
