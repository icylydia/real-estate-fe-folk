import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { inject } from 'vue';
import { getToken } from 'src/auth';
import { ApiType } from 'src/api';
import { AddressAPI } from 'src/api/server/address';
import { AuthAPI } from 'src/api/server/auth';
import { BuildingAPI } from 'src/api/server/building';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: ApiType;
  }
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${getToken()}`,
  }
});

const api: ApiType = {
  address: new AddressAPI(axiosInstance),
  auth: new AuthAPI(axiosInstance),
  building: new BuildingAPI(axiosInstance),
}

const API_KEY = 'API_KEY';

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axiosInstance;

  app.config.globalProperties.$api = api;

  app.provide(API_KEY, api);
});

export const useApi = (): ApiType => {
  return inject(API_KEY) as ApiType;
}

export { api };
