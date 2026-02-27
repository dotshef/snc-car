'use client';

import { useEffect, useRef, useState } from 'react';

export interface DragState {
  offset: number;
  isDragging: boolean;
}

interface DraggableTrackProps {
  onPrev: () => void;
  onNext: () => void;
  /** 슬라이드 전환을 발동하는 최소 드래그 거리 (px). 기본값: 50 */
  threshold?: number;
  className?: string;
  /** render prop: 드래그 상태(offset, isDragging)를 받아 내부 트랙을 렌더링 */
  children: (drag: DragState) => React.ReactNode;
}

/**
 * 클릭 & 드래그(마우스/터치)로 슬라이드를 전환하는 뷰포트 컴포넌트.
 * overflow-hidden 역할을 겸하며, render prop으로 드래그 offset을 내려줌.
 * 사용처: PartnerSection, SaleCarSection, HeroSection(배너)
 */
export default function DraggableTrack({
  onPrev,
  onNext,
  threshold = 50,
  className,
  children,
}: DraggableTrackProps) {
  const [dragState, setDragState] = useState<DragState>({ offset: 0, isDragging: false });

  const viewportRef = useRef<HTMLDivElement>(null);

  // 이벤트 핸들러 내부에서 항상 최신값을 참조하기 위해 ref 사용
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const offsetRef = useRef(0);
  /** null = 아직 미결정, true = 수평 드래그, false = 수직 스크롤 */
  const isHorizontalRef = useRef<boolean | null>(null);

  // 콜백도 ref로 최신값 유지 (useEffect 내 stale closure 방지)
  const onPrevRef = useRef(onPrev);
  const onNextRef = useRef(onNext);
  const thresholdRef = useRef(threshold);
  onPrevRef.current = onPrev;
  onNextRef.current = onNext;
  thresholdRef.current = threshold;

  // ── 드래그 시작 ──────────────────────────────────────────────────
  const startDrag = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
    startYRef.current = clientY;
    offsetRef.current = 0;
    isHorizontalRef.current = null;
    setDragState({ offset: 0, isDragging: true });
  };

  // ── 드래그 종료 ──────────────────────────────────────────────────
  const endDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const offset = offsetRef.current;
    offsetRef.current = 0;
    isHorizontalRef.current = null;

    // offset 리셋과 prev/next 호출을 같은 렌더에 반영:
    // → 브라우저가 "드래그 위치 → 최종 슬라이드 위치"를 하나의 transition으로 처리
    setDragState({ offset: 0, isDragging: false });

    if (Math.abs(offset) >= thresholdRef.current) {
      if (offset < 0) onNextRef.current();
      else onPrevRef.current();
    }
  };

  // ── 마우스 이동 (수평 전용, 방향 체크 불필요) ────────────────────
  const handleMouseMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - startXRef.current;
    offsetRef.current = delta;
    setDragState({ offset: delta, isDragging: true });
  };

  // ── 터치 이동: passive:false 리스너로 수평 드래그 시 스크롤 차단 ─
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.touches[0].clientX - startXRef.current;
      const deltaY = e.touches[0].clientY - startYRef.current;

      // 첫 움직임에서 수평/수직 판별
      if (isHorizontalRef.current === null) {
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          isHorizontalRef.current = Math.abs(deltaX) >= Math.abs(deltaY);
        }
        return; // 방향 확정 전 대기
      }

      if (!isHorizontalRef.current) return; // 수직 스크롤 → 그냥 두기

      e.preventDefault(); // 수평 드래그 시 페이지 스크롤 차단
      offsetRef.current = deltaX;
      setDragState({ offset: deltaX, isDragging: true });
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []); // mount/unmount 시에만 등록 (refs로 최신값 참조)

  return (
    <div
      ref={viewportRef}
      className={`overflow-hidden select-none ${className ?? ''}`}
      style={{ cursor: dragState.isDragging ? 'grabbing' : 'grab' }}
      // 마우스 이벤트
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
      onMouseMove={(e) => handleMouseMove(e.clientX)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      // 터치 이벤트 (move는 useEffect의 non-passive 리스너로 처리)
      onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
    >
      {children(dragState)}
    </div>
  );
}
