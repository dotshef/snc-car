export function getPublicImageUrl(path: string): string {
  const supabaseUrl = process.env.SUPABASE_URL || '';
  return `${supabaseUrl}/storage/v1/object/public/public-media/${path}`;
}
