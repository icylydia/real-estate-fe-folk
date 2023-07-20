import { defineStore } from 'pinia';
import { ModelFile, RoomInRequest, RoomInResponse } from 'src/api';
import { api } from 'boot/api';

export type RoomFormModel = Partial<
  RoomInRequest & RoomInResponse
>

export type FileModel = Partial<
  ModelFile & {
  file: File;
  }
>

export const useRoomStore = defineStore('room', {
  state: () => ({
    formModel: {} as RoomFormModel,
    fileModel: {} as FileModel,
  }),
  actions: {
    async getRoomDetail(id: string) {
      this.formModel = await api.getRoom(id);
    },
    resetFormModel() {
      this.formModel = {};
    },
    resetFileModel() {
      this.fileModel = {} as FileModel;
    },
  }
});
