import { defineStore } from 'pinia';
import { api, type UploadBuildingMonthlyAttachmentPayload } from 'boot/api';
import type {
  BuildingMonthlyArchiveResponse,
  FileBase,
  PaginationResponsePagination,
} from 'src/api';

interface MonthlyArchiveListRequest {
  itemsPerPage?: number;
  page?: number;
  buildingId?: number;
  ownerId?: number;
  year?: number;
  month?: number;
  category?: string;
}

export const useMonthlyArchiveStore = defineStore('monthlyArchive', {
  state: () => ({
    archiveList: [] as BuildingMonthlyArchiveResponse[],
    archive: null as BuildingMonthlyArchiveResponse | null,
    attachments: [] as FileBase[],
    searchParams: {} as MonthlyArchiveListRequest,
  }),
  actions: {
    updateArchiveState(nextArchive: BuildingMonthlyArchiveResponse) {
      this.archiveList = this.archiveList.map((archive) => (
        archive.id === nextArchive.id
          ? {
            ...archive,
            ...nextArchive,
          }
          : archive
      ));
      if (this.archive?.id === nextArchive.id) {
        this.archive = {
          ...this.archive,
          ...nextArchive,
        };
      }
    },
    clearSelection() {
      this.archive = null;
      this.attachments = [];
    },
    reset() {
      this.archiveList = [];
      this.clearSelection();
      this.searchParams = {};
    },
    async getArchiveList(params: MonthlyArchiveListRequest): Promise<PaginationResponsePagination> {
      const resp = await api.getBuildingMonthlyAttachmentList(
        params.itemsPerPage,
        params.page,
        params.buildingId,
        params.ownerId,
        params.year,
        params.month,
        params.category,
      );
      this.archiveList = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async getArchive(buildingId: number, ownerId: number, year: number, month: number): Promise<BuildingMonthlyArchiveResponse> {
      const archive = await api.getBuildingMonthlyAttachments(buildingId, ownerId, year, month);
      this.archive = archive;
      this.attachments = archive.attachments ?? [];
      return archive;
    },
    async uploadAttachment(payload: UploadBuildingMonthlyAttachmentPayload): Promise<BuildingMonthlyArchiveResponse> {
      const archive = await api.uploadBuildingMonthlyAttachmentFile(payload);
      this.archive = archive;
      this.attachments = archive.attachments ?? [];
      return archive;
    },
    async deleteAttachment(fileId: number): Promise<void> {
      await api.deleteBuildingMonthlyAttachment(fileId);
      this.attachments = this.attachments.filter((file) => file.id !== String(fileId));
      if (this.archive) {
        this.archive.attachments = this.attachments;
      }
    },
    async disableArchive(archiveId: number): Promise<BuildingMonthlyArchiveResponse> {
      const archive = await api.disableBuildingMonthlyArchive(archiveId);
      this.updateArchiveState(archive);
      return archive;
    },
    async enableArchive(archiveId: number): Promise<BuildingMonthlyArchiveResponse> {
      const archive = await api.enableBuildingMonthlyArchive(archiveId);
      this.updateArchiveState(archive);
      return archive;
    },
  },
});
