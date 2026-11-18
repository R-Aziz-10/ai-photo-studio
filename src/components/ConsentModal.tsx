type Props = { open: boolean; onAccept: () => void; onCancel: () => void };

export default function ConsentModal({ open, onAccept, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
        <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-500 border border-brand-500/30 flex items-center justify-center text-2xl">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-100">Persetujuan Penggunaan Foto</h3>
          <p className="text-xs text-slate-400 mt-1">Mohon baca sebelum foto Anda diproses.</p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2.5">
          <p className="flex items-start gap-2">
            <i className="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
            <span>
              <strong>Aksesoris Real-Time:</strong> pelacakan wajah untuk aksesoris berjalan di browser perangkat ini.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <i className="fa-solid fa-cloud-arrow-up text-amber-400 mt-0.5"></i>
            <span>
              <strong>Diproses Layanan AI:</strong> saat Anda mengambil foto, gambar beserta teks tema/aksesoris kustom (jika ada) dikirim ke
              layanan AI pihak ketiga (Cloudflare) untuk diubah gayanya.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <i className="fa-solid fa-clock text-amber-400 mt-0.5"></i>
            <span>
              <strong>Disimpan Sementara:</strong> hasil foto disimpan agar bisa diunduh lewat QR code, lalu dihapus
              panitia setelah acara selesai.
            </span>
          </p>
          <p className="flex items-start gap-2">
            <i className="fa-solid fa-user-group text-slate-400 mt-0.5"></i>
            <span>Peserta di bawah umur sebaiknya mendapat izin guru atau orang tua.</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition"
          >
            Batal
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-cyber-purple hover:from-brand-500 hover:to-cyber-pink text-white font-semibold text-sm transition shadow-lg shadow-brand-600/30"
          >
            Setuju & Proses Foto
          </button>
        </div>
      </div>
    </div>
  );
}
