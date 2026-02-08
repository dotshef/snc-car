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
    .from('sale_cars')
    .select('*, manufacturers(name)', { count: 'exact' })
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
  const manufacturerId = formData.get('manufacturer_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const rentPrice = formData.get('rent_price') as string;
  const leasePrice = formData.get('lease_price') as string;
  const badgesRaw = formData.get('badges') as string;
  const isVisible = formData.get('is_visible') as string;
  const thumbnail = formData.get('thumbnail') as File | null;

  // Validation
  if (!manufacturerId) {
    return NextResponse.json({ error: '제조사를 선택해주세요' }, { status: 400 });
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ error: '차량명은 필수입니다' }, { status: 400 });
  }

  // Verify manufacturer exists
  const { data: mfr } = await supabase
    .from('manufacturers')
    .select('manufacturer_id')
    .eq('manufacturer_id', parseInt(manufacturerId, 10))
    .single();

  if (!mfr) {
    return NextResponse.json({ error: '존재하지 않는 제조사입니다' }, { status: 400 });
  }

  // Parse badges
  let badges: string[] = [];
  if (badgesRaw) {
    try {
      badges = JSON.parse(badgesRaw);
    } catch {
      badges = [];
    }
  }

  // Parse prices
  const parsedRentPrice = rentPrice && rentPrice.trim() !== '' ? parseInt(rentPrice, 10) : null;
  const parsedLeasePrice = leasePrice && leasePrice.trim() !== '' ? parseInt(leasePrice, 10) : null;

  // Upload thumbnail if provided
  let thumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(thumbnail.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: WebP, PNG, JPG' }, { status: 400 });
    }
    if (thumbnail.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = thumbnail.name.split('.').pop() || 'webp';
    const uuid = crypto.randomUUID();
    thumbnailPath = `sale-cars/${uuid}/thumb.${ext}`;

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
    .from('sale_cars')
    .insert({
      manufacturer_id: parseInt(manufacturerId, 10),
      name: name.trim(),
      description: description?.trim() || null,
      thumbnail_path: thumbnailPath,
      rent_price: parsedRentPrice,
      lease_price: parsedLeasePrice,
      badges,
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
