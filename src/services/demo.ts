import { loadImage } from './imageUtils';

/**
 * MODE DEMO: efek warna sederhana di browser (tanpa AI, tanpa kuota).
 * Aktif bila VITE_DEMO_MODE=true. Hanya untuk menguji tampilan.
 */
export async function simulateResult(sourceDataUrl: string, theme: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 2500));
  const img = await loadImage(sourceDataUrl);

  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext('2d') as CanvasRenderingContext2D;

  if (theme === 'cyberpunk') ctx.filter = 'contrast(1.2) saturate(1.45)';
  else if (theme === 'forest') ctx.filter = 'contrast(1.08) saturate(1.3) brightness(1.04)';
  else ctx.filter = 'contrast(1.12) saturate(1.35) hue-rotate(-10deg)';
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';

  const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
  if (theme === 'cyberpunk') {
    grad.addColorStop(0, 'rgba(168, 85, 247, 0.32)');
    grad.addColorStop(1, 'rgba(0, 255, 204, 0.28)');
  } else if (theme === 'forest') {
    grad.addColorStop(0, 'rgba(253, 224, 71, 0.26)');
    grad.addColorStop(1, 'rgba(6, 78, 59, 0.38)');
  } else {
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    grad.addColorStop(1, 'rgba(15, 23, 42, 0.45)');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, c.width, c.height);

  return c.toDataURL('image/jpeg', 0.85);
}
