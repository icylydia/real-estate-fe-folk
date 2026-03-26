import { defineBoot } from '#q-app/wrappers';
import { inject } from 'vue';
import { getToken } from 'src/auth';
import type { BuildingMonthlyArchiveResponse, FileBase, ImportBatchResponse } from 'src/api';
import { Configuration, DefaultApi } from 'src/api';
import axios from 'axios';

export interface UploadMainPhotoResponse {
  url: string;
  relativePath: string;
  name: string;
}

export interface UploadBuildingMonthlyAttachmentPayload {
  id: number;
  ownerId: number;
  targetYear: number;
  targetMonth: number;
  category: string;
  name: string;
  file: File;
}

class CustomAPI extends DefaultApi {
  public uploadMainPhoto = async (file: File): Promise<UploadMainPhotoResponse> => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
    const url = `${this.configuration.basePath}/file/upload-main-photo`;
    const formData = new FormData();
    formData.append('file', file);
    const resp = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp.data as UploadMainPhotoResponse;
  }

  public uploadFile = async (data: FileBase, file: File): Promise<FileBase> => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
    const url = `${this.configuration.basePath}/file/upload-file`;
    const formData = new FormData();
    formData.append('file', file);
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.category) {
      formData.append('category', String(data.category));
    }
    if (data.entity) {
      formData.append('entity', String(data.entity));
    }
    if (data.entityId) {
      formData.append('entityId', String(data.entityId));
    }
    const resp = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp.data as FileBase;
  }

  public deleteFile = async (id: string): Promise<void> => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
    const url = `${this.configuration.basePath}/file/${id}`;
    await axios.delete(url);
  }

  public dryRunItandiCsvImportFile = async (file: File): Promise<ImportBatchResponse> => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
    const url = `${this.configuration.basePath}/imports/itandi-csv/dry-run`;
    const formData = new FormData();
    formData.append('file', file);
    const resp = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp.data as ImportBatchResponse;
  }

  public uploadBuildingMonthlyAttachmentFile = async (
    data: UploadBuildingMonthlyAttachmentPayload
  ): Promise<BuildingMonthlyArchiveResponse> => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
    const url = `${this.configuration.basePath}/building/${data.id}/monthly-attachments`;
    const formData = new FormData();
    formData.append('ownerId', String(data.ownerId));
    formData.append('targetYear', String(data.targetYear));
    formData.append('targetMonth', String(data.targetMonth));
    formData.append('category', data.category);
    formData.append('name', data.name);
    formData.append('file', data.file);
    const resp = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return resp.data as BuildingMonthlyArchiveResponse;
  }
}

type ApiType = CustomAPI;

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiType;
  }
}

const apiConfig = new Configuration({
  accessToken: () => getToken(),
  basePath: import.meta.env.VITE_APP_API_URL,
});

const api: ApiType = new CustomAPI(apiConfig, import.meta.env.VITE_APP_API_URL, fetch);

const API_KEY = 'API_KEY';

export default defineBoot(({ app }) => {
  app.config.globalProperties.$api = api;

  app.provide(API_KEY, api);
});

export const useApi = (): ApiType => {
  return inject(API_KEY) as ApiType;
}

export { api };
