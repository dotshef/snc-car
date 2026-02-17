import { Resend } from 'resend';
import { QuoteEmailTemplate } from '@/email/quote-email-template';
import { DisposalEmailTemplate } from '@/email/disposal-email-template';
import type { QuoteRequest } from '@/types/quote';
import type { DisposalRequest } from '@/types/disposal';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'SNC 오토 <no-reply@dotshef.com>'; // TODO 고객 도메인으로 변경
const TO = ['wjdtjddn37@naver.com'];

type SendRequestBody =
  | { type: 'quote'; data: QuoteRequest }
  | { type: 'disposal'; data: DisposalRequest };

export async function POST(request: Request) {
  try {
    const body: SendRequestBody = await request.json();

    let subject: string;
    let reactElement: React.ReactElement;

    if (body.type === 'quote') {
      subject = `[S&C 문의] ${body.data.name} 견적 문의합니다.`;
      reactElement = QuoteEmailTemplate({ data: body.data });
    } else if (body.type === 'disposal') {
      subject = `[S&C 문의] ${body.data.name} 차량 반납 문의합니다.`;
      reactElement = DisposalEmailTemplate({ data: body.data });
    } else {
      console.error('[send] Invalid type:', (body as Record<string, unknown>).type);
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject,
      react: reactElement,
    });

    if (error) {
      console.error('[send] Resend error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[send] Caught error:', message, error);
    return Response.json({ error: message }, { status: 500 });
  }
}
