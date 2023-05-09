import { defineStore } from 'pinia';
import { RoomInRequest, RoomInResponse } from 'src/api';
import { api } from 'boot/api';

export type RoomFormModel = Partial<
  RoomInRequest & RoomInResponse
>

export const useRoomStore = defineStore('room', {
  state: () => ({
    formModel: {} as RoomFormModel,
  }),
  actions: {
    async getRoomDetail(id: string) {
      this.formModel = await api.getRoom(id);
    }
  }
});
