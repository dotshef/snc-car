import { createClient } from '@/lib/supabase/server';
import { createSessionCookie } from '@/lib/auth/session';
import { compare } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !body.username || !body.password) {
    return NextResponse.json(
      { success: false, error: '아이디와 비밀번호를 입력해주세요' },
      { status: 400 }
    );
  }

  const { username, password } = body;

  const supabase = createClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error || !user) {
    return NextResponse.json(
      { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 }
    );
  }

  const passwordMatch = await compare(password, user.password);
  if (!passwordMatch) {
    return NextResponse.json(
      { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다' },
      { status: 401 }
    );
  }

  const cookie = createSessionCookie({ id: user.id, username: user.username });

  const response = NextResponse.json({ success: true });
  response.cookies.set(cookie);

  return response;
}
