// ARSIP: 8 preset gaya dari versi sebelumnya. Tidak dipakai aplikasi.
// Ingin memakai lagi? Salin objek yang diinginkan ke src/config/themes.ts (ganti icon ke kelas Font Awesome).

import { Zap, Sparkles, Palette, Crown, UserCheck, Film, Shield, Gamepad2 } from 'lucide-react';

// ============================================================
// DAFTAR GAYA AI
// Untuk menambah gaya: salin satu objek di bawah, ganti id, name,
// badge, description, icon, color, dan prompt. Selesai.
// (id harus unik, tanpa spasi — dipakai untuk menghitung popularitas)
// ============================================================
export const AI_STYLES = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    badge: 'Futuristik',
    description: 'Kota malam masa depan, lampu neon sibernetik, jaket teknologi tinggi.',
    icon: Zap,
    color: 'from-fuchsia-500 to-cyan-500',
    bgAccent: 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300',
    prompt: 'Transform this person into a high-detail Cyberpunk character portrait. Keep their exact facial features, expression, and head pose. Dress them in a sleek futuristic techwear jacket with glowing neon collar accents and subtle cybernetic facial circuit lines. Background is a rainy futuristic night metropolis with vibrant magenta and cyan neon bokeh lights. Cinematic lighting, photorealistic 8k render.'
  },
  {
    id: 'anime',
    name: 'Anime Makoto Shinkai',
    badge: 'Populer',
    description: 'Visual anime lukisan tangan yang cerah, langit dramatis & awan lembut.',
    icon: Sparkles,
    color: 'from-sky-400 to-indigo-500',
    bgAccent: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
    prompt: 'Transform this selfie into a breathtaking high-budget Japanese anime movie illustration in the style of Makoto Shinkai and Studio Ghibli. Preserve the person\'s pose, hairstyle, glasses if any, and expression accurately. Vibrant hand-drawn anime aesthetic, expressive eyes, warm golden-hour sunlight rim lighting, with a picturesque background of dramatic fluffy cumulus clouds and a vivid blue-violet sky.'
  },
  {
    id: 'pixar',
    name: '3D Pixar / Disney',
    badge: 'Animasi 3D',
    description: 'Karakter film animasi 3D yang ekspresif, pencahayaan lembut & menggemaskan.',
    icon: Palette,
    color: 'from-amber-400 to-orange-500',
    bgAccent: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    prompt: 'Transform this person into a charming 3D animated movie character in Pixar and Disney animation style. Maintain their recognizable facial structure, hairstyle, glasses if any, and expression. Soft subsurface scattering skin texture, expressive stylized 3D eyes, warm studio rim lighting, smooth 3D rendering, vibrant and colorful blurred background.'
  },
  {
    id: 'batik',
    name: 'Batik Eksekutif Modern',
    badge: 'Lokal Pride',
    description: 'Busana Batik tulis kontemporer elegan di studio heritage mewah.',
    icon: Crown,
    color: 'from-yellow-500 to-amber-700',
    bgAccent: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    prompt: 'Transform this photo into an ultra-luxurious portrait of the person wearing bespoke, modern high-fashion Indonesian Batik attire with intricate gold and deep sogan brown patterns. Preserve the person\'s exact face, identity, and expression. Set in a warm, sophisticated modern Indonesian architectural heritage lounge with soft dramatic studio portrait lighting, shallow depth of field, 85mm lens photography.'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Executive',
    badge: 'Profesional',
    description: 'Jas bisnis formal, pencahayaan studio modern, latar kantor mewah.',
    icon: UserCheck,
    color: 'from-blue-500 to-slate-600',
    bgAccent: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    prompt: 'Transform this selfie into a world-class corporate executive headshot for LinkedIn. Keep the person\'s exact facial identity, natural skin texture, and friendly confident expression. Dress them in a tailored dark navy or charcoal designer business suit with a crisp shirt. Background is a softly blurred modern high-rise executive office with warm natural daylight. Crisp studio key light, professional DSLR portrait.'
  },
  {
    id: 'retro90s',
    name: '90s Retro Yearbook',
    badge: 'Vintage',
    description: 'Potret buku tahunan era 1990-an, latar belakang laser & efek film.',
    icon: Film,
    color: 'from-pink-500 to-purple-600',
    bgAccent: 'bg-pink-500/10 border-pink-500/30 text-pink-300',
    prompt: 'Transform this photo into an authentic 1990s high school yearbook studio portrait. Preserve the person\'s face and expression, styled with 90s retro fashion (denim jacket or vintage windbreaker) and subtle 90s hair styling. Classic blue and purple geometric neon laser grid studio backdrop, authentic 35mm analog film grain, soft vintage flash photography aesthetic.'
  },
  {
    id: 'rpg',
    name: 'Fantasy RPG Hero',
    badge: 'Epik',
    description: 'Zirah ksatria atau jubah penyihir abad pertengahan dengan aura magis.',
    icon: Shield,
    color: 'from-emerald-500 to-teal-700',
    bgAccent: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    prompt: 'Transform this person into a legendary high-fantasy RPG hero portrait. Keep their exact facial features and expression recognizable. Dress them in ornate elven silver-and-leather armor with a royal cloak and glowing runes. Magical floating embers and arcane energy aura around them, epic cinematic fantasy concept art, dramatic chiaroscuro lighting, Unreal Engine 5 fidelity.'
  },
  {
    id: 'pixel16bit',
    name: 'Pixel Art 16-Bit',
    badge: 'Retro Game',
    description: 'Potret karakter game arcade era 16-bit yang detail dan nostalgik.',
    icon: Gamepad2,
    color: 'from-green-400 to-emerald-600',
    bgAccent: 'bg-green-500/10 border-green-500/30 text-green-300',
    prompt: 'Transform this selfie into a masterfully crafted 16-bit SNES/arcade era pixel art character portrait. Keep the person\'s distinctive facial features, hair, glasses if any, and pose clearly recognizable in pixel form. Rich vibrant color palette, clean pixel clusters, classicJRPG dialogue portrait aesthetic with a retro starry night sky pixel background.'
  }
];
