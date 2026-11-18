import type { RefObject, ChangeEvent } from 'react';

type Props = {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  cameraActive: boolean;
  cameraError: string | null;
  isMirror: boolean;
  accessoryName: string;
  disabled: boolean; // saat AI sedang memproses
  onActivate: () => void;
  onToggleMirror: () => void;
  onSwitchCamera: () => void;
  onUpload: (file: File) => void;
  onSnap: () => void;
};

const iconBtn =
  'w-10 h-10 rounded-xl bg-slate-900/70 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-center';

export default function CameraStage(p: Props) {
  const mirror = p.isMirror ? 'mirror-mode' : '';

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) p.onUpload(file);
    e.target.value = ''; // agar file yang sama bisa dipilih lagi
  };

  return (
    <section className="lg:col-span-7 flex flex-col space-y-4">
      <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group cyber-border">
        <video
          ref={p.videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${mirror}`}
          autoPlay
          playsInline
          muted
        ></video>

        {/* Canvas overlay aksesoris AR */}
        <canvas
          ref={p.canvasRef}
          className={`absolute inset-0 w-full h-full object-cover ${mirror} pointer-events-none z-10`}
        ></canvas>

        {/* Layar sebelum kamera aktif */}
        {!p.cameraActive && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-brand-500">
              <i className="fa-solid fa-camera text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-1">Kamera Belum Aktif</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Tekan tombol di bawah untuk mengizinkan kamera dan mengaktifkan aksesoris real-time.
            </p>
            {p.cameraError && <p className="text-xs text-rose-400 max-w-sm mb-4">{p.cameraError}</p>}
            <button
              onClick={p.onActivate}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyber-purple hover:from-brand-500 hover:to-cyber-pink text-white font-medium text-sm transition-all shadow-lg shadow-brand-600/30"
            >
              <i className="fa-solid fa-power-off mr-2"></i> Aktifkan Kamera
            </button>
          </div>
        )}

        {/* Kontrol kanan atas */}
        <div className="absolute top-4 right-4 z-20 flex space-x-2">
          <button onClick={p.onToggleMirror} title="Balik Tampilan (Mirror)" className={iconBtn}>
            <i className="fa-solid fa-right-left text-sm"></i>
          </button>
          <button onClick={p.onSwitchCamera} title="Ganti Kamera Depan/Belakang" className={iconBtn}>
            <i className="fa-solid fa-camera-rotate text-sm"></i>
          </button>
          <label title="Upload Foto Manual (tanpa aksesoris)" className={`${iconBtn} cursor-pointer`}>
            <i className="fa-solid fa-upload text-sm"></i>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>

        {/* Badge aksesoris aktif */}
        <div className="absolute bottom-4 left-4 z-20">
          <span className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-medium text-cyber-neon flex items-center gap-2">
            <i className="fa-solid fa-masks-theater"></i> Aksesoris AR:{' '}
            <span className="text-white uppercase">{p.accessoryName}</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center pt-2">
        <button
          onClick={p.onSnap}
          disabled={!p.cameraActive || p.disabled}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-cyber-purple to-cyber-pink disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 text-white font-bold text-lg shadow-xl shadow-brand-500/25 transition transform active:scale-95 flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-camera-retro text-xl"></i>
          <span>AMBIL FOTO & TRANSFORMASI AI</span>
        </button>
      </div>
    </section>
  );
}
