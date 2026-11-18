import { loadImage } from './imageUtils';

/**
 * Ambil frame video + aksesoris AR menjadi satu gambar (data URL JPEG).
 * Jika tampilan cermin aktif, hasil ikut dibalik agar sama persis dengan yang dilihat pengunjung.
 */
export function captureFrame(
  video: HTMLVideoElement,
  overlay: HTMLCanvasElement,
  mirror: boolean,
  maxDim = 768
): string {
  let w = video.videoWidth;
  let h = video.videoHeight;
  const scale = Math.min(1, maxDim / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, w, h);
  if (overlay.width > 0 && overlay.height > 0) {
    ctx.drawImage(overlay, 0, 0, w, h); // overlay memakai orientasi yang sama dengan video mentah
  }
  return canvas.toDataURL('image/jpeg', 0.9);
}

/** Kecilkan foto yang diunggah manual (maks 768 px). */
export async function fileToDataUrl(file: File, maxDim = 768): Promise<string> {
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('File tidak dapat dibaca.'));
    reader.readAsDataURL(file);
  });
  const img = await loadImage(raw);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.9);
}
