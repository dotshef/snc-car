import { createClient } from '@/lib/supabase/server';
import { getSessionUser } from '@/lib/auth/session';
import { getPublicImageUrl } from '@/lib/supabase/storage';
import { NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = ['image/webp', 'image/png', 'image/jpeg'];
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
  const saleCarId = parseInt(id, 10);

  const { data, error } = await supabase
    .from('sale_cars')
    .select('*, manufacturers(name)')
    .eq('sale_car_id', saleCarId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: '판매차량을 찾을 수 없습니다' }, { status: 404 });
  }

  const transformed = {
    ...data,
    thumbnail_path: getPublicImageUrl(data.thumbnail_path),
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
  const saleCarId = parseInt(id, 10);

  const { data: existing, error: fetchError } = await supabase
    .from('sale_cars')
    .select('*')
    .eq('sale_car_id', saleCarId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '판매차량을 찾을 수 없습니다' }, { status: 404 });
  }

  const formData = await request.formData();
  const manufacturerId = formData.get('manufacturer_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const rentPrice = formData.get('rent_price') as string;
  const leasePrice = formData.get('lease_price') as string;
  const immediate = formData.get('immediate') as string;
  const isVisible = formData.get('is_visible') as string;
  const thumbnail = formData.get('thumbnail') as File | null;

  if (!manufacturerId) {
    return NextResponse.json({ error: '제조사를 선택해주세요' }, { status: 400 });
  }
  if (!name || !name.trim()) {
    return NextResponse.json({ error: '차량명은 필수입니다' }, { status: 400 });
  }

  const parsedRentPrice = rentPrice && rentPrice.trim() !== '' ? parseInt(rentPrice, 10) : null;
  const parsedLeasePrice = leasePrice && leasePrice.trim() !== '' ? parseInt(leasePrice, 10) : null;

  let newThumbnailPath: string | null = null;
  if (thumbnail && thumbnail.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(thumbnail.type)) {
      return NextResponse.json({ error: '허용된 이미지 형식: WebP, PNG, JPG' }, { status: 400 });
    }
    if (thumbnail.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: '이미지 크기는 5MB 이하여야 합니다' }, { status: 400 });
    }

    const ext = thumbnail.name.split('.').pop() || 'webp';
    newThumbnailPath = `sale-cars/${saleCarId}/thumb.${ext}`;

    const arrayBuffer = await thumbnail.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(newThumbnailPath, arrayBuffer, { contentType: thumbnail.type, upsert: true });

    if (uploadError) {
      return NextResponse.json({ error: '이미지 업로드 실패: ' + uploadError.message }, { status: 500 });
    }
  }

  const updateData: Record<string, unknown> = {
    manufacturer_id: parseInt(manufacturerId, 10),
    name: name.trim(),
    description: description?.trim() || null,
    rent_price: parsedRentPrice,
    lease_price: parsedLeasePrice,
    immediate: immediate === 'true',
    is_visible: isVisible === 'true',
    updated_at: new Date().toISOString(),
  };

  if (newThumbnailPath) {
    updateData.thumbnail_path = newThumbnailPath;
  }

  const { data: updated, error: dbError } = await supabase
    .from('sale_cars')
    .update(updateData)
    .eq('sale_car_id', saleCarId)
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
    thumbnail_path: getPublicImageUrl(updated.thumbnail_path),
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
  const saleCarId = parseInt(id, 10);

  const { data: existing, error: fetchError } = await supabase
    .from('sale_cars')
    .select('thumbnail_path')
    .eq('sale_car_id', saleCarId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: '판매차량을 찾을 수 없습니다' }, { status: 404 });
  }

  const { error: deleteError } = await supabase
    .from('sale_cars')
    .delete()
    .eq('sale_car_id', saleCarId);

  if (deleteError) {
    return NextResponse.json({ error: 'DB 삭제 실패: ' + deleteError.message }, { status: 500 });
  }

  // Delete image from storage after successful DB delete
  if (existing.thumbnail_path) {
    await supabase.storage.from(BUCKET).remove([existing.thumbnail_path]);
  }

  return NextResponse.json({ message: 'Deleted successfully' });
}
