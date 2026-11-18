import { supabase } from './supabase';
import { loadImage, canvasToBlob } from './imageUtils';

const BUCKET = 'photos';

// Ubah ke JPEG agar file kecil (hemat kuota penyimpanan gratis 1 GB)
async function toJpegBlob(dataUrl: string, maxSide = 1024, quality = 0.88): Promise<Blob> {
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, 'image/jpeg', quality);
}

/**
 * Unggah hasil ke Supabase Storage, kembalikan link publik.
 * Nama file acak (UUID) sehingga link tidak mudah ditebak.
 */
export async function uploadResult(dataUrl: string): Promise<string> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi (cek file .env).');

  const blob = await toJpegBlob(dataUrl);
  const name = `${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(name, blob, { contentType: 'image/jpeg', cacheControl: '3600' });
  if (error) throw error;

  return supabase.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}
