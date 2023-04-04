import { AxiosInstance } from 'axios';

export abstract class AxiosApi {
  protected axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
}
