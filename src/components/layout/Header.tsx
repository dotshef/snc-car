'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// 네비게이션 공통 className
const NAV_LINK_CLS =
  'px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base font-semibold text-text-secondary hover:text-primary transition-colors';
const CTA_BTN_CLS =
  'px-3 py-1.5 lg:px-4 lg:py-2 text-sm lg:text-base font-semibold bg-primary text-white rounded-lg hover:bg-primary transition-all shadow-md';
const PHONE_LINK_CLS =
  'px-3 py-1.5 h-9 lg:px-4 lg:py-2 lg:h-10 text-sm lg:text-base font-medium border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-1';
const MOBILE_NAV_LINK_CLS =
  'block px-4 py-3 text-base font-semibold text-text-secondary hover:text-primary hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentMonth = new Date().getMonth() + 1;

  return (
    <>
    {/* 모바일 메뉴 dimmed overlay */}
    {isMenuOpen && (
      <div
        className="fixed inset-0 z-30 bg-black/40 md:hidden"
        onClick={() => setIsMenuOpen(false)}
      />
    )}
    <header className="sticky top-0 z-40 bg-gradient-to-r from-white via-gray-50 to-white border-b border-border backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="S&C 신차장기렌트리스"
              width={140}
              height={50}
            />
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3">
            <Link href="/#rent-cars" className={NAV_LINK_CLS}>
              장기렌트
            </Link>
            <Link href="/#lease-cars" className={NAV_LINK_CLS}>
              리스
            </Link>
            <Link href="/#immediate-cars" className={NAV_LINK_CLS}>
              {currentMonth}월 즉시출고
            </Link>
            <Link href="/#released-cars" className={NAV_LINK_CLS}>
              출고 내역
            </Link>
            <Link href="/disposal" className={CTA_BTN_CLS}>
              차량반납 상담
            </Link>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 드롭다운 */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 md:hidden border-t border-border bg-white shadow-lg">
          <nav className="container mx-auto px-4 max-w-6xl py-2">
            <Link href="/#rent-cars" className={MOBILE_NAV_LINK_CLS} onClick={() => setIsMenuOpen(false)}>
              장기렌트
            </Link>
            <Link href="/#lease-cars" className={MOBILE_NAV_LINK_CLS} onClick={() => setIsMenuOpen(false)}>
              리스
            </Link>
            <Link href="/#immediate-cars" className={MOBILE_NAV_LINK_CLS} onClick={() => setIsMenuOpen(false)}>
              {currentMonth}월 즉시출고
            </Link>
            <Link href="/#released-cars" className={MOBILE_NAV_LINK_CLS} onClick={() => setIsMenuOpen(false)}>
              출고 내역
            </Link>
            <Link href="/disposal" className={MOBILE_NAV_LINK_CLS} onClick={() => setIsMenuOpen(false)}>
              차량 반납 상담
            </Link>
          </nav>
        </div>
      )}
    </header>
    </>
  );
}
