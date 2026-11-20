import { useState } from 'react';
import { ACCESSORIES } from '../config/accessories';
import { ALLOW_CUSTOM_PROMPTS } from '../config/constants';
import { MAX_ACCESSORY_LEN } from '../config/safety';

type Props = {
  selectedId: string;
  extraText: string;
  onExtraText: (text: string) => void;
  onSelect: (id: string) => void;
};

const FILTERS = ['Semua', 'Kepala', 'Wajah', 'Spesial', 'Badan'];
const EXAMPLES = ['topi koboi', 'syal merah', 'headphone neon'];

export default function AccessoryPanel({ selectedId, extraText, onExtraText, onSelect }: Props) {
  const [filter, setFilter] = useState('Semua');
  const shown = ACCESSORIES.filter((a) => a.id === 'none' || filter === 'Semua' || a.group === filter);

  const addExample = (word: string) => {
    if (extraText.toLowerCase().includes(word)) return;
    const next = extraText.trim() ? `${extraText.trim()}, ${word}` : word;
    onExtraText(next.slice(0, MAX_ACCESSORY_LEN));
  };

  return (
    <div className="bg-white/95 rounded-3xl p-5 shadow-xl shadow-teal-900/10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="font-display bg-brand-600 text-white rounded-full px-3 py-0.5 text-sm">1</span> Aksesoris
        </h2>
        <span className="text-xs text-slate-600">{ACCESSORIES.length - 1} pilihan</span>
      </div>
      <p className="text-xs text-slate-600 mb-3">
        <b>Kamera</b> = tampil langsung di kamera. <b>AI</b> = ditambahkan AI saat hasil dibuat.
      </p>

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter aksesoris">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`px-3 min-h-[40px] rounded-full border-2 text-xs transition ${
              filter === f ? 'bg-brand-600 border-brand-600 text-white font-bold' : 'bg-white border-teal-100 text-slate-800 hover:bg-teal-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
        {shown.map((a) => {
          const active = a.id === selectedId;
          const isAr = !!a.draw;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              aria-pressed={active}
              className={`p-2.5 rounded-2xl border-2 text-left transition flex items-center gap-2.5 ${
                active ? 'border-brand-600 bg-teal-50' : 'border-teal-100 bg-white hover:bg-teal-50'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.iconBox}`}>
                <i className={`fa-solid ${a.icon} text-sm`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{a.name}</p>
                <p className="text-[10px] text-slate-600 truncate">
                  {a.sub}
                  {a.id !== 'none' && <span className="font-bold text-brand-600"> &middot; {isAr ? 'Kamera' : 'AI'}</span>}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Aksesoris sendiri: seperti menulis prompt, ditambahkan AI saat hasil dibuat */}
      {ALLOW_CUSTOM_PROMPTS && (
        <div className="mt-4 pt-4 border-t-2 border-dashed border-teal-100">
          <label htmlFor="extra-acc" className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
            <i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i> Buat aksesoris sendiri
          </label>
          <p className="text-xs text-slate-600 mb-2">Tulis seperti prompt. AI menambahkannya saat hasil foto dibuat.</p>
          <textarea
            id="extra-acc"
            value={extraText}
            onChange={(e) => onExtraText(e.target.value)}
            maxLength={MAX_ACCESSORY_LEN}
            rows={2}
            placeholder="contoh: topi koboi, syal merah, dan bunga di telinga"
            className="w-full rounded-2xl bg-teal-50/60 border-2 border-teal-100 focus:border-brand-600 outline-none text-sm text-slate-900 placeholder-slate-500 p-3 resize-none"
          />
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => addExample(w)}
                  className="px-3 min-h-[36px] rounded-full border-2 border-teal-100 bg-white text-[11px] text-slate-800 hover:bg-teal-50"
                >
                  + {w}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-600">
              {extraText.length}/{MAX_ACCESSORY_LEN}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
