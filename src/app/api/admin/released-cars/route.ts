import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/webp', 'image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'public-media';

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('released_cars')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  const transformed = (data ?? []).map((row: Record<string, unknown>) => ({
    ...row,
    thumbnail_path: row.thumbnail_path ? getPublicImageUrl(row.thumbnail_path as string) : null,
  }));

  return NextResponse.json({
    data: transformed,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const formData = await request.formData();
  const carName = formData.get('car_name') as string;
  const releasedAt = formData.get('released_at') as string;
  const isVisible = formData.get('is_visible') as string;
  const thumbnail = formData.get('thumbnail') as File | null;

  // Validation
  if (!carName || !carName.trim()) {
    return NextResponse.json({ error: '차량명은 필수입니다' }, { status: 400 });
  }
  if (!releasedAt) {
    return NextResponse.json({ error: '출고일은 필수입니다' }, { status: 400 });
  }
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt) || isNaN(Date.parse(releasedAt))) {
    return NextResponse.json({ error: '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)' }, { status: 400 });
  }

  // Upload thumbnail if provided
  let thumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(thumbnail.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: WebP, PNG, JPG' }, { status: 400 });
    }
    if (thumbnail.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = thumbnail.name.split('.').pop() || 'png';
    const uuid = crypto.randomUUID();
    thumbnailPath = `released-cars/${uuid}/thumb.${ext}`;

    const arrayBuffer = await thumbnail.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(thumbnailPath, arrayBuffer, { contentType: thumbnail.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  // DB insert
  const { data: inserted, error: dbError } = await supabase
    .from('released_cars')
    .insert({
      car_name: carName.trim(),
      thumbnail_path: thumbnailPath,
      released_at: releasedAt,
      is_visible: isVisible === 'true',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (dbError) {
    if (thumbnailPath) {
      await supabase.storage.from(BUCKET).remove([thumbnailPath]);
    }
    return NextResponse.json({ error: 'DB 저장 실패: ' + dbError.message }, { status: 500 });
  }

  const transformed = {
    ...inserted,
    thumbnail_path: inserted.thumbnail_path ? getPublicImageUrl(inserted.thumbnail_path) : null,
  };

  return NextResponse.json({ data: transformed }, { status: 201 });
}
