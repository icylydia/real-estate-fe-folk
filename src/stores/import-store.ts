import { defineStore } from 'pinia';
import { api } from 'boot/api';
import type {
  ImportBatchResponse,
  ImportBatchRowResponse,
  PaginationResponsePagination,
} from 'src/api';

interface ImportBatchRowFilters {
  status?: string;
}

export const useImportStore = defineStore('import', {
  state: () => ({
    currentBatch: null as ImportBatchResponse | null,
    batchRows: [] as ImportBatchRowResponse[],
    rowFilters: {} as ImportBatchRowFilters,
  }),
  actions: {
    reset() {
      this.currentBatch = null;
      this.batchRows = [];
      this.rowFilters = {};
    },
    async dryRun(file: File): Promise<ImportBatchResponse> {
      const batch = await api.dryRunItandiCsvImportFile(file);
      this.currentBatch = batch;
      return batch;
    },
    async getBatch(id: number): Promise<ImportBatchResponse> {
      const batch = await api.getItandiCsvImportBatch(id);
      this.currentBatch = batch;
      return batch;
    },
    async getBatchRows(
      id: number,
      itemsPerPage?: number,
      page?: number,
      status?: string,
    ): Promise<PaginationResponsePagination> {
      const resp = await api.getItandiCsvImportBatchRows(id, itemsPerPage, page, status);
      this.batchRows = resp.items ?? [];
      return resp.pagination ?? {} as PaginationResponsePagination;
    },
    async commit(batchId: number, forceImport?: boolean): Promise<ImportBatchResponse> {
      const batch = await api.commitItandiCsvImport({ batchId, forceImport });
      this.currentBatch = batch;
      return batch;
    },
  },
});
