import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/svg+xml', 'image/webp', 'image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'public-media';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { id } = await params;
  const manufacturerId = parseInt(id, 10);

  const { data, error } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('manufacturer_id', manufacturerId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '제조사를 찾을 수 없습니다' }, { status: 404 });
  }

  const transformed = {
    ...data,
    logo_path: getPublicImageUrl(data.logo_path),
  };

  return NextResponse.json({ data: transformed });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { id } = await params;
  const manufacturerId = parseInt(id, 10);

  // Fetch existing record
  const { data: existing, error: fetchError } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('manufacturer_id', manufacturerId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '제조사를 찾을 수 없습니다' }, { status: 404 });
  }

  const formData = await request.formData();
  const code = formData.get('code') as string;
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
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

  // Check code uniqueness (excluding current)
  const { data: duplicate } = await supabase
    .from('manufacturers')
    .select('manufacturer_id')
    .eq('code', code.trim())
    .neq('manufacturer_id', manufacturerId)
    .maybeSingle();

  if (duplicate) {
    return NextResponse.json({ error: '이미 사용 중인 제조사 코드입니다' }, { status: 409 });
  }

  // Upload new logo if provided
  let newLogoPath: string | null = null;
  if (logo && logo.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(logo.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: SVG, WebP, PNG, JPG' }, { status: 400 });
    }
    if (logo.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = logo.name.split('.').pop() || 'png';
    newLogoPath = `manufacturers/${manufacturerId}/logo.${ext}`;

    const arrayBuffer = await logo.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newLogoPath, arrayBuffer, { contentType: logo.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  // DB update
  const updateData: Record<string, unknown> = {
    code: code.trim(),
    name: name.trim(),
    category,
    is_visible: isVisible === 'true',
    updated_at: new Date().toISOString(),
  };

  if (newLogoPath) {
    updateData.logo_path = newLogoPath;
  }

  const { data: updated, error: dbError } = await supabase
    .from('manufacturers')
    .update(updateData)
    .eq('manufacturer_id', manufacturerId)
    .select()
    .single();

  if (dbError) {
    // Compensation: delete newly uploaded image
    if (newLogoPath) {
      await supabase.storage.from(BUCKET).remove([newLogoPath]);
    }
    return NextResponse.json({ error: 'DB 수정 실패: ' + dbError.message }, { status: 500 });
  }

  const transformed = {
    ...updated,
    logo_path: getPublicImageUrl(updated.logo_path),
  };

  return NextResponse.json({ data: transformed });
}
