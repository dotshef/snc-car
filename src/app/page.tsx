import HeroSection from '@/components/sections/HeroSection';
import SaleCarSection from '@/components/sections/SaleCarSection';
import StrengthSection from '@/components/sections/StrengthSection';
import ReleasedCarSection from '@/components/sections/ReleasedCarSection';
import FAQSection from '@/components/sections/FAQSection';
import BrandSection from '@/components/sections/BrandSection';
import PartnerSection from '@/components/sections/PartnerSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* 히어로 섹션 */}
      <HeroSection />

      {/* 장기렌트 (국산차) 섹션 */}
      <SaleCarSection sectionId="rent-cars" title="장기렌트" category="DOMESTIC" />

      {/* 리스 (수입차) 섹션 */}
      <SaleCarSection sectionId="lease-cars" title="리스" category="IMPORT" />

      {/* 즉시출고 섹션 */}
      <SaleCarSection sectionId="immediate-cars" title="즉시출고" immediateOnly />

        {/* 파트너사 섹션 */}
        <PartnerSection />

      {/* S&C 강점 섹션 */}
      <StrengthSection />

      {/* 출고 내역 섹션 */}
      <ReleasedCarSection />

      {/* FAQ 섹션 */}
      <FAQSection />

      {/* 브랜드 소개 섹션 */}
      <BrandSection />
    </main>
  );
}
