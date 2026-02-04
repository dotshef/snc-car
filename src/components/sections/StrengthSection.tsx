import StrengthCard from '@/components/cards/StrengthCard';

const strengths = [
  {
    id: 1,
    title: '전 차종 취급',
    description: '국산차부터 수입차까지 모든 브랜드의 신차를 합리적인 가격에 만나보세요.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 2,
    title: '최저가 보장',
    description: '타사 대비 최저가를 보장합니다. 더 저렴한 견적이 있다면 알려주세요.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: '빠른 출고',
    description: '즉시 출고 가능한 차량을 보유하고 있어 빠르게 새 차를 만날 수 있습니다.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: '맞춤 상담',
    description: '고객님의 상황에 맞는 최적의 렌트/리스 조건을 제안해 드립니다.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
];

export default function StrengthSection() {
  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* 섹션 헤더 */}
        <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">
          왜 S&C 신차장기렌트리스일까?
        </h2>
        <p className="text-text-secondary text-center mb-10">
          S&C만의 차별화된 서비스를 경험해보세요
        </p>

        {/* 강점 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {strengths.map((strength) => (
            <StrengthCard
              key={strength.id}
              icon={strength.icon}
              title={strength.title}
              description={strength.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
