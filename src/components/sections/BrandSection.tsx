import Image from 'next/image';
import FadeInUp from '../animation/FadeInUp';
import { PHONE_NUMBER } from '@/data/contact';


export default function BrandSection() {
  return (
    <section className="bg-white">

      {/* ── 브랜드 스토리 ── */}
      <div className="pt-12 md:py-5">
        <div className="container mx-auto px-4 max-w-6xl">

            <div className="flex flex-col-reverse md:flex-row items-center gap-4 md:gap-16">
              {/* 브랜드 이미지 */}
              <FadeInUp delay={0} className="w-full md:w-5/12 flex-shrink-0">
                <Image
                  src="/images/brand.png"
                  alt="S&C 신차장기렌트리스 브랜드"
                  width={660}
                  height={660}
                  className="w-full h-auto"
                />
              </FadeInUp>

              {/* 브랜드 소개 텍스트 */}
              <FadeInUp delay={100} className="w-full md:w-7/12 text-center md:text-left">
                <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-3">
                  Brand Story
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2 leading-snug">
                  변하지 않는 기준, 함께 가는 동반자
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  STEAD &middot; 꾸준함, 변하지 않는 기준 &nbsp;|&nbsp; &CO &middot; 동반자로 함께 간다
                </p>
                <div className="space-y-4 text-sm md:text-base text-text-secondary font-semibold leading-relaxed text-center md:text-left">
                  <p>
                    저희 <span className="text-accent">S&C 신차장기렌트리스</span>는
                    변하지 않는 기준으로 함께 간다는 뜻입니다.
                  </p>
                  <p>
                    무분별하게 마케팅에 집중하지 않고 투명하게
                    한 번의 계약이 아닌 오래가는 선택을
                    추구하고 변치 않는 마음으로 끊임없이 발전하는 모습을 보여드리겠습니다.
                  </p>
                  <p>
                    차량은 한 번의 출고가 아닌, 출고 후 사후관리가 더 중요합니다.
                  </p>
                  <p className="text-accent">
                    고객님들의 마음속에 떠오르는 기준이 되겠습니다.
                  </p>
                </div>
              </FadeInUp>
            </div>

        </div>
      </div>

      {/* ── 업체 정보 + 지도 (Footer 영역) ── */}
      <div className="py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col-reverse sm:flex-row sm:gap-8 sm:items-center">

            {/* ── 왼쪽: 텍스트 내용 ── */}
            <div className="flex-1 flex flex-col gap-6">

              {/* 업체 정보 */}
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-1 sm:gap-x-10">
                  <p><span className="font-bold text-text-primary">업체</span> <span className="text-text-secondary">에쓰엔씨오토홀딩스</span></p>
                  <p><span className="font-bold text-text-primary">대표자</span> <span className="text-text-secondary">정성우</span></p>
                </div>
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-y-1 sm:gap-x-10">
                  <p><span className="font-bold text-text-primary">사업자등록번호</span> <span className="text-text-secondary">474-77-00620</span></p>
                  <p><span className="font-bold text-text-primary">이메일</span> <span className="text-text-secondary">wjdtjddn37@naver.com</span></p>
                </div>
                <p><span className="font-bold text-text-primary">주소</span> <span className="text-text-secondary">인천광역시 남동구 호구포로 194, 1116호 (마크원 지식산업센터)</span></p>
              </div>

              {/* 고객센터 + 상담 안내 (모바일 숨김) */}
              <div className="hidden sm:flex flex-row items-center">
                <div>
                  <p className="text-xs text-text-muted mb-1">고객센터</p>
                  <p className="text-2xl font-bold text-text-primary tracking-wide">{PHONE_NUMBER}</p>
                  <p className="text-xs text-text-muted mt-1">연중무휴 24시간 상담가능</p>
                </div>
                <div className="w-px bg-border mx-6 self-stretch" />
                <div className="text-xs space-y-1 text-text-secondary">
                  <p>카카오톡 / 전화상담 편안하게 연락주세요.</p>
                  <p>24시간 연중무휴 상담 가능합니다.</p>
                </div>
              </div>

            </div>

            {/* ── 오른쪽: 지도 이미지 ── */}
            {/* 반응형 너비: w-[모바일] sm:w-[sm] md:w-[md] */}
            <div className="w-full md:w-[400px] lg:w-[500px] mb-8 sm:mb-0 flex-shrink-0">
              <Image
                src="/images/map.png"
                alt="오시는 길"
                width={600}
                height={400}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
