import { ACCESSORIES } from '../config/accessories';
import { ALLOW_CUSTOM_PROMPTS } from '../config/constants';
import { MAX_ACCESSORY_LEN } from '../config/safety';

type Props = {
  selectedId: string;
  extraText: string;
  onExtraText: (text: string) => void;
  onSelect: (id: string) => void;
};

export default function AccessoryPanel({ selectedId, extraText, onExtraText, onSelect }: Props) {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
          <i className="fa-solid fa-microchip text-cyber-purple"></i> 1. Aksesoris AR (Real-time)
        </h2>
        <span className="text-xs text-slate-400">{ACCESSORIES.length - 1} Aksesoris + None</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
        {ACCESSORIES.map((a) => {
          const active = a.id === selectedId;
          return (
            <button
              key={a.id}
              onClick={() => onSelect(a.id)}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-3 group ${
                active
                  ? 'border-cyber-purple bg-slate-800'
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.iconBox}`}>
                <i className={`fa-solid ${a.icon} text-sm`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{a.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{a.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Aksesoris kustom: ditambahkan oleh AI saat hasil dibuat (tidak tampil di kamera) */}
      {ALLOW_CUSTOM_PROMPTS && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 mb-2">
            <i className="fa-solid fa-wand-magic-sparkles text-cyber-pink"></i> Tambahan dari AI (opsional)
          </label>
          <input
            type="text"
            value={extraText}
            onChange={(e) => onExtraText(e.target.value)}
            maxLength={MAX_ACCESSORY_LEN}
            placeholder="contoh: topi koboi dan syal merah"
            className="w-full rounded-lg bg-slate-950 border border-slate-700 focus:border-brand-500 outline-none text-sm text-slate-100 placeholder-slate-600 p-2"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Tidak muncul di kamera. AI menambahkannya saat hasil foto dibuat.
          </p>
        </div>
      )}
    </div>
  );
}
