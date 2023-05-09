import { LocalStorage } from 'quasar';

export interface User {
  accessToken: string;
  refreshToken: string;
}

export const login = (user: User) => {
  LocalStorage.set('user', JSON.stringify(user));
}

export const isLogin = () => {
  return LocalStorage.getItem('user') !== null;
}

export const logout = () => {
  LocalStorage.remove('user');
}

export const getToken = () => {
  const user = LocalStorage.getItem('user') as string;
  if (user) {
    return JSON.parse(user).accessToken;
  }
  return null;
}
