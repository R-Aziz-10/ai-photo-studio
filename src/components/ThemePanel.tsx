import { THEMES, CUSTOM_THEME_ID } from '../config/themes';
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

export default function ThemePanel({ selectedId, counts, popularIds, customText, onCustomText, onSelect }: Props) {
  const customActive = selectedId === CUSTOM_THEME_ID;

  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-lg flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <i className="fa-solid fa-palette text-cyber-neon"></i> 2. Tema Dunia AI ({THEMES.length}
          {ALLOW_CUSTOM_PROMPTS ? ' + Kustom' : ''})
        </h2>
        <span className="text-xs text-brand-500 font-semibold">Generative AI</span>
      </div>

      {/* Tema kustom: pengunjung menulis idenya sendiri */}
      {ALLOW_CUSTOM_PROMPTS && (
        <div
          className={`mb-3 rounded-xl border p-3 transition ${
            customActive ? 'border-brand-500 bg-brand-900/40' : 'border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800'
          }`}
        >
          <button onClick={() => onSelect(CUSTOM_THEME_ID)} className="w-full flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-tr from-cyber-purple/30 to-cyber-pink/30 text-cyber-pink">
              <i className="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100">Buat Tema Sendiri</p>
              <p className="text-[10px] text-slate-400">Tulis idenya, AI yang mewujudkan</p>
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
                className="w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-500 outline-none text-sm text-slate-100 placeholder-slate-600 p-2 resize-none"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Gunakan ide yang ramah untuk semua usia.</span>
                <span>
                  {customText.length}/{MAX_THEME_LEN}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
        {THEMES.map((t) => {
          const active = t.id === selectedId;
          const picked = counts[t.id] || 0;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`p-3.5 rounded-xl border text-left transition relative overflow-hidden group ${
                active
                  ? 'border-brand-500 bg-brand-900/40'
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.iconBox}`}>
                  <i className={`fa-solid ${t.icon} text-sm`}></i>
                </div>
                <span className={`w-2 h-2 rounded-full ${active ? 'bg-cyber-neon' : 'bg-transparent'}`}></span>
              </div>
              <p className="text-xs font-bold text-slate-100">{t.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</p>
              {picked > 0 && (
                <p className="text-[10px] font-semibold text-amber-300 mt-2">
                  {popularIds.includes(t.id) ? '🔥 Populer · ' : ''}Dipilih {picked}x
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
