import type { QuoteRequest } from '@/types/quote';

interface QuoteEmailTemplateProps {
  data: QuoteRequest;
}

export function QuoteEmailTemplate({ data }: QuoteEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
      <h2 style={{ borderBottom: '2px solid #1a2b5e', paddingBottom: '10px', color: '#1a2b5e' }}>
        견적 문의
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          <Row label="희망 차종" value={data.selectedCarName || '-'} />
          <Row label="성함/회사명" value={data.name} />
          <Row label="연락처" value={data.phone} />
          <Row label="지역" value={data.region} />
          <Row label="고객 유형" value={data.customerType} />
          <Row label="초기자금" value={`${data.initialFundType} ${data.initialFundRate}%`} />
          <Row label="계약기간" value={`${data.contractPeriod}개월`} />
          <Row label="접수 시각" value={data.submittedAt || '-'} />
        </tbody>
      </table>
    </div>
  );
}

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
