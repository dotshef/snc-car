import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/svg+xml', 'image/webp', 'image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'public-media';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const transformed = data.map((row: Record<string, unknown>) => ({
    ...row,
    logo_path: row.logo_path ? getPublicImageUrl(row.logo_path as string) : null,
  }));

  return NextResponse.json({ data: transformed });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const formData = await request.formData();
  const code = formData.get('code') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const sortOrder = formData.get('sort_order') as string;
  const isVisible = formData.get('is_visible') as string;
  const logo = formData.get('logo') as File | null;

  // Validation
  if (!code || !code.trim()) {
    return NextResponse.json({ error: 'code는 필수입니다' }, { status: 400 });
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'name은 필수입니다' }, { status: 400 });
  }
  if (!['DOMESTIC', 'IMPORT'].includes(category)) {
    return NextResponse.json({ error: 'category는 DOMESTIC 또는 IMPORT여야 합니다' }, { status: 400 });
  }
  const sortOrderNum = parseInt(sortOrder, 10);
  if (isNaN(sortOrderNum) || sortOrderNum < 0) {
    return NextResponse.json({ error: 'sort_order는 0 이상 정수여야 합니다' }, { status: 400 });
  }

  // Check code uniqueness
  const { data: existing } = await supabase
    .from('manufacturers')
    .select('manufacturer_id')
    .eq('code', code.trim())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: '이미 사용 중인 제조사 코드입니다' }, { status: 409 });
  }

  // Upload logo if provided
  let logoPath: string | null = null;
  if (logo && logo.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(logo.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: SVG, WebP, PNG, JPG' }, { status: 400 });
    }
    if (logo.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = logo.name.split('.').pop() || 'png';
    const uuid = crypto.randomUUID();
    logoPath = `manufacturers/${uuid}/logo.${ext}`;

    const arrayBuffer = await logo.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(logoPath, arrayBuffer, { contentType: logo.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  // DB insert
  const { data: inserted, error: dbError } = await supabase
    .from('manufacturers')
    .insert({
      code: code.trim(),
      name: name.trim(),
      logo_path: logoPath,
      category,
      sort_order: sortOrderNum,
      is_visible: isVisible === 'true',
    })
    .select()
    .single();

  if (dbError) {
    // Compensation: delete uploaded image
    if (logoPath) {
      await supabase.storage.from(BUCKET).remove([logoPath]);
    }
    return NextResponse.json({ error: 'DB 저장 실패: ' + dbError.message }, { status: 500 });
  }

  const transformed = {
    ...inserted,
    logo_path: inserted.logo_path ? getPublicImageUrl(inserted.logo_path) : null,
  };

  return NextResponse.json({ data: transformed }, { status: 201 });
}
