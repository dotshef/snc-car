'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useQuoteModal } from '@/hooks/useQuoteModal';

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
  },
];

export default function HeroSection() {
  const { openModal } = useQuoteModal();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden">
      {banners.map((banner, i) => (
        <div
          key={i}
          className={`${i === 0 ? 'relative' : 'absolute inset-0'} text-white py-20 md:py-40 transition-transform duration-700 ease-in-out`}
          style={{ transform: `translateX(${(i - current) * 100}%)` }}
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

          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="max-w-2xl">
              {/* 타이틀 */}
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {banner.heading}
              </h1>

              {/* 설명 */}
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                {banner.description}
              </p>

              {/* CTA 버튼 */}
              <button
                onClick={() => openModal()}
                className="relative overflow-hidden px-8 py-4 bg-white text-primary-dark font-bold rounded-lg text-lg shadow-lg border border-white/50 hover:bg-primary hover:text-white hover:border-primary before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent hover:before:translate-x-full before:transition-transform before:duration-700 before:ease-in-out"
                style={{
                  transition: 'background-color 0.4s ease 0.25s, color 0.4s ease 0.25s, border-color 0.4s ease 0.25s',
                }}
              >
                무료 견적 받기
              </button>

              {/* 서브 정보 */}
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>전 차종 취급</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>최저가 보장</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>빠른 출고</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 슬라이드 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
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
