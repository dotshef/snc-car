export default function Footer() {
  return (
    <footer className="bg-secondary-dark text-white py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">S&C 신차장기렌트리스</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>상호명: S&C (대표: )</p>
              <p>사업자등록번호: </p>
              <p>주소: </p>
              <p>대표전화: </p>
              <p>이메일: </p>
            </div>
          </div>

          {/*/!* 링크 *!/*/}
          {/*<div className="md:text-right">*/}
          {/*  <h3 className="text-lg font-bold mb-4">고객 지원</h3>*/}
          {/*  <div className="space-y-2 text-sm">*/}
          {/*    <a*/}
          {/*      href="#"*/}
          {/*      className="block text-white/70 hover:text-white transition-colors"*/}
          {/*    >*/}
          {/*      개인정보처리방침*/}
          {/*    </a>*/}
          {/*    <a*/}
          {/*      href="#"*/}
          {/*      className="block text-white/70 hover:text-white transition-colors"*/}
          {/*    >*/}
          {/*      이용약관*/}
          {/*    </a>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/* 카피라이트 */}
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-white/50">
          <p>&copy; 2026 S&C 신차장기렌트리스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
