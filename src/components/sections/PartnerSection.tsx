'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { partners } from '@/data/partners';
import FadeInUp from '@/components/animation/FadeInUp';

const ROWS = 2;
const TOTAL_COLS = Math.ceil(partners.length / ROWS); // 10
// translateX % 기준: inner track 자신의 width 기준 → 1열 = 100/TOTAL_COLS %
const STEP_PCT = 100 / TOTAL_COLS; // 10%

function getColsVisible(): number {
  if (typeof window === 'undefined') return 5;
  if (window.innerWidth >= 1024) return 5;
  if (window.innerWidth >= 768) return 3;
  return 2;
}

export default function PartnerSection() {
  const [colsVisible, setColsVisible] = useState(5);
  const [currentCol, setCurrentCol] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // breakpoint 변경 감지
  useEffect(() => {
    const update = () => {
      const next = getColsVisible();
      setColsVisible(next);
      // 변경된 breakpoint의 MAX_COL 범위로 clamp
      setCurrentCol((prev) => Math.min(prev, TOTAL_COLS - next));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const goNext = useCallback(() => {
    setCurrentCol((prev) => {
      const maxCol = TOTAL_COLS - getColsVisible();
      return prev >= maxCol ? 0 : prev + 1;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentCol((prev) => {
      const maxCol = TOTAL_COLS - getColsVisible();
      return prev <= 0 ? maxCol : prev - 1;
    });
  }, []);

  const startAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 2000);
  }, [goNext]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const handlePrev = () => { goPrev(); startAutoSlide(); };
  const handleNext = () => { goNext(); startAutoSlide(); };

  const trackWidth = `${(TOTAL_COLS / colsVisible) * 100}%`;
  const translateX = -(currentCol * STEP_PCT);

  return (
    <section className="py-16 bg-bg-secondary">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 제목 */}
        <FadeInUp delay={0}>
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-10 text-text-primary">
            에쓰엔씨오토홀딩스{' '}
            <span className="text-accent">주요 파트너사</span>
          </h2>
        </FadeInUp>

        {/* 슬라이더 */}
        <FadeInUp delay={100}>
          <div className="flex items-center gap-3">
            {/* 좌측 버튼 */}
            <button
              onClick={handlePrev}
              aria-label="이전"
              className="flex-shrink-0 w-9 h-9 rounded-full border border-border bg-white shadow-sm flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 뷰포트 */}
            <div className="overflow-hidden flex-1">
              {/* 내부 트랙 */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                  gridTemplateColumns: `repeat(${TOTAL_COLS}, 1fr)`,
                  gridAutoFlow: 'column',
                  width: trackWidth,
                  transform: `translateX(${translateX}%)`,
                  transition: 'transform 0.4s ease',
                }}
              >
                {partners.map((partner) => (
                  <div key={partner.id} className="p-2">
                    <div className="border border-border rounded-xl bg-white flex items-center justify-center h-24">
                      <Image
                        src={partner.src}
                        alt={partner.alt}
                        width={160}
                        height={70}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측 버튼 */}
            <button
              onClick={handleNext}
              aria-label="다음"
              className="flex-shrink-0 w-9 h-9 rounded-full border border-border bg-white shadow-sm flex items-center justify-center text-text-secondary hover:bg-bg-secondary hover:text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
