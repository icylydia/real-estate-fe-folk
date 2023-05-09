import { boot } from 'quasar/wrappers';
import { inject } from 'vue';
import { getToken } from 'src/auth';
import { DefaultApi, Configuration } from 'src/api';

type ApiType = DefaultApi;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiType;
  }
}

const apiConfig = new Configuration({
  accessToken: () => getToken(),
  basePath: import.meta.env.VITE_APP_API_URL,
});

const api: ApiType = new DefaultApi(apiConfig);

const API_KEY = 'API_KEY';

export default boot(({ app }) => {
  app.config.globalProperties.$api = api;

  app.provide(API_KEY, api);
});

export const useApi = (): ApiType => {
  return inject(API_KEY) as ApiType;
}

export { api };
