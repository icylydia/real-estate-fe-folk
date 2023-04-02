import { AuthAPI as AuthAPIType, LoginRequest, LoginResponse } from 'src/api/auth';
import { AxiosInstance } from 'axios';

export class AuthAPI implements AuthAPIType {
  private axios: AxiosInstance;
  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.axios.post<LoginResponse>('/login', request);
    return response.data;
  }
}
