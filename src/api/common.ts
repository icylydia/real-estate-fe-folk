export interface PaginationRequest {
  /**
   * 每页条数
   * @format int32
   * @default 15
   */
  itemsPerPage?: number;
  /**
   * 页码
   * @format int32
   * @default 1
   */
  page?: number;
  /**
   * 价格下限
   * @format int32
   * @default 0
   */
  priceLowerBound?: number;
  /**
   * 价格上限
   * @format int32
   */
  priceUpperBound?: number;
  /**
   * 毛回报率(xx%以上)
   * @format float
   */
  grossYield?: number;
  /** 其他条件(地名，车站，建筑名称等) */
  other?: string;
}
export interface PaginationResponse<T> {
  /**
   * 每页条数
   * @format int32
   */
  itemsPerPage?: number;
  /**
   * 页码
   * @format int32
   */
  page?: number;
  /**
   * 总条数
   * @format int32
   */
  totalItems?: number;
  /** 数据列表 */
  items?: T[];
}
