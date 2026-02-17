import type { DisposalRequest } from '@/types/disposal';

interface DisposalEmailTemplateProps {
  data: DisposalRequest;
}

export function DisposalEmailTemplate({ data }: DisposalEmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px' }}>
      <h2 style={{ borderBottom: '2px solid #1a2b5e', paddingBottom: '10px', color: '#1a2b5e' }}>
        차량 반납 문의
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <tbody>
          <Row label="이름" value={data.name} />
          <Row label="연락처" value={data.phone} />
          <Row label="기존 차량 / 잔여 개월" value={data.currentVehicle || '-'} />
          <Row label="처분 후 희망 차종" value={data.desiredCar || '-'} />
          <Row label="접수 시각" value={data.submittedAt || '-'} />
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={{ padding: '8px 12px', fontWeight: 'bold', color: '#555', width: '140px', borderBottom: '1px solid #eee' }}>
        {label}
      </td>
      <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>
        {value}
      </td>
    </tr>
  );
}
