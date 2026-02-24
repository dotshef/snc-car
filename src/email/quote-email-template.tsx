import type { QuickQuoteRequest, QuoteRequest } from '@/types/quote';

// ─── Quick Quote (간편 견적: 위젯/모바일 모달용) ───────────────────────────

interface QuickQuoteEmailTemplateProps {
  data: QuickQuoteRequest;
}

export function QuickQuoteEmailTemplate({ data }: QuickQuoteEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
      <h2 style={{ borderBottom: '2px solid #1a2b5e', paddingBottom: '10px', color: '#1a2b5e' }}>
        간편 견적 문의
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          <Row label="이름" value={data.name} />
          <Row label="연락처" value={data.phone} />
          <Row label="차량명" value={data.carName} />
          <Row label="접수 시각" value={data.submittedAt || '-'} />
        </tbody>
      </table>
    </div>
  );
}

// ─── Full Quote (상세 견적: QuoteModal용) ──────────────────────────────────

interface FullQuoteEmailTemplateProps {
  data: QuoteRequest;
}

export function FullQuoteEmailTemplate({ data }: FullQuoteEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
      <h2 style={{ borderBottom: '2px solid #1a2b5e', paddingBottom: '10px', color: '#1a2b5e' }}>
        견적 문의
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          <Row label="이름" value={data.name} />
          <Row label="연락처" value={data.phone} />
          <Row label="지역" value={data.region} />
          <Row label="유형" value={data.customerType} />
          <Row label="초기자금" value={`${data.initialFundType} ${data.initialFundRate}%`} />
          <Row label="계약기간" value={`${data.contractPeriod}개월`} />
          {data.selectedCarName && <Row label="차종" value={data.selectedCarName} />}
          <Row label="접수 시각" value={data.submittedAt || '-'} />
        </tbody>
      </table>
    </div>
  );
}

// ─── Shared ────────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#555', width: '120px', borderBottom: '1px solid #eee' }}>
        {label}
      </td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
        {value}
      </td>
    </tr>
  );
}
