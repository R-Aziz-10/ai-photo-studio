import { loadImage, canvasToBlob } from './imageUtils';
import { DEMO_MODE } from '../config/constants';
import { simulateResult } from './demo';

// ============================================================
// LAYANAN AI — satu-satunya tempat yang bicara dengan model gambar.
// Mengganti provider/model? Ubah file ini dan worker/index.js saja.
// ============================================================

const WORKER_URL = ((import.meta.env.VITE_WORKER_URL as string) || '').replace(/\/$/, '');
const EVENT_KEY = (import.meta.env.VITE_EVENT_KEY as string) || '';

// Model FLUX.2 menerima foto acuan maksimal 512x512, jadi foto dipotong persegi (tengah) lalu diperkecil.
async function toSquareBlob(dataUrl: string, size = 512): Promise<Blob> {
  const img = await loadImage(dataUrl);
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  canvas.getContext('2d')!.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  return canvasToBlob(canvas, 'image/png');
}

function friendlyError(raw?: string): string {
  const msg = raw || '';
  if (/neuron|quota|limit|capacity|exceed|429/i.test(msg)) {
    return 'Kuota AI gratis hari ini sudah habis. Kuota akan diisi ulang otomatis pukul 07.00 WIB.';
  }
  if (/tidak diizinkan|unauthor/i.test(msg)) {
    return 'Akses ke server AI ditolak. Periksa VITE_EVENT_KEY di file .env.';
  }
  return msg || 'Gagal menghubungi layanan AI. Silakan coba lagi.';
}

/**
 * Kirim foto + prompt ke Worker, kembalikan hasil sebagai data URL.
 */
export async function generateStyledImage(
  sourceImage: string,
  prompt: string,
  size = 512,
  themeId = 'cyberpunk'
): Promise<string> {
  if (DEMO_MODE) return simulateResult(sourceImage, themeId);

  if (!WORKER_URL) {
    throw new Error('VITE_WORKER_URL belum diisi. Salin .env.example menjadi .env lalu isi alamat Worker.');
  }

  const photo = await toSquareBlob(sourceImage);

  const form = new FormData();
  form.append('image', photo, 'photo.png');
  form.append('prompt', 'Using image 0 as the reference photo of the person. ' + prompt);
  form.append('size', String(size));

  let res: Response;
  try {
    res = await fetch(`${WORKER_URL}/generate`, {
      method: 'POST',
      headers: EVENT_KEY ? { 'X-Event-Key': EVENT_KEY } : undefined,
      body: form,
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server AI. Periksa koneksi internet.');
  }

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error('Respons server AI tidak valid.');
  }

  if (!res.ok || !data.image) {
    throw new Error(friendlyError(data?.error));
  }

  const mime = String(data.image).startsWith('/9j/') ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${data.image}`;
}
