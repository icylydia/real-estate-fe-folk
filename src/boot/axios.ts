import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { AuthAPI } from 'src/api/server/auth';
import { ApiType } from 'src/api';
import { inject } from 'vue';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: ApiType;
  }
}

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

const api: ApiType = {
  auth: new AuthAPI(axiosInstance),
}

const API_KEY = 'API_KEY';

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;

  app.provide(API_KEY, api);
});

export const useApi = (): ApiType => {
  return inject(API_KEY) as ApiType;
}

export { api };
