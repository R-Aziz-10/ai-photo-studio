import { supabase } from './supabase';

// Semua fungsi di sini aman dipanggil walau Supabase belum aktif: gagal diam-diam.

/** Catat bahwa satu gaya baru saja dipakai (dipanggil setelah generate berhasil). */
export async function logStylePick(styleId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('style_picks').insert({ style_id: styleId });
  if (error) console.warn('Gagal mencatat pilihan gaya:', error.message);
}

/** Ambil jumlah pemakaian tiap gaya: { cyberpunk: 12, anime: 30, ... } */
export async function fetchStyleCounts(): Promise<Record<string, number>> {
  if (!supabase) return {};
  const { data, error } = await supabase.rpc('style_counts');
  if (error) {
    console.warn('Gagal mengambil tren gaya:', error.message);
    return {};
  }
  const counts: Record<string, number> = {};
  (data || []).forEach((row: { style_id: string; total: number | string }) => {
    counts[row.style_id] = Number(row.total);
  });
  return counts;
}
