<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card class="login-form">
          <div class="q-pa-md bg-grey-4">
            <q-img
              class="bg-grey-4"
              src="~assets/chintai_sublease.png"
            />
          </div>
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 text-weight-bold ellipsis">
                {{appName}}<span class="text-subtitle1 q-ml-sm">v{{appVersion}}</span>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md" @submit="onSubmit">
              <Field name="email" v-slot="{errorMessage, value, field}">
                <q-input
                  :model-value="value"
                  v-bind="field"
                  :error-message="errorMessage"
                  :error="!!errorMessage"
                  label="メールアドレス"
                  type="email"
                  filled
                />
              </Field>

              <Field name="password" v-slot="{errorMessage, value, field}">
                <q-input
                  :model-value="value"
                  v-bind="field"
                  :error-message="errorMessage"
                  :error="!!errorMessage"
                  label="パスワード"
                  type="password"
                  filled
                />
              </Field>

              <div>
                <q-btn
                  label="ログイン"
                  color="primary"
                  type="submit"
                  :disabled="isSubmitting"
                />

                <a
                  class="float-right q-mt-sm q-pl-md"
                  :href="router.resolve({ name: 'reset-password' }).href"
                >
                  ログインできない場合はこちら
                </a>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import useApp from 'components/app/useApp';
import {object, string} from 'yup';
import { Field, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import useErrorHandler from 'components/app/useErrorHandler.js';
import { login } from 'src/auth';
import { useRouter } from 'vue-router';
import { useApi } from 'boot/api';
import type { AuthLoginBody } from 'src/api';

const {appName, appVersion} = useApp();

const validationSchema = toTypedSchema(object({
  email: string().email().required().label('メールアドレス'),
  password: string().required().min(6).label('パスワード'),
}));

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const { toastHandler } = useErrorHandler();
const router = useRouter();
const api = useApi();
const onSubmit = handleSubmit(async (values) => {
  try {
    const payload: AuthLoginBody = {
      email: values.email,
      password: values.password,
    };
    const loginResponse = await api.login(payload);
    const token = loginResponse.data?.token;
    if (!token) {
      await toastHandler(new Error('ログインに失敗しました'));
      return
    }
    const user = { token }
    login(user)
    await router.push({ name: 'building-list' });
  } catch (e) {
    if (e instanceof Response && e.status === 401) {
      await toastHandler(new Error('メールアドレスまたはパスワードが間違っています'));
      return
    } else {
      await toastHandler(new Error('ログインに失敗しました'));
      return
    }
  }
});
</script>

<style lang="scss" scoped>
.login-form {
  max-width: 400px;
}
</style>
