import { createHmac } from 'crypto';
import { cookies } from 'next/headers';
import type { UserRow } from '@/types/admin';

const COOKIE_NAME = 'admin-session';
const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret';

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function createSessionCookie(user: { id: number; username: string }) {
  const payload = `${user.id}.${user.username}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;

  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/admin',
    maxAge: 86400, // 24 hours
  };
}

export function parseSessionCookie(cookieValue: string): { id: number; username: string } | null {
  const parts = cookieValue.split('.');
  if (parts.length !== 3) return null;

  const [idStr, username, signature] = parts;
  const payload = `${idStr}.${username}`;
  const expectedSignature = sign(payload);

  if (signature !== expectedSignature) return null;

  const id = parseInt(idStr, 10);
  if (isNaN(id)) return null;

  return { id, username };
}

export async function getSessionUser(): Promise<UserRow | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;

  const parsed = parseSessionCookie(cookie.value);
  if (!parsed) return null;

  return {
    id: parsed.id,
    username: parsed.username,
    nickname: '',
    created_at: '',
    updated_at: '',
  };
}
