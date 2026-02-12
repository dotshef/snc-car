import { PHONE_NUMBER } from '@/data/contact';

export default function Footer() {
  return (
    <footer className="bg-[#2d3748] text-white py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">S&C 신차장기렌트리스</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>상호명: 에쓰엔씨오토홀딩스 (대표: 정성우)</p>
            <p>사업자등록번호: 474-77-00620</p>
            <p>주소: 인천광역시 남동구 호구포로 194, 1116호 (마크원 지식산업센터)</p>
            <p>대표전화: {PHONE_NUMBER}</p>
            <p>이메일: wjdtjddn37@naver.com</p>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          <p>&copy; 2026 S&C 신차장기렌트리스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
