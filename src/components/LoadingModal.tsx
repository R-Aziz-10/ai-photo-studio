import { useEffect, useState } from 'react';
import { LOADING_STEPS } from '../config/constants';

export default function LoadingModal({ open }: { open: boolean }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!open) return;
    setElapsed(0);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  // Langkah berganti tiap 4 detik; progres mendekati 92% lalu menunggu hasil asli
  const step = Math.min(Math.floor(elapsed / 4), LOADING_STEPS.length - 1);
  const progress = Math.min(92, (elapsed / 24) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-teal-900/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border-2 border-white rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/10 to-transparent scanline-effect pointer-events-none"></div>

        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-teal-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-cyber-neon border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-cyber-neon text-xl">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">Transformasi AI Berjalan...</h3>
        <p className="text-xs text-cyber-neon font-mono mb-4">{LOADING_STEPS[step]}</p>

        <div className="w-full bg-teal-50 rounded-full h-2 mb-2 border border-teal-100 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 to-cyber-purple h-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-[11px] text-slate-600">
          Berjalan <span className="font-mono font-bold text-slate-700">{elapsed}</span> detik (biasanya 10–30 detik)
        </p>
      </div>
    </div>
  );
}
