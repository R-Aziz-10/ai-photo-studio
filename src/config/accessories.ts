import {
  drawGlasses, drawComms, drawCrown,
  drawGraduationCap, drawMerahPutih, drawCatEars, drawRoundGlasses, drawSunglasses,
  drawHalo, drawWizardHat, drawFlowerCrown, drawHeroMask, drawMustache,
  computeGeometry,
} from '../ar/drawAccessories';
import type { DrawFn, Landmark } from '../ar/drawAccessories';

// ============================================================
// DAFTAR AKSESORI AR
// Menambah aksesoris baru:
//   1. Tulis fungsi gambarnya di src/ar/drawAccessories.ts (contoh: drawGlasses)
//   2. Tambahkan satu objek di bawah.
// promptHint = kalimat untuk AI agar aksesoris tetap muncul di hasil akhir.
// icon = kelas Font Awesome.
// ============================================================
export type Accessory = {
  id: string;
  name: string;
  sub: string;
  icon: string;
  iconBox: string;
  promptHint: string;
  draw?: DrawFn;
};

export const ACCESSORIES: Accessory[] = [
  {
    id: 'none',
    name: 'Tanpa Aksesoris',
    sub: 'Original Face',
    icon: 'fa-ban',
    iconBox: 'bg-slate-700 text-slate-300',
    promptHint: '',
  },
  {
    id: 'glasses',
    name: 'Kacamata Visor',
    sub: 'Cyber-Neon HUD',
    icon: 'fa-glasses',
    iconBox: 'bg-cyber-purple/20 text-cyber-purple',
    promptHint:
      'The person wears futuristic neon cyber-visor glasses with angular purple and cyan lenses. Keep these glasses clearly visible on the face.',
    draw: drawGlasses,
  },
  {
    id: 'comms',
    name: 'Alat Komunikasi',
    sub: 'Cyberpunk Earpiece',
    icon: 'fa-headset',
    iconBox: 'bg-cyber-neon/20 text-cyber-neon',
    promptHint:
      'The person wears a tactical cyberpunk earpiece with glowing antennas and a boom microphone extending toward the cheek. Keep it clearly visible.',
    draw: drawComms,
  },
  {
    id: 'crown',
    name: 'Mahkota Kristal',
    sub: 'Holographic Aura',
    icon: 'fa-crown',
    iconBox: 'bg-amber-400/20 text-amber-300',
    promptHint:
      'A floating holographic crystal crown with gold, cyan and purple crystals hovers above the person\'s head. Keep it clearly visible.',
    draw: drawCrown,
  },
  {
    id: 'graduation',
    name: 'Topi Wisuda',
    sub: 'Toga & jumbai emas',
    icon: 'fa-graduation-cap',
    iconBox: 'bg-slate-500/20 text-slate-200',
    promptHint: 'The person wears a black graduation mortarboard cap with a golden tassel. Keep it clearly visible on the head.',
    draw: drawGraduationCap,
  },
  {
    id: 'merahputih',
    name: 'Ikat Kepala Merah Putih',
    sub: 'Semangat Indonesia',
    icon: 'fa-flag',
    iconBox: 'bg-red-500/20 text-red-300',
    promptHint: 'The person wears a red-and-white headband across the forehead. Keep it clearly visible.',
    draw: drawMerahPutih,
  },
  {
    id: 'catears',
    name: 'Telinga Kucing',
    sub: 'Bando manis',
    icon: 'fa-cat',
    iconBox: 'bg-pink-400/20 text-pink-300',
    promptHint: 'The person wears a cute black cat-ear headband with pink inner ears. Keep it clearly visible.',
    draw: drawCatEars,
  },
  {
    id: 'roundglasses',
    name: 'Kacamata Bulat',
    sub: 'Klasik berbingkai emas',
    icon: 'fa-glasses',
    iconBox: 'bg-amber-500/20 text-amber-300',
    promptHint: 'The person wears round gold-framed glasses. Keep them clearly visible.',
    draw: drawRoundGlasses,
  },
  {
    id: 'sunglasses',
    name: 'Kacamata Hitam',
    sub: 'Gaya santai',
    icon: 'fa-sun',
    iconBox: 'bg-slate-600/30 text-slate-200',
    promptHint: 'The person wears stylish black sunglasses. Keep them clearly visible.',
    draw: drawSunglasses,
  },
  {
    id: 'halo',
    name: 'Lingkaran Cahaya',
    sub: 'Halo malaikat',
    icon: 'fa-circle-notch',
    iconBox: 'bg-yellow-400/20 text-yellow-300',
    promptHint: 'A glowing golden halo ring floats above the person\'s head. Keep it clearly visible.',
    draw: drawHalo,
  },
  {
    id: 'wizardhat',
    name: 'Topi Penyihir',
    sub: 'Bertabur bintang',
    icon: 'fa-hat-wizard',
    iconBox: 'bg-violet-500/20 text-violet-300',
    promptHint: 'The person wears a tall purple wizard hat decorated with golden stars. Keep it clearly visible.',
    draw: drawWizardHat,
  },
  {
    id: 'flowercrown',
    name: 'Mahkota Bunga',
    sub: 'Segar & ceria',
    icon: 'fa-seedling',
    iconBox: 'bg-emerald-500/20 text-emerald-300',
    promptHint: 'The person wears a colorful flower crown of pink, white and yellow flowers on the head. Keep it clearly visible.',
    draw: drawFlowerCrown,
  },
  {
    id: 'heromask',
    name: 'Topeng Pahlawan',
    sub: 'Superhero merah',
    icon: 'fa-mask',
    iconBox: 'bg-rose-500/20 text-rose-300',
    promptHint: 'The person wears a red superhero eye mask. Keep it clearly visible.',
    draw: drawHeroMask,
  },
  {
    id: 'mustache',
    name: 'Kumis Tebal',
    sub: 'Ala tuan terhormat',
    icon: 'fa-face-smile',
    iconBox: 'bg-orange-500/20 text-orange-300',
    promptHint: 'The person has a thick stylish handlebar mustache. Keep it clearly visible.',
    draw: drawMustache,
  },
];

/** Gambar aksesoris terpilih di canvas overlay. */
export function renderAccessory(
  ctx: CanvasRenderingContext2D,
  id: string,
  landmarks: Landmark[],
  w: number,
  h: number
) {
  const acc = ACCESSORIES.find((a) => a.id === id);
  if (!acc || !acc.draw) return;
  const geometry = computeGeometry(landmarks, w, h);
  ctx.save();
  acc.draw(ctx, geometry, performance.now() * 0.005);
  ctx.restore();
}
