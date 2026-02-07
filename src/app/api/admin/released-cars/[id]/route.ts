import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/webp', 'image/png', 'image/jpeg'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'public-media';

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
  const releasedCarId = parseInt(id, 10);

  const { data: existing, error: fetchError } = await supabase
    .from('released_cars')
    .select('*')
    .eq('released_car_id', releasedCarId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '출고차량을 찾을 수 없습니다' }, { status: 404 });
  }

  const formData = await request.formData();
  const carName = formData.get('car_name') as string;
  const releasedAt = formData.get('released_at') as string;
  const isVisible = formData.get('is_visible') as string;
  const thumbnail = formData.get('thumbnail') as File | null;

  if (!carName || !carName.trim()) {
    return NextResponse.json({ error: '차량명은 필수입니다' }, { status: 400 });
  }
  if (!releasedAt) {
    return NextResponse.json({ error: '출고일은 필수입니다' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releasedAt) || isNaN(Date.parse(releasedAt))) {
    return NextResponse.json({ error: '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)' }, { status: 400 });
  }

  let newThumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(thumbnail.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: WebP, PNG, JPG' }, { status: 400 });
    }
    if (thumbnail.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = thumbnail.name.split('.').pop() || 'png';
    newThumbnailPath = `released-cars/${releasedCarId}/thumb.${ext}`;

    const arrayBuffer = await thumbnail.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newThumbnailPath, arrayBuffer, { contentType: thumbnail.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  const updateData: Record<string, unknown> = {
    car_name: carName.trim(),
    released_at: releasedAt,
    is_visible: isVisible === 'true',
    updated_at: new Date().toISOString(),
  };

  if (newThumbnailPath) {
    updateData.thumbnail_path = newThumbnailPath;
  }

  const { data: updated, error: dbError } = await supabase
    .from('released_cars')
    .update(updateData)
    .eq('released_car_id', releasedCarId)
    .select()
    .single();

  if (dbError) {
    if (newThumbnailPath) {
      await supabase.storage.from(BUCKET).remove([newThumbnailPath]);
    }
    return NextResponse.json({ error: 'DB 수정 실패: ' + dbError.message }, { status: 500 });
  }

  const transformed = {
    ...updated,
    thumbnail_path: updated.thumbnail_path ? getPublicImageUrl(updated.thumbnail_path) : null,
  };

  return NextResponse.json({ data: transformed });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = createClient();

  const { id } = await params;
  const releasedCarId = parseInt(id, 10);

  const { data: existing, error: fetchError } = await supabase
    .from('released_cars')
    .select('thumbnail_path')
    .eq('released_car_id', releasedCarId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '출고차량을 찾을 수 없습니다' }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from('released_cars')
    .delete()
    .eq('released_car_id', releasedCarId);

  if (deleteError) {
    return NextResponse.json({ error: 'DB 삭제 실패: ' + deleteError.message }, { status: 500 });
  }

  if (existing.thumbnail_path) {
    await supabase.storage.from(BUCKET).remove([existing.thumbnail_path]);
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}
