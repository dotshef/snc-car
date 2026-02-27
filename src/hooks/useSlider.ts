import { useEffect, useRef, useCallback, useState } from 'react';

export interface SliderBreakpoints {
  lg: number; // >= 1024px
  md: number; // >= 768px
  sm: number; // < 768px
}

interface UseSliderOptions {
  totalCols: number;
  breakpoints: SliderBreakpoints;
  autoPlayInterval?: number;
  /** 'one': 1열씩 이동. 'page': colsVisible만큼 이동. Default: 'one' */
  stepMode?: 'one' | 'page';
}

export interface UseSliderReturn {
  colsVisible: number;
  trackWidth: string;
  translateX: number;
  canGoPrev: boolean;
  canGoNext: boolean;
  handlePrev: () => void;
  handleNext: () => void;
}

function resolveColsVisible(bp: SliderBreakpoints): number {
  if (typeof window === 'undefined') return bp.lg;
  if (window.innerWidth >= 1024) return bp.lg;
  if (window.innerWidth >= 768) return bp.md;
  return bp.sm;
}

export function useSlider({
  totalCols,
  breakpoints,
  autoPlayInterval,
  stepMode = 'one',
}: UseSliderOptions): UseSliderReturn {
  const [currentCol, setCurrentCol] = useState(0);
  const [colsVisible, setColsVisible] = useState(breakpoints.lg);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 항상 최신값을 참조 (stale closure 방지)
  const totalColsRef = useRef(totalCols);
  const breakpointsRef = useRef(breakpoints);
  totalColsRef.current = totalCols;
  breakpointsRef.current = breakpoints;

  const isAutoPlay = !!autoPlayInterval;

  // ── 리사이즈: mount 시 1회 등록, refs로 항상 최신값 사용 ─────────
  useEffect(() => {
    const update = () => {
      const next = resolveColsVisible(breakpointsRef.current);
      setColsVisible(next);
      setCurrentCol((prev) => Math.min(prev, Math.max(0, totalColsRef.current - next)));
    };
    update(); // 초기 실행
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── totalCols 변경 시 처음으로 리셋 (mount 시 스킵) ─────────────
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setCurrentCol(0);
  }, [totalCols]);

  // ── 이동 ─────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentCol((prev) => {
      const cols = resolveColsVisible(breakpointsRef.current);
      const step = stepMode === 'page' ? cols : 1;
      const maxCol = Math.max(0, totalColsRef.current - cols);
      const next = prev + step;
      return next > maxCol ? (isAutoPlay ? 0 : maxCol) : next;
    });
  }, [stepMode, isAutoPlay]);

  const goPrev = useCallback(() => {
    setCurrentCol((prev) => {
      const cols = resolveColsVisible(breakpointsRef.current);
      const step = stepMode === 'page' ? cols : 1;
      const maxCol = Math.max(0, totalColsRef.current - cols);
      const next = prev - step;
      return next < 0 ? (isAutoPlay ? maxCol : 0) : next;
    });
  }, [stepMode, isAutoPlay]);

  // ── 자동 재생 ────────────────────────────────────────────────────
  const startAutoSlide = useCallback(() => {
    if (!autoPlayInterval) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, autoPlayInterval);
  }, [goNext, autoPlayInterval]);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  const handlePrev = useCallback(() => {
    goPrev();
    if (isAutoPlay) startAutoSlide();
  }, [goPrev, isAutoPlay, startAutoSlide]);

  const handleNext = useCallback(() => {
    goNext();
    if (isAutoPlay) startAutoSlide();
  }, [goNext, isAutoPlay, startAutoSlide]);

  const maxCol = Math.max(0, totalCols - colsVisible);
  const stepPct = totalCols > 0 ? 100 / totalCols : 0;

  return {
    colsVisible,
    trackWidth: `${totalCols > 0 ? (totalCols / colsVisible) * 100 : 100}%`,
    translateX: -(currentCol * stepPct),
    canGoPrev: currentCol > 0,
    canGoNext: currentCol < maxCol,
    handlePrev,
    handleNext,
  };
}
