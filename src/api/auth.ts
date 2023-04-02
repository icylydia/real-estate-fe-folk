export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  accessToken: string;
  refreshToken: string;
  status: string;
}

export type LoginResponse = AuthUser;

export interface AuthAPI {
  login: (request: LoginRequest) => Promise<LoginResponse>;
}
