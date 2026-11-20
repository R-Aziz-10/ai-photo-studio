import { supabase } from './supabase';

// Kuota generate harian (hari kuota mulai 07.00 WIB, sama dengan reset kuota gratis Cloudflare).
// Fungsi SQL-nya ada di supabase/quota.sql (jalankan sekali di Supabase > SQL Editor).
export const MAX_PER_DAY = 180;
export type Quota = { allowed: boolean; used: number; remaining: number; max: number };

async function call(fn: string): Promise<Quota | null> {
  if (!supabase) return null; // Supabase belum diisi di .env: kuota tidak dihitung
  try {
    const { data, error } = await supabase.rpc(fn, { max_per_day: MAX_PER_DAY });
    if (error) throw error;
    return data as Quota;
  } catch (err) {
    console.warn(`Kuota (${fn}) gagal dibaca:`, err);
    return null;
  }
}

export const fetchQuota = () => call('get_quota');
export const refundGeneration = () => call('refund_generation');

// Jika Supabase error / belum aktif, diizinkan lanjut (fail-open) supaya acara tidak berhenti.
export async function consumeGeneration(): Promise<Quota> {
  const q = await call('consume_generation');
  return q ?? { allowed: true, used: 0, remaining: MAX_PER_DAY, max: MAX_PER_DAY };
}
