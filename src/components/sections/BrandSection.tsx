import Image from 'next/image';

export default function BrandSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 모바일: 세로 배치, 텍스트 먼저 → 이미지 */}
        {/* 데스크톱: 가로 배치, 이미지 왼쪽 → 텍스트 오른쪽 */}
        <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
          {/* 이미지 */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <Image
              src="/images/brand.png"
              alt="S&C 신차장기렌트리스 브랜드"
              width={660}
              height={660}
              className="w-full h-auto"
            />
          </div>

          {/* 브랜드 소개 */}
          <div className="w-full md:w-7/12 text-center md:text-left">
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
          </div>
        </div>
      </div>
    </section>
  );
}
