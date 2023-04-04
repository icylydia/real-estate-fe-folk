import { PaginationRequest, PaginationResponse } from 'src/api/common';
import { AccessInRequest, AccessInResponse, AddressInRequest, AddressInResponse } from 'src/api/address';

export interface BuildingBase {
  /**
   * 建筑名称
   * @example "クリオ馬込１番館"
   */
  name?: string;
  /**
   * 建筑价格
   * @format int32
   * @example 14600000
   */
  price?: number;
  /**
   * 毛回报率/表面利回り
   * @format float
   */
  grossYield?: number;
  /**
   * 建筑面积/建物面積
   * @format int32
   */
  grossArea?: number;
  /**
   * 土地面积/土地面積
   * @format int32
   */
  landArea?: number;
  /**
   * 建筑结构/建物構造
   * - `wood`: 木造(W)
   * - `steel`: 鉄骨造(S)
   * - `reinforcedConcrete`: 鉄筋コンクリート造(RC)
   * - `steelReinforcedConcrete`: 鉄筋鉄骨コンクリート造(SRC)
   */
  buildingStructure?: 'wood' | 'steel' | 'reinforcedConcrete' | 'steelReinforcedConcrete';
  /**
   * 地上层数/地上階数
   * @format int32
   */
  floorsAboveGround?: number;
  /**
   * 地下层数/地下階数
   * @format int32
   */
  floorsUnderGround?: number;
  /**
   * 建成日期/新築年月日
   * @format date
   */
  completionDate?: string;
  /**
   * 总户数/総戸数
   * @format int32
   */
  totalUnits?: number;
  /**
   * 土地权利 (**待确认**)
   * - `freehold`: 所有権
   * - `leasehold`: 借地権
   */
  landRights?: 'freehold' | 'leasehold';
  /**
   * 土地用途区域
   * - `lowRiseResidential1`: 第一種低層住居専用地域
   * - `lowRiseResidential2`: 第二種低層住居専用地域
   * - `mediumHighRiseResidential1`: 第一種中高層住居専用地域
   * - `mediumHighRiseResidential2`: 第二種中高層住居専用地域
   * - `residential1`: 第一種住居地域
   * - `residential2`: 第二種住居地域
   * - `quasiResidential`: 準住居地域
   * - `ruralResidential`: 田園住居地域
   * - `neighborhoodCommercial`: 近隣商業地域
   * - `commercial`: 商業地域
   * - `quasiIndustrial`: 準工業地域
   * - `industrial`: 工業地域
   */
  landUseZone?:
    | 'lowRiseResidential1'
    | 'lowRiseResidential2'
    | 'mediumHighRiseResidential1'
    | 'mediumHighRiseResidential2'
    | 'residential1'
    | 'residential2'
    | 'quasiResidential'
    | 'ruralResidential'
    | 'neighborhoodCommercial'
    | 'commercial'
    | 'quasiIndustrial'
    | 'industrial';
  /**
   * 建筑覆盖率/建ぺい率
   * @format float
   */
  buildingCoverageRatio?: number;
  /**
   * 容积率/容積率
   * @format float
   */
  floorAreaRatio?: number;
  /** 备注/備考 */
  comments?: string;
}

export type BuildingInRequest = BuildingBase & {
  address?: AddressInRequest;
  accesses?: AccessInRequest[];
};

export type BuildingInResponse = BuildingBase & {
  /**
   * 建筑ID
   * @format int32
   */
  id?: number;
  address?: AddressInResponse;
  accesses?: AccessInResponse[];
};

export type GetBuildingListRequest = PaginationRequest;

export interface BuildingAPI {
  list(query: GetBuildingListRequest): Promise<PaginationResponse<BuildingInResponse>>;
  create(payload: BuildingInRequest): Promise<BuildingInResponse>;
  detail(id: number): Promise<BuildingInResponse>;
}
