import { defineStore } from 'pinia';
import { FileBase, RoomInRequest, RoomInResponse } from 'src/api';
import { api } from 'boot/api';

export type RoomFormModel = Partial<
  RoomInRequest & RoomInResponse
>

const defaultFormModel: RoomFormModel = {
  building: {},
}

export const useRoomStore = defineStore('room', {
  state: () => ({
    formModel: defaultFormModel as RoomFormModel,
    fileModel: {} as FileBase,
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
    async deleteRoom(id: string) {
      return await api.deleteRoom(id);
    },
    resetFormModel() {
      this.formModel = defaultFormModel;
    },
    resetFileModel() {
      this.fileModel = {} as FileBase;
    },
    appendFile(file: FileBase) {
      if (this.formModel.files) {
        this.formModel.files.push(file)
      } else {
        this.formModel.files = [file]
      }
    },
    removeFile(id: string) {
      if (this.formModel.files) {
        this.formModel.files = this.formModel.files.filter(file => file.id !== id)
      }
    },
  }
});
