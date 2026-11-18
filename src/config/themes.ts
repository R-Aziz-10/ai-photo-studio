// ============================================================
// TEMA DUNIA AI
// Menambah tema: salin satu objek, ganti id/name/desc/icon/prompt.
// icon = nama kelas Font Awesome (https://fontawesome.com/icons)
// Prompt paling bagus ditulis dalam bahasa Inggris.
// ============================================================
export type Theme = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  iconBox: string;
  prompt: string;
};

// id khusus untuk "Tema Kustom" (teks ditulis sendiri oleh pengunjung)
export const CUSTOM_THEME_ID = 'custom';

export const THEMES: Theme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    desc: 'Kota neon masa depan & hologram',
    icon: 'fa-city',
    iconBox: 'bg-cyber-purple/20 text-cyber-neon',
    prompt:
      'Transform the photo into a cinematic cyberpunk portrait: a sleek futuristic techwear jacket with glowing neon collar accents, a rainy futuristic night metropolis with vibrant magenta and cyan neon bokeh lights, holographic signs, dramatic film-grade lighting, ultra detailed.',
  },
  {
    id: 'forest',
    name: 'Hutan Ajaib',
    desc: 'Hutan misterius, cahaya & kunang-kunang',
    icon: 'fa-tree',
    iconBox: 'bg-emerald-500/20 text-emerald-400',
    prompt:
      'Transform the photo into a magical enchanted-forest portrait: ancient mossy trees, golden sunbeams through the canopy, emerald foliage, floating fireflies, soft mist, fantasy atmosphere, ultra detailed.',
  },
  {
    id: 'sea',
    name: 'Dunia Laut',
    desc: 'Atlantis bawah laut & cahaya biru',
    icon: 'fa-water',
    iconBox: 'bg-cyan-500/20 text-cyan-300',
    prompt:
      'Transform the photo into an underwater Atlantis portrait: sunlit surface shimmer, glowing bioluminescent sea creatures, ancient coral ruins, floating bubbles, aqua and deep-blue light, ultra detailed.',
  },
  {
    id: 'anime',
    name: 'Anime',
    desc: 'Ilustrasi anime lukisan tangan, langit dramatis',
    icon: 'fa-cloud-sun',
    iconBox: 'bg-sky-500/20 text-sky-300',
    prompt:
      "Transform the photo into a breathtaking high-budget Japanese anime movie illustration in the style of Makoto Shinkai. Vibrant hand-drawn anime aesthetic, expressive eyes, warm golden-hour sunlight rim lighting, with a picturesque background of dramatic fluffy cumulus clouds and a vivid blue-violet sky.",
  },
  {
    id: 'animation3d',
    name: 'Animasi 3D',
    desc: 'Karakter film animasi 3D yang menggemaskan',
    icon: 'fa-cube',
    iconBox: 'bg-orange-500/20 text-orange-300',
    prompt:
      'Transform the photo into a charming 3D animated feature-film character. Soft subsurface scattering skin texture, expressive stylized 3D eyes, warm studio rim lighting, smooth 3D rendering, vibrant and colorful blurred background.',
  },
  {
    id: 'batik',
    name: 'Batik Modern',
    desc: 'Busana batik elegan, studio heritage',
    icon: 'fa-shirt',
    iconBox: 'bg-amber-500/20 text-amber-300',
    prompt:
      'Transform the photo into an ultra-luxurious portrait of the person wearing bespoke, modern high-fashion Indonesian batik attire with intricate gold and deep sogan brown patterns. Set in a warm, sophisticated modern Indonesian heritage lounge with soft dramatic studio portrait lighting, shallow depth of field, 85mm lens photography.',
  },
  {
    id: 'retro90s',
    name: 'Retro 90-an',
    desc: 'Foto buku tahunan era 1990-an',
    icon: 'fa-compact-disc',
    iconBox: 'bg-fuchsia-500/20 text-fuchsia-300',
    prompt:
      'Transform the photo into an authentic 1990s school yearbook studio portrait, styled with 90s retro fashion (denim jacket or vintage windbreaker) and subtle 90s hair styling. Classic blue and purple geometric neon laser grid studio backdrop, authentic 35mm analog film grain, soft vintage flash photography aesthetic.',
  },
  {
    id: 'rpg',
    name: 'Pahlawan Fantasi',
    desc: 'Zirah ksatria & aura magis',
    icon: 'fa-shield-halved',
    iconBox: 'bg-violet-500/20 text-violet-300',
    prompt:
      'Transform the photo into a legendary high-fantasy hero portrait: ornate elven silver-and-leather armor with a royal cloak and glowing runes, magical floating embers and arcane energy aura, epic cinematic fantasy concept art, dramatic chiaroscuro lighting.',
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    desc: 'Karakter game arcade 16-bit',
    icon: 'fa-gamepad',
    iconBox: 'bg-lime-500/20 text-lime-300',
    prompt:
      'Transform the photo into a masterfully crafted 16-bit arcade-era pixel art character portrait. Rich vibrant color palette, clean pixel clusters, classic JRPG dialogue portrait aesthetic with a retro starry night sky pixel background.',
  },
  {
    id: 'astronaut',
    name: 'Astronot',
    desc: 'Stasiun luar angkasa & bumi bercahaya',
    icon: 'fa-user-astronaut',
    iconBox: 'bg-indigo-500/20 text-indigo-300',
    prompt:
      'Transform the photo into a cinematic astronaut portrait: a detailed white spacesuit with mission patches and the helmet visor open so the face is fully visible, floating inside a space station with planet Earth glowing through the window, soft rim light, realistic sci-fi film look.',
  },
  {
    id: 'comic',
    name: 'Komik Pahlawan',
    desc: 'Pop-art komik dengan garis tebal',
    icon: 'fa-bolt',
    iconBox: 'bg-yellow-400/20 text-yellow-300',
    prompt:
      'Transform the photo into a bold pop-art comic book hero illustration: thick ink outlines, halftone dots, vivid primary colors, a dynamic action background with speech-bubble style bursts, a dramatic heroic pose.',
  },
  {
    id: 'watercolor',
    name: 'Cat Air',
    desc: 'Lukisan cat air lembut & bunga pastel',
    icon: 'fa-paintbrush',
    iconBox: 'bg-rose-500/20 text-rose-300',
    prompt:
      'Transform the photo into a delicate hand-painted watercolor portrait: soft translucent washes, visible paper texture, gentle ink linework, pastel flowers and color bleeds around the edges.',
  },
  {
    id: 'executive',
    name: 'Profesional',
    desc: 'Pas foto formal ala kantor modern',
    icon: 'fa-user-tie',
    iconBox: 'bg-slate-500/20 text-slate-200',
    prompt:
      'Transform the photo into a world-class corporate executive headshot: a tailored dark navy designer business suit with a crisp shirt, a softly blurred modern high-rise executive office with warm natural daylight, crisp studio key light, professional DSLR portrait.',
  },
];
