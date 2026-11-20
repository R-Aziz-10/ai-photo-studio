import { QRCodeCanvas } from 'qrcode.react';

export type ShareState = { url: string | null; status: 'idle' | 'uploading' | 'ready' | 'error' };

type Props = {
  open: boolean;
  beforeUrl: string;
  afterUrl: string;
  themeName: string;
  surprise?: boolean; // true = tema diacak
  share: ShareState;
  onRetryShare: () => void;
  onClose: () => void;
};

export default function ResultModal({ open, beforeUrl, afterUrl, themeName, surprise, share, onRetryShare, onClose }: Props) {
  if (!open) return null;
  const ext = afterUrl.startsWith('data:image/jpeg') ? 'jpg' : 'png';

  return (
    <div className="fixed inset-0 z-50 bg-teal-900/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border-2 border-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl my-8 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-teal-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-cyber-neon"></i> Hasil Foto Studio AI
            </h3>
            <p className="text-xs text-slate-600">Perbandingan foto asli dan hasil generasi AI</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-teal-50 text-slate-600 hover:text-teal-800 flex items-center justify-center"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {surprise && (
          <div className="mb-4 rounded-2xl bg-teal-50 border-2 border-dashed border-brand-600 px-4 py-3 text-center">
            <p className="text-xs text-slate-600">Tema apa ya yang kamu dapatkan?</p>
            <p className="font-display text-xl font-bold text-brand-600">🎲 Kamu dapat tema: {themeName}!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <i className="fa-solid fa-camera"></i> Before (Foto Asli)
            </span>
            <div className="aspect-[4/3] bg-teal-50 rounded-xl overflow-hidden border border-teal-100">
              <img className="w-full h-full object-cover" src={beforeUrl} alt="Foto asli" />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xs font-semibold text-cyber-neon flex items-center gap-1.5">
              <i className="fa-solid fa-wand-magic-sparkles"></i> After (Hasil AI)
            </span>
            <div className="aspect-[4/3] bg-teal-50 rounded-xl overflow-hidden border border-cyber-purple/50 shadow-lg shadow-cyber-purple/20 relative">
              <img className="w-full h-full object-contain" src={afterUrl} alt="Hasil AI" />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm border-2 border-teal-100 rounded px-2 py-0.5 text-[10px] font-mono text-slate-700">
                Tema: <span className="text-cyber-neon uppercase">{themeName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="bg-white p-2 rounded-lg shrink-0 w-[128px] h-[128px] flex items-center justify-center">
              {share.status === 'ready' && share.url && <QRCodeCanvas value={share.url} size={112} level="M" />}
              {share.status === 'uploading' && <i className="fa-solid fa-spinner fa-spin text-2xl text-slate-600"></i>}
              {share.status === 'error' && <i className="fa-solid fa-triangle-exclamation text-2xl text-rose-500"></i>}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Scan QR via HP</p>
              {share.status === 'uploading' && <p className="text-[11px] text-slate-600">Menyiapkan QR code...</p>}
              {share.status === 'ready' && (
                <p className="text-[11px] text-slate-600">Scan dengan kamera HP, lalu tekan lama pada foto untuk menyimpannya.</p>
              )}
              {share.status === 'error' && (
                <>
                  <p className="text-[11px] text-rose-700">QR belum tersedia. Foto tetap bisa diunduh di sini.</p>
                  <button
                    onClick={onRetryShare}
                    className="mt-1.5 px-3 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[11px] font-semibold text-slate-800 transition"
                  >
                    Coba Buat QR Lagi
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-slate-800 text-xs font-semibold transition flex items-center gap-2"
            >
              <i className="fa-solid fa-rotate-left"></i> Foto Ulang
            </button>
            <a
              href={afterUrl}
              download={`ai-photo-studio.${ext}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyber-purple hover:from-brand-700 hover:to-brand-600 text-white text-xs font-bold transition shadow-lg shadow-brand-600/30 flex items-center gap-2"
            >
              <i className="fa-solid fa-download"></i> Download Hasil
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
