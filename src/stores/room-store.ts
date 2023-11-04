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

const defaultFormModel: RoomFormModel = {
  building: {},
}

const defaultFileModel: FileModel = {}

export const useRoomStore = defineStore('room', {
  state: () => ({
    formModel: defaultFormModel as RoomFormModel,
    fileModel: defaultFileModel as FileModel,
  }),
  actions: {
    async getRoomDetail(id: string) {
      this.formModel = await api.getRoom(id);
    },
    async createRoom(data: RoomInRequest) {
      return await api.createRoom(data);
    },
    async updateRoom(id: string, data: RoomInRequest) {
      return await api.updateRoom(data, id);
    },
    resetFormModel() {
      this.formModel = defaultFormModel;
    },
    resetFileModel() {
      this.fileModel = {} as FileModel;
    },
  }
});
