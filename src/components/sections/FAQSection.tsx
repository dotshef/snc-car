'use client';

import { useState } from 'react';
import FadeInUp from '@/components/animation/FadeInUp';

const faqs = [
  {
    id: 1,
    question: '장기렌트카 이용시 신용등급 및 대출한도에 영향이 있나요?',
    answer: '장기렌트 진행시 명의는 캐피탈 또는 렌터카 업체이기 때문에 신용등급이나 대출이력에 영향이 가지 않습니다.',
  },
  {
    id: 2,
    question: '사고 발생시 어떻게 하나요?',
    answer: '신차보증(엔진, 미션)에 대한 워런티는 렌트, 리스를 이용하시더라도 동일하게 적용받으실 수 있습니다. 가까운 지정 공업사(블루핸즈, 오토큐 등)에 내방하시면 됩니다. 사고시 진행 렌탈사마다 정해져있는 고객센터 번호로 연락하여 사고접수 하시면 됩니다.',
  },
  {
    id: 3,
    question: '자차 면책금이란 무엇인가요?',
    answer: '장기렌트 진행시 영업용 보험이 월 납입금 안에 포함되어 있습니다. 계약시 정해진 자기 부담금을 납입하면 차량 수리비 납부 부담이 면제됩니다.',
  },
  {
    id: 4,
    question: '계약기간 도중 반납이 가능한가요?',
    answer: '가능합니다. 1) 보통의 렌탈사의 경우 중도 해지 위약금은 남은 개월수 월납입금 30%으로 정해져있습니다. 2) 차량이 필요 없어지는 시기가 정해져있다면 그 전에 승계 처리를 하여 차량을 이어받으실 분을 구하는 방법이 있습니다. 3) 자율반납형 상품으로 진행하는 방법이 있습니다. 60개월 계약 후 36개월이 지난 시점부터는 위약금 없이 자유롭게 반납할 수 있는 상품입니다.',
  },
  {
    id: 5,
    question: '장기렌트와 리스는 최대 몇 개월까지 가능한가요?',
    answer: '60개월까지 가능합니다.',
  },
  {
    id: 6,
    question: '계약 종료 후 진행 과정은 어떻게 되나요?',
    answer: '계약 종료 두 달 전 진행하신 업체에서 연락이 옵니다. 만기 선택형으로 반납, 인수, 연장 중 자유롭게 선택하시면 됩니다.',
  },
  {
    id: 7,
    question: '리스 진행시 타인 명의로 보험 가입이 가능한가요?',
    answer: '리스 계약자 본인 명의로만 보험가입이 가능하기 때문에 불가능합니다.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* 섹션 헤더 */}
        <FadeInUp>
          <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
            자주 묻는 질문
          </h2>
        </FadeInUp>

        {/* FAQ 아코디언 */}
        <FadeInUp delay={150}>
          <div className="space-y-3">
            {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className="border border-border rounded-xl overflow-hidden bg-gradient-to-b from-white to-gray-50 hover:border-secondary transition-colors"
                >
                  {/* 질문 */}
                  <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                <span className="font-medium text-text-primary pr-4">
                  {faq.question}
                </span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${
                            openId === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 답변 */}
                  {openId === faq.id && (
                      <div className="p-4 bg-bg-secondary border-t border-border">
                        <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                      </div>
                  )}
                </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
