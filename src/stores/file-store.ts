import { defineStore } from 'pinia';
import { api } from 'boot/api';

const DEFAULT_MAIN_PHOTO_URL = import.meta.env.VITE_APP_DEFAULT_MAIN_PHOTO;

export const useFileStore = defineStore('file', {
  state: () => ({
    defaultMainPhotoUrl: DEFAULT_MAIN_PHOTO_URL,
  }),
  actions: {
    async uploadMainPhoto(file: File) {
      return api.uploadMainPhoto(file);
    }
  }
});
