export interface PaginationRequest {
  itemsPerPage?: number;
  page?: number;
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
