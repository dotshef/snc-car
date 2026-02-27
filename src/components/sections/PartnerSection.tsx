'use client';

import Image from 'next/image';
import { partners } from '@/data/partners';
import FadeInUp from '@/components/animation/FadeInUp';
import { useSlider } from '@/hooks/useSlider';
import DraggableTrack from '@/components/ui/DraggableTrack';

const ROWS = 2;
const TOTAL_COLS = Math.ceil(partners.length / ROWS);
const BREAKPOINTS = { lg: 5, md: 3, sm: 2 };

export default function PartnerSection() {
  const { trackWidth, translateX, handlePrev, handleNext } = useSlider({
    totalCols: TOTAL_COLS,
    breakpoints: BREAKPOINTS,
    autoPlayInterval: 2000,
    stepMode: 'one',
  });

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

            {/* 드래그 가능 뷰포트 */}
            <DraggableTrack onPrev={handlePrev} onNext={handleNext} className="flex-1">
              {({ offset, isDragging }) => (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    gridTemplateColumns: `repeat(${TOTAL_COLS}, 1fr)`,
                    gridAutoFlow: 'column',
                    width: trackWidth,
                    transform: `translateX(calc(${translateX}% + ${offset}px))`,
                    transition: isDragging ? 'none' : 'transform 0.4s ease',
                    willChange: 'transform',
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
              )}
            </DraggableTrack>

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
