// ============================================================
// BATASAN PROMPT KUSTOM
// Pengunjung (banyak yang masih pelajar) boleh mengetik ide sendiri.
// Daftar kata di bawah menolak permintaan yang tidak pantas.
// PENTING: daftar yang sama ada di worker/index.js (penegakan sebenarnya).
// Jika Anda mengubah daftar ini, ubah juga di Worker lalu Deploy ulang.
// ============================================================
export const MAX_THEME_LEN = 140;
export const MAX_ACCESSORY_LEN = 80;

export const BLOCKED_WORDS = [
  // seksual
  'nude', 'naked', 'nsfw', 'porn', 'sex', 'sexy', 'erotic', 'topless', 'lingerie', 'fetish',
  'telanjang', 'bugil', 'bokep', 'porno', 'seks', 'seksi', 'mesum', 'sensual',
  // kekerasan ekstrem & melukai diri
  'gore', 'mutilated', 'mutilasi', 'suicide', 'bunuh diri',
  // simbol kebencian
  'nazi', 'swastika', 'hitler',
  // lainnya
  'narkoba',
];

const BLOCK_RE = new RegExp('\\b(' + BLOCKED_WORDS.join('|') + ')\\b', 'i');

export function isBlocked(text: string): boolean {
  return BLOCK_RE.test(text);
}

/** Rapikan teks pengunjung: satu baris, tanpa tanda kutip, dibatasi panjangnya. */
export function cleanText(text: string, maxLen: number): string {
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/["“”`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}
