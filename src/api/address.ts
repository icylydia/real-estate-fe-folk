/** 地址 */
export interface AddressBase {
  /**
   * 邮政编码
   * @example "110-0006"
   */
  postalCode?: string;
  /**
   * 都道府县ID
   * @format int32
   */
  prefectureId?: number;
  /**
   * 市区町村
   * @example "〇〇市〇〇町"
   */
  detailAddress1?: string;
  /**
   * 丁目・番地・号
   * @example "〇〇丁目〇〇番地〇〇号"
   */
  detailAddress2?: string;
  /**
   * 建物名・部屋番号
   * @example "〇〇マンション〇〇号室"
   */
  detailAddress3?: string;
}

export type AddressInRequest = AddressBase;

export type AddressInResponse = AddressBase & {
  /**
   * 都道府县
   * @example "東京都"
   */
  prefecture?: string;
};

/** 交通 */
export interface AccessBase {
  /**
   * 线路ID
   * @format int32
   */
  lineId?: number;
  /**
   * 车站ID
   * @format int32
   */
  stationId?: number;
  /**
   * 交通类型:
   * - `bus`: 公共汽车/バス
   * - `walk`: 步行/徒歩
   * - `car`: 驾车/車
   */
  type?: 'bus' | 'walk' | 'car';
  /**
   * 交通时间(分钟)
   * @format int32
   */
  time?: number;
}

export type AccessInRequest = AccessBase;

export type AccessInResponse = AccessBase & {
  /**
   * 交通ID
   * @format int32
   */
  id?: number;
  /**
   * 建筑ID
   * @format int32
   */
  buildingId?: number;
  /**
   * 线路名
   * @example "山手線"
   */
  line?: string;
  /**
   * 车站名
   * @example "渋谷"
   */
  station?: string;
};

/** 都道府县 */
export interface Prefecture {
  /**
   * 都道府县ID
   * @format int32
   */
  id?: number;
  /**
   * 都道府县名
   * @example "東京都"
   */
  name?: string;
}

/** 电车线路 */
export interface TrainLine {
  /**
   * 线路ID
   * @format int32
   */
  id?: number;
  /**
   * 线路名
   * @example "山手線"
   */
  name?: string;
}

/** 电车车站 */
export interface TrainStation {
  /**
   * 车站ID
   * @format int32
   */
  id?: number;
  /**
   * 车站名
   * @example "渋谷"
   */
  name?: string;
}

export type TrainLineDetail = TrainLine & {
  stations?: TrainStation[];
};

export interface AddressAPI {
  getAddressByPostalCode(postalCode: string): Promise<AddressInResponse>;
}
