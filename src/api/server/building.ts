import {
  BuildingAPI as BuildingAPIType,
  BuildingInRequest,
  BuildingInResponse,
  GetBuildingListRequest
} from 'src/api/building';
import { PaginationResponse } from 'src/api/common';
import { AxiosApi } from 'src/api/server/AxiosApi';

export class BuildingAPI extends AxiosApi implements BuildingAPIType {
  async list(query: GetBuildingListRequest): Promise<PaginationResponse<BuildingInResponse>> {
    const response = await this.axios.get<PaginationResponse<BuildingInResponse>>('/buildings', { params: query });
    return response.data;
  }

  async create(request: BuildingInRequest): Promise<BuildingInResponse> {
    const response = await this.axios.post<BuildingInResponse>('/building', request);
    return response.data;
  }

  async detail(id: number): Promise<BuildingInResponse> {
    const response = await this.axios.get<BuildingInResponse>(`/building/${id}`);
    return response.data;
  }
}
