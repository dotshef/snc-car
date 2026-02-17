'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useQuoteModal } from '@/hooks/useQuoteModal';
import { normalizePhoneNumber, validatePhoneNumber, validateName } from '@/utils/validators';
import type {
  CustomerType,
  InitialFundType,
  InitialFundRate,
  ContractPeriod,
  QuoteRequest,
} from '@/types/quote';

const CUSTOMER_TYPES: CustomerType[] = ['개인', '개인사업자', '법인'];
const INITIAL_FUND_TYPES: InitialFundType[] = ['보증금', '선수금'];
const INITIAL_FUND_RATES: InitialFundRate[] = [0, 10, 20, 30];
const CONTRACT_PERIODS: ContractPeriod[] = [36, 48, 60];

const INITIAL_FUND_OPTIONS = INITIAL_FUND_TYPES.flatMap((type) =>
  INITIAL_FUND_RATES.map((rate) => `${type} ${rate}%`)
);

function parseInitialFund(value: string): { type: InitialFundType; rate: InitialFundRate } {
  const match = value.match(/^(보증금|선수금)\s*(\d+)%$/);
  return {
    type: (match?.[1] ?? '보증금') as InitialFundType,
    rate: Number(match?.[2] ?? 0) as InitialFundRate,
  };
}

const inputClass = 'w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const inputErrorClass = 'w-full px-3 py-2.5 border border-error rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelClass = 'block text-sm text-text-secondary mb-1';

export default function QuoteModal() {
  const { isOpen, selectedCar, closeModal } = useQuoteModal();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    region: '',
    customerType: '개인' as CustomerType,
    initialFund: '보증금 0%',
    contractPeriod: 36 as ContractPeriod,
    desiredCar: '',
    privacyAgreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && selectedCar) {
      setFormData((prev) => ({
        ...prev,
        desiredCar: `${selectedCar.manufacturerName} ${selectedCar.name}`,
      }));
    }
  }, [isOpen, selectedCar]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'contractPeriod'
            ? (Number(value) as ContractPeriod)
            : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      newErrors.name = '이름을 2자 이상 입력해주세요.';
    }

    if (!validatePhoneNumber(formData.phone)) {
      newErrors.phone = '올바른 전화번호를 입력해주세요.';
    }

    if (!formData.region) {
      newErrors.region = '지역을 입력해주세요.';
    }

    if (!formData.privacyAgreed) {
      newErrors.privacyAgreed = '개인정보 수집 및 이용에 동의해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { type: fundType, rate: fundRate } = parseInitialFund(formData.initialFund);

      const request: QuoteRequest = {
        name: formData.name,
        phone: normalizePhoneNumber(formData.phone),
        region: formData.region,
        customerType: formData.customerType,
        initialFundType: fundType,
        initialFundRate: fundRate,
        contractPeriod: formData.contractPeriod,
        selectedCarName: formData.desiredCar || undefined,
        privacyAgreed: formData.privacyAgreed,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quote', data: request }),
      });

      if (!res.ok) {
        throw new Error(`Send failed: ${res.status}`);
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: '제출 중 오류가 발생했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    closeModal();
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        region: '',
        customerType: '개인',
        initialFund: '보증금 0%',
        contractPeriod: 36,
        desiredCar: '',
        privacyAgreed: false,
      });
      setErrors({});
      setIsSubmitted(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="">
          <div className="flex justify-end p-2">
            <button
              onClick={handleClose}
              className="p-1 hover:bg-bg-secondary rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-text-primary text-center pb-4">S&C 빠른 견적 문의</h2>
        </div>

        {isSubmitted ? (
          /* 제출 완료 화면 */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">접수 완료</h3>
            <p className="text-text-secondary mb-6">
              견적 상담 신청이 완료되었습니다.<br />
              빠른 시일 내에 연락드리겠습니다.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              확인
            </button>
          </div>
        ) : (
          /* 폼 */
          <form onSubmit={handleSubmit} className="p-4">

            {/* 차종 */}
            <div className="mb-4">
              <label className={labelClass}>차종</label>
              <input
                type="text"
                name="desiredCar"
                value={formData.desiredCar}
                onChange={handleInputChange}
                placeholder="ex) 현대 디 올 뉴 팰리세이드"
                className={inputClass}
              />
            </div>

            {/* Row 1: 성함 또는 회사명 / 연락처 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>성함 또는 회사명</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder=""
                  className={errors.name ? inputErrorClass : inputClass}
                />
                {errors.name && (
                  <p className="text-xs text-error mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>연락처</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="('-' 없이)"
                  className={errors.phone ? inputErrorClass : inputClass}
                />
                {errors.phone && (
                  <p className="text-xs text-error mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Row 2: 지역 / 유형 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>지역</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="ex) 서울 / 경기"
                  className={errors.region ? inputErrorClass : inputClass}
                />
                {errors.region && (
                  <p className="text-xs text-error mt-1">{errors.region}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>유형</label>
                <select
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  {CUSTOMER_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: 초기자금 / 계약기간 */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={labelClass}>초기자금</label>
                <select
                  name="initialFund"
                  value={formData.initialFund}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  {INITIAL_FUND_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>계약기간</label>
                <select
                  name="contractPeriod"
                  value={formData.contractPeriod}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  {CONTRACT_PERIODS.map((period) => (
                    <option key={period} value={period}>
                      {period}개월
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="mb-3 border border-border rounded-lg p-3 max-h-40 overflow-y-auto text-xs text-text-secondary leading-relaxed">
              <p className="mb-2">
                S&C 신차장기렌트리스(이하 &apos;회사&apos;라 한다)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다.
              </p>
              <p className="font-bold mb-1">제1조 (개인정보의 처리목적)</p>
              <p className="mb-2">
                회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <p className="font-bold mb-1">제2조 (수집하는 개인정보 항목)</p>
              <p>
                회사는 견적 상담 서비스 제공을 위해 필요한 최소한의 개인정보를 수집합니다. 수집 항목: 성명, 연락처, 지역, 희망차종 등 상담에 필요한 정보.
              </p>
            </div>

            {/* 개인정보활용동의 */}
            <div className="mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="privacyAgreed"
                  checked={formData.privacyAgreed}
                  onChange={handleInputChange}
                />
                <span className="text-sm text-text-primary">
                  개인정보활용동의(필수)
                </span>
              </label>
              {errors.privacyAgreed && (
                <p className="text-xs text-error mt-1">{errors.privacyAgreed}</p>
              )}
            </div>

            {/* 에러 메시지 */}
            {errors.submit && (
              <p className="text-sm text-error mb-4 text-center">{errors.submit}</p>
            )}

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                isSubmitting
                  ? 'bg-disabled text-text-muted cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {isSubmitting ? '처리 중...' : '무료 견적 요청'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
