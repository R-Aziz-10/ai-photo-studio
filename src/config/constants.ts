// Teks yang bergantian tampil saat AI sedang memproses
export const LOADING_STEPS = [
  'Menyiapkan foto & aksesoris...',
  'Mengirim ke server AI...',
  'Menganalisis wajah & pose...',
  'Merender tema pilihan Anda...',
  'Menyempurnakan detail akhir...',
];

// Ukuran gambar hasil (piksel).
// 512  = hemat kuota gratis Cloudflare (sekitar 180 foto/hari)
// 768 / 1024 = lebih tajam, tetapi kuota harian lebih cepat habis
export const OUTPUT_SIZE = 512;

// true  = setiap pengunjung diminta setuju sebelum fotonya dikirim (disarankan untuk pameran/kios bersama)
// false = persetujuan diminta sekali saja dan diingat di browser ini
export const ASK_CONSENT_EVERY_PHOTO = true;

// Berapa tema teratas yang diberi label "Populer"
export const POPULAR_TOP_N = 1;

// Mode demo: tidak memanggil AI sama sekali, hanya memberi efek warna di browser.
// Berguna untuk menguji tampilan tanpa memakai kuota. Aktifkan lewat VITE_DEMO_MODE=true di .env
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE as string) === 'true';

// Instruksi menjaga kemiripan wajah (ditambahkan ke setiap prompt)
export const FACE_PRESERVE_PROMPT =
  "CRITICAL: Strictly preserve the person's exact facial structure, identity, hairstyle, eye glasses if worn, head angle and expression while transforming the style, attire and environment. " +
  "Keep the person's gender presentation exactly as in the photo and never change it. " +
  "If the person wears a hijab (headscarf), keep it fully intact in the same colour, covering the hair and neck; never remove, shorten or restyle it, and place any accessory on top of or beside it. " +
  "Keep the same pose and framing. Modest, wholesome, school-event friendly, suitable for all ages.";

// true  = pengunjung boleh mengetik tema/aksesoris sendiri (disarankan tetap ada panitia yang mengawasi)
// false = hanya pilihan yang tersedia
export const ALLOW_CUSTOM_PROMPTS = true;
