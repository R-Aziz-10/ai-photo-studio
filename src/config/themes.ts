// ============================================================
// TEMA DUNIA AI (15 tema)
// Menambah tema: salin satu objek, ganti id/name/desc/group/prompt.
// bg = warna cadangan kartu. preview = gambar kartu: taruh file di public/themes/<id>.jpg
// (selama file belum ada, kartu hanya menampilkan warna bg).
// Prompt paling bagus ditulis dalam bahasa Inggris.
// ============================================================
export type Theme = {
  id: string;
  name: string;
  desc: string;
  group: string; // Spesial | Viral | Pahlawan | Anime | Profesi | Seni | Budaya
  bg: string; // warna latar thumbnail
  prompt: string;
  pinned?: boolean; // disematkan di paling atas
  preview?: string; // gambar kartu, mis. '/themes/dokter-hebat.jpg'
};

// id khusus untuk "Tema Kustom" (teks ditulis sendiri oleh pengunjung)
export const CUSTOM_THEME_ID = 'custom';
// id khusus "Acak Tema": AI memilihkan satu tema untuk pengunjung (kejutan)
export const RANDOM_THEME_ID = 'random';

export const THEMES: Theme[] = [
  { id: "robot-dies-natalis", name: "Robot Dies Natalis ke-7", desc: "Maskot robot SMK Telkom Sidoarjo, langit teal & sains holografik", group: "Spesial", bg: "#BFEFF0", prompt: "festive school anniversary portrait, bright teal and aqua sky with soft white clouds and sparkles, a friendly white-and-teal student robot mascot with a glass dome helmet reading a glowing open book beside the person, floating holographic science screens, elegant wing motif shaped like the number 7", pinned: true, preview: '/themes/robot-dies-natalis.png' },
  { id: "cyberpunk", name: "Cyberpunk", desc: "Lampu neon futuristik & kota malam", group: "Viral", bg: "#0F172A", prompt: "futuristic cyberpunk portrait, neon lights, night city atmosphere, high detail", preview: "/themes/cyberpunk.jpg" },
  { id: "hutan-ajaib", name: "Hutan Ajaib", desc: "Nuansa hutan magis & cahaya mistis", group: "Seni & Budaya", bg: "#14532D", prompt: "enchanted fantasy forest portrait, glowing fireflies, mystical light, cinematic", preview: "/themes/hutan-ajaib.jpg" },
  { id: "dunia-laut", name: "Dunia Laut", desc: "Suasana bawah laut & terumbu karang", group: "Seni & Budaya", bg: "#0C4A6E", prompt: "underwater portrait, coral reef, rays of sunlight in ocean water, detailed", preview: "/themes/dunia-laut.jpg" },
  { id: "anime", name: "Anime", desc: "Gaya ilustrasi anime Jepang modern", group: "Pahlawan & Anime", bg: "#312E81", prompt: "modern Japanese anime style portrait, expressive eyes, clean cel shading", preview: "/themes/anime.jpg" },
  { id: "animasi-3d", name: "Animasi 3D", desc: "Karakter 3D penuh warna & ekspresif", group: "Viral", bg: "#1D4ED8", prompt: "3d animated movie character portrait, soft studio lighting, stylized render", preview: "/themes/animasi-3d.jpg" },
  { id: "batik-modern", name: "Batik Modern", desc: "Busana batik elegan & nuansa heritage", group: "Seni & Budaya", bg: "#EBD3A0", prompt: "Transform the photo into an ultra-luxurious portrait of the person wearing bespoke, modern high-fashion Indonesian batik attire with intricate gold and deep sogan brown patterns. Set in a warm, sophisticated modern Indonesian heritage lounge with soft dramatic studio portrait lighting, shallow depth of field, 85mm lens photography.", preview: "/themes/batik-modern.jpg" },
  { id: "retro-90an", name: "Retro 90-an", desc: "Gaya klasik 90-an & nuansa nostalgia", group: "Viral", bg: "#581C87", prompt: "1990s retro aesthetic portrait, vintage film grain, nostalgic color tone", preview: "/themes/retro-90an.jpg" },
  { id: "pahlawan-fantasi", name: "Pahlawan Fantasi", desc: "Kostum epik & dunia fantasi petualangan", group: "Pahlawan & Anime", bg: "#7F1D1D", prompt: "epic fantasy hero portrait, dramatic armor and cape, cinematic lighting", preview: "/themes/pahlawan-fantasi.jpg" },
  { id: "pixel-art", name: "Pixel Art", desc: "Seni piksel retro khas game klasik", group: "Pahlawan & Anime", bg: "#1E1B4B", prompt: "detailed pixel art portrait, retro game aesthetic, crisp pixel shading", preview: "/themes/pixelart.jpg" },
  { id: "astronot", name: "Astronot", desc: "Penjelajah luar angkasa & planet", group: "Spesial", bg: "#090D16", prompt: "astronaut portrait in space suit, stars and nebula background, cinematic", preview: "/themes/astronot.jpg" },
  { id: "komik-pahlawan", name: "Komik Pahlawan", desc: "Gaya komik aksi dengan garis tegas", group: "Pahlawan & Anime", bg: "#991B1B", prompt: "comic book superhero portrait, bold ink lines, halftone shading, dynamic", preview: "/themes/komik.jpg" },
  { id: "cat-air", name: "Cat Air", desc: "Lukisan cat air lembut penuh tekstur", group: "Seni & Budaya", bg: "#0F766E", prompt: "watercolor painting portrait, soft brush strokes, paper texture, artistic", preview: "/themes/cat-air.jpg" },
  { id: "profesional", name: "Profesional", desc: "Potret studio rapi & berwibawa", group: "Profesi", bg: "#334155", prompt: "professional corporate studio portrait, clean lighting, sharp focus, formal", preview: "/themes/profesional.jpg" },
];
