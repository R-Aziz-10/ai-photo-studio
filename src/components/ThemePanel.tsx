import { useState } from 'react';
import { THEMES, CUSTOM_THEME_ID, RANDOM_THEME_ID } from '../config/themes';
import type { Theme } from '../config/themes';
import { ALLOW_CUSTOM_PROMPTS } from '../config/constants';
import { MAX_THEME_LEN } from '../config/safety';

type Props = {
  selectedId: string;
  counts: Record<string, number>; // jumlah pemakaian tiap tema (dari semua pengunjung)
  popularIds: string[];
  customText: string;
  onCustomText: (text: string) => void;
  onSelect: (id: string) => void;
};

const FILTERS: { label: string; groups: string[] }[] = [
  { label: 'Semua', groups: [] },
  { label: 'Spesial', groups: ['Spesial'] },
  { label: 'Viral', groups: ['Viral'] },
  { label: 'Profesi', groups: ['Profesi'] },
  { label: 'Pahlawan & Anime', groups: ['Pahlawan', 'Anime'] },
  { label: 'Seni & Budaya', groups: ['Seni', 'Budaya'] },
];

function Thumb({ t }: { t: Theme }) {
  return (
    <div className="relative h-24 rounded-xl overflow-hidden" style={{ background: t.bg }}>
      {t.preview && (
        <img
          src={t.preview}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      )}
    </div>
  );
}

export default function ThemePanel({ selectedId, counts, popularIds, customText, onCustomText, onSelect }: Props) {
  const [filter, setFilter] = useState('Semua');
  const customActive = selectedId === CUSTOM_THEME_ID;
  const randomActive = selectedId === RANDOM_THEME_ID;

  const groups = FILTERS.find((f) => f.label === filter)?.groups ?? [];
  const shown = THEMES.filter((t) => groups.length === 0 || groups.includes(t.group));
  const pinned = shown.find((t) => t.pinned);
  const rest = shown.filter((t) => !t.pinned);

  const badge = (t: Theme) => {
    const picked = counts[t.id] || 0;
    if (picked <= 0) return null;
    return (
      <p className="text-[10px] font-bold text-amber-700 mt-1.5">
        {popularIds.includes(t.id) ? '🔥 Populer · ' : ''}Dipilih {picked}x
      </p>
    );
  };

  return (
    <div className="bg-white/95 rounded-3xl p-5 shadow-xl shadow-teal-900/10 flex-1">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="font-display bg-brand-600 text-white rounded-full px-3 py-0.5 text-sm">2</span> Tema Dunia AI
        </h2>
        <span className="text-xs text-slate-600">{THEMES.length} tema{ALLOW_CUSTOM_PROMPTS ? ' + kustom' : ''}</span>
      </div>
      <p className="text-xs text-slate-600 mb-3">Setiap kartu menampilkan contoh gaya hasil fotomu.</p>

      {/* Acak Tema: bawaan jika pengunjung tidak memilih tema apa pun */}
      <button
        onClick={() => onSelect(RANDOM_THEME_ID)}
        aria-pressed={randomActive}
        className={`w-full mb-3 flex items-center gap-3 text-left rounded-2xl border-2 p-3 transition ${
          randomActive ? 'border-brand-600 bg-teal-50' : 'border-teal-100 bg-white hover:bg-teal-50'
        }`}
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-600 to-cyber-purple text-white flex items-center justify-center font-display text-2xl shrink-0">
          ?
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-800">Acak Tema (Kejutan)</p>
          <p className="text-xs text-slate-600">Tidak memilih tema? AI memilihkan satu untukmu. Tema apa ya yang kamu dapatkan?</p>
        </div>
        {randomActive && <span className="text-xs font-bold text-brand-600 shrink-0">&#10003; Terpilih</span>}
      </button>

      {/* Tema kustom */}
      {ALLOW_CUSTOM_PROMPTS && (
        <div
          className={`mb-3 rounded-2xl border-2 p-3 transition ${
            customActive ? 'border-brand-600 bg-teal-50' : 'border-dashed border-teal-200 bg-teal-50/40 hover:bg-teal-50'
          }`}
        >
          <button onClick={() => onSelect(CUSTOM_THEME_ID)} className="w-full flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-brand-600 text-white">
              <i className="fa-solid fa-plus text-sm"></i>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800">Buat Tema Sendiri</p>
              <p className="text-xs text-slate-600">Tulis idenya, AI yang mewujudkan</p>
            </div>
          </button>

          {customActive && (
            <div className="mt-3">
              <textarea
                value={customText}
                onChange={(e) => onCustomText(e.target.value)}
                maxLength={MAX_THEME_LEN}
                rows={2}
                placeholder="contoh: astronot di bulan dengan latar bumi, gaya lukisan minyak"
                className="w-full rounded-xl bg-white border-2 border-teal-100 focus:border-brand-600 outline-none text-sm text-slate-900 placeholder-slate-500 p-2 resize-none"
              />
              <div className="flex justify-between text-[11px] text-slate-600 mt-1">
                <span>Gunakan ide yang ramah untuk semua usia.</span>
                <span>
                  {customText.length}/{MAX_THEME_LEN}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter tema">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            aria-pressed={filter === f.label}
            className={`px-3 min-h-[40px] rounded-full border-2 text-xs transition ${
              filter === f.label ? 'bg-brand-600 border-brand-600 text-white font-bold' : 'bg-white border-teal-100 text-slate-800 hover:bg-teal-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
        {pinned && (
          <button
            onClick={() => onSelect(pinned.id)}
            aria-pressed={pinned.id === selectedId}
            className={`col-span-full flex items-center gap-3 text-left rounded-2xl border-2 p-3 transition ${
              pinned.id === selectedId ? 'border-brand-600 bg-teal-50' : 'border-brand-600/40 bg-teal-50/60 hover:bg-teal-50'
            }`}
          >
            <div className="min-w-0">
              <span className="inline-block text-[10px] font-bold bg-brand-600 text-white rounded-full px-2 py-0.5 mb-1">
                📌 Disematkan · Spesial
              </span>
              <p className="text-base font-bold text-slate-800">{pinned.name}</p>
              <p className="text-xs text-slate-600">{pinned.desc}</p>
              {badge(pinned)}
            </div>
            <div className="ml-auto shrink-0 w-28 h-24 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: pinned.bg }}>
              <img src={pinned.preview} alt="Maskot robot Dies Natalis" className="w-full h-full object-cover" />
            </div>
            {pinned.id === selectedId && <span className="ml-auto text-xs font-bold text-brand-600 shrink-0">&#10003;</span>}
          </button>
        )}

        {rest.map((t) => {
          const active = t.id === selectedId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              aria-pressed={active}
              className={`rounded-2xl border-2 p-2 pb-3 text-left transition ${
                active ? 'border-brand-600 bg-teal-50' : 'border-teal-100 bg-white hover:bg-teal-50'
              }`}
            >
              <div className="relative">
                <Thumb t={t} />
                <span className="absolute left-2 top-2 text-[10px] font-bold bg-brand-600 text-white rounded-full px-2 py-0.5">{t.group}</span>
                {active && (
                  <span className="absolute right-2 top-2 w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center">
                    &#10003;
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-800 mt-2 px-1">{t.name}</p>
              <p className="text-[11px] text-slate-600 leading-tight px-1">{t.desc}</p>
              <div className="px-1">{badge(t)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
