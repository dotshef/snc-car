'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import DraggableTrack from '@/components/ui/DraggableTrack';

const banners = [
  {
    image: '/images/banner.png',
    alt: '배너 배경',
    heading: (
      <>
        신차 장기 렌트 & 리스<br />
        S&C와 함께하세요
      </>
    ),
    description: (
      <>
        합리적인 가격, 믿을 수 있는 서비스<br />
        국산차부터 수입차까지 다양한 차량을 만나보세요
      </>
    ),
  },
  {
    image: '/images/banner-2.png',
    alt: '배너 2 배경',
    heading: (
      <>
        렌트/리스 남은 기간 걱정 NO!<br />
        차량 처분 후 신차 출고까지!
      </>
    ),
    description: (
      <>
        합리적인 가격, 믿을 수 있는 서비스<br />
        국산차부터 수입차까지 다양한 차량을 만나보세요
      </>
    ),
    ctaLabel: '차량 반납 상담',
    ctaLink: '/disposal',
  },
];

const TOTAL = banners.length;
// 트랙 너비 = 배너 수 × 100vw
const TRACK_WIDTH = `${TOTAL * 100}%`;
// 각 배너 너비 = 트랙의 1/TOTAL (= 뷰포트 100%)
const BANNER_WIDTH = `${100 / TOTAL}%`;

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % TOTAL);
  }, []);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + TOTAL) % TOTAL);
  }, []);

  // 자동 재생 타이머 (드래그·도트 클릭 시 리셋)
  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 10000);
  }, [goNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer]);

  const handlePrev = useCallback(() => { goPrev(); resetTimer(); }, [goPrev, resetTimer]);
  const handleNext = useCallback(() => { goNext(); resetTimer(); }, [goNext, resetTimer]);

  // translateX: 현재 배너 = -(current / TOTAL) × 100% (트랙 기준 %)
  const translateXPct = -(current / TOTAL) * 100;

  return (
    <section className="relative">
      {/* 드래그 가능 배너 뷰포트 */}
      <DraggableTrack onPrev={handlePrev} onNext={handleNext} threshold={80}>
        {({ offset, isDragging }) => (
          <div
            style={{
              display: 'flex',
              width: TRACK_WIDTH,
              transform: `translateX(calc(${translateXPct}% + ${offset}px))`,
              transition: isDragging
                ? 'none'
                : 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              willChange: 'transform',
            }}
          >
            {banners.map((banner, i) => (
              <div
                key={i}
                className="relative text-white py-20 md:py-40 flex-shrink-0"
                style={{ width: BANNER_WIDTH }}
              >
                {/* 배경 이미지 */}
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-black/40" />

                {/* 콘텐츠 */}
                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                      {banner.heading}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                      {banner.description}
                    </p>

                    <button
                      onClick={() => router.push(banner.ctaLink ?? '/#rent-cars')}
                      className="relative overflow-hidden px-8 py-4 bg-white text-primary-dark font-bold rounded-lg text-lg shadow-lg border border-white/50 hover:bg-primary hover:text-white hover:border-primary before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
                      style={{
                        transition: 'background-color 0.4s ease 0.25s, color 0.4s ease 0.25s, border-color 0.4s ease 0.25s',
                      }}
                    >
                      {banner.ctaLabel ?? '무료 견적 받기'}
                    </button>

                    <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
                      {['전 차종 취급', '최저가 보장', '빠른 출고'].map((label) => (
                        <div key={label} className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DraggableTrack>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetTimer(); }}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === current ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`배너 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
