import { AuthAPI as AuthAPIType, LoginRequest, LoginResponse } from 'src/api/auth';
import { AxiosApi } from 'src/api/server/AxiosApi';

export class AuthAPI extends AxiosApi implements AuthAPIType {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.axios.post<LoginResponse>('/auth/login', request);
    return response.data;
  }
}
