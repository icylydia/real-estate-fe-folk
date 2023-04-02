export interface User {
  accessToken: string;
  refreshToken: string;
  status: string;
}

export const login = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
}

export const isLogin = () => {
  return localStorage.getItem('user') !== null;
}

export const logout = () => {
  localStorage.removeItem('user');
}
