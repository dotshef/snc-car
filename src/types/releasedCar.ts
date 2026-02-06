export interface ReleasedCar {
  /** 고유 식별자 (UUID) */
  id: string;

  /** 차량명 */
  carName: string;

  /** 썸네일 이미지 URL */
  thumbnailUrl: string;

  /** 출고일 (ISO 8601 date) */
  releasedAt: string;

  /** 노출 여부 */
  isVisible: boolean;

  /** 생성일시 (ISO 8601) */
  createdAt: string;
}
