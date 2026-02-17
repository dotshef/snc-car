export type CustomerType = '개인' | '개인사업자' | '법인';
export type InitialFundType = '보증금' | '선수금';
export type InitialFundRate = 0 | 10 | 20 | 30;
export type ContractPeriod = 36 | 48 | 60;

export interface QuoteRequest {
  name: string;
  phone: string;
  region: string;
  customerType: CustomerType;

  /** 초기자금 유형 */
  initialFundType: InitialFundType;
  /** 초기자금 비율 (%) */
  initialFundRate: InitialFundRate;
  /** 계약 기간 (개월) */
  contractPeriod: ContractPeriod;
  /** 선택 차량명 (차량 카드에서 열었을 때) */
  selectedCarName?: string;
  /** 선택 제조사명 (차량 카드에서 열었을 때) */
  selectedManufacturerName?: string;

  privacyAgreed: boolean;
  submittedAt?: string;
}
