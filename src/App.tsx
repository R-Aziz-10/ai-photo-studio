import { useCallback, useEffect, useRef, useState } from 'react';

import Header from './components/Header';
import CameraStage from './components/CameraStage';
import AccessoryPanel from './components/AccessoryPanel';
import ThemePanel from './components/ThemePanel';
import ConsentModal from './components/ConsentModal';
import LoadingModal from './components/LoadingModal';
import ResultModal from './components/ResultModal';
import type { ShareState } from './components/ResultModal';

import { ACCESSORIES } from './config/accessories';
import { THEMES, CUSTOM_THEME_ID, RANDOM_THEME_ID } from './config/themes';
import { composePrompt, validateCustomInputs } from './config/customPrompts';
import { ASK_CONSENT_EVERY_PHOTO, FACE_PRESERVE_PROMPT, OUTPUT_SIZE, POPULAR_TOP_N } from './config/constants';

import { useCamera } from './hooks/useCamera';
import { useFaceTracking } from './hooks/useFaceTracking';
import { captureFrame, fileToDataUrl } from './services/capture';
import { generateStyledImage } from './services/ai';
import { uploadResult } from './services/storage';
import { logStylePick, fetchStyleCounts } from './services/trends';
import { consumeGeneration, refundGeneration, fetchQuota } from './services/quota';
import type { Quota } from './services/quota';

const CONSENT_KEY = 'ai_studio_consent';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  // Kamera, pelacakan wajah & pilihan
  const camera = useCamera(videoRef);
  const [isMirror, setIsMirror] = useState(true);
  const [accessoryId, setAccessoryId] = useState('none');
  const [themeId, setThemeId] = useState(RANDOM_THEME_ID) // bawaan: tema diacak (kejutan);
  const [customTheme, setCustomTheme] = useState('');
  const [extraAccessory, setExtraAccessory] = useState('');
  const tracking = useFaceTracking({
    videoRef,
    canvasRef: overlayRef,
    enabled: camera.active,
    accessoryId,
  });

  // Persetujuan
  const [consentGiven, setConsentGiven] = useState(
    () => !ASK_CONSENT_EVERY_PHOTO && localStorage.getItem(CONSENT_KEY) === 'true'
  );
  const [consentOpen, setConsentOpen] = useState(false);
  const pendingAction = useRef<null | (() => void)>(null);

  // Proses AI & hasil
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<null | { before: string; after: string; themeName: string; surprise: boolean }>(null);
  const [share, setShare] = useState<ShareState>({ url: null, status: 'idle' });
  const shareToken = useRef(0);

  // Kuota generate harian (180 per hari, reset 07.00 WIB seperti Cloudflare)
  const [quota, setQuota] = useState<Quota | null>(null);
  useEffect(() => {
    fetchQuota().then(setQuota);
  }, []);

  // Tren tema (rekomendasi)
  const [counts, setCounts] = useState<Record<string, number>>({});
  const refreshCounts = useCallback(async () => setCounts(await fetchStyleCounts()), []);
  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const popularIds = Object.keys(counts)
    .filter((id) => counts[id] > 0 && THEMES.some((t) => t.id === id))
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, POPULAR_TOP_N);

  // ---------- Persetujuan ----------
  const requestConsent = (action: () => void) => {
    if (consentGiven) {
      action();
      return;
    }
    pendingAction.current = action;
    setConsentOpen(true);
  };

  const acceptConsent = () => {
    setConsentGiven(true);
    if (!ASK_CONSENT_EVERY_PHOTO) localStorage.setItem(CONSENT_KEY, 'true');
    setConsentOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  };

  const cancelConsent = () => {
    pendingAction.current = null;
    setConsentOpen(false);
  };

  // ---------- Unggah ke penyimpanan & QR ----------
  const uploadAndShare = async (dataUrl: string) => {
    const token = ++shareToken.current;
    setShare({ url: null, status: 'uploading' });
    try {
      const url = await uploadResult(dataUrl);
      if (token === shareToken.current) setShare({ url, status: 'ready' });
    } catch (err) {
      console.error('Gagal mengunggah hasil:', err);
      if (token === shareToken.current) setShare({ url: null, status: 'error' });
    }
  };

  // ---------- Generate ----------
  const runGeneration = async (source: string) => {
    const isRandom = themeId === RANDOM_THEME_ID;
    const effectiveId = isRandom ? THEMES[Math.floor(Math.random() * THEMES.length)].id : themeId;
    const theme = effectiveId === CUSTOM_THEME_ID ? null : THEMES.find((t) => t.id === effectiveId) || THEMES[0];
    const accessory = ACCESSORIES.find((a) => a.id === accessoryId) || ACCESSORIES[0];

    const prompt = composePrompt({
      theme,
      themeId: effectiveId,
      accessory,
      customTheme,
      extraAccessory,
      facePrompt: FACE_PRESERVE_PROMPT,
    });

    setErrorMsg(null);
    setLoading(true);
    let consumed = false;
    try {
      const q = await consumeGeneration();
      setQuota(q);
      if (!q.allowed) {
        setErrorMsg('Kuota generate hari ini sudah habis. Silakan coba lagi besok (reset 07.00 WIB).');
        return;
      }
      consumed = true;
      const after = await generateStyledImage(source, prompt, OUTPUT_SIZE, theme ? theme.id : 'cyberpunk');
      setResult({ before: source, after, themeName: theme ? theme.name : 'Kustom', surprise: isRandom });
      logStylePick(theme ? theme.id : CUSTOM_THEME_ID).then(refreshCounts);
      uploadAndShare(after);
    } catch (err: any) {
      if (consumed) refundGeneration().then((q) => q && setQuota(q)); // gagal = kuota dikembalikan
      setErrorMsg(err?.message || 'Terjadi kesalahan saat memproses foto. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSnap = () => {
    if (!camera.active || !videoRef.current || !overlayRef.current) return;
    const invalid = validateCustomInputs(themeId, customTheme, extraAccessory);
    if (invalid) {
      setErrorMsg(invalid);
      return;
    }
    if (tracking.status !== 'locked') {
      setErrorMsg('Wajah belum terdeteksi. Hadap kamera dan pastikan cahaya cukup sampai status "Locked", lalu coba lagi.');
      return;
    }
    const frame = captureFrame(videoRef.current, overlayRef.current, isMirror); // foto dibekukan saat tombol ditekan
    requestConsent(() => runGeneration(frame));
  };

  const handleUpload = async (file: File) => {
    const invalid = validateCustomInputs(themeId, customTheme, extraAccessory);
    if (invalid) {
      setErrorMsg(invalid);
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      requestConsent(() => runGeneration(dataUrl));
    } catch (err: any) {
      setErrorMsg(err?.message || 'Foto tidak dapat dibaca.');
    }
  };

  const closeResult = () => {
    shareToken.current++;
    setResult(null);
    setShare({ url: null, status: 'idle' });
    if (ASK_CONSENT_EVERY_PHOTO) setConsentGiven(false); // pengunjung berikutnya harus setuju lagi
  };

  const currentAccessory = ACCESSORIES.find((a) => a.id === accessoryId) || ACCESSORIES[0];
  const accessoryName = currentAccessory.name;
  const accessoryIsAi = accessoryId !== 'none' && !currentAccessory.draw;

  return (
    <>
      <Header fps={tracking.fps} status={tracking.status} />

      <main className="max-w-7xl mx-auto w-full px-4 py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <CameraStage
            videoRef={videoRef}
            canvasRef={overlayRef}
            cameraActive={camera.active}
            cameraError={camera.error}
            isMirror={isMirror}
            accessoryName={accessoryName}
            accessoryIsAi={accessoryIsAi}
            disabled={loading}
            onActivate={camera.activate}
            onToggleMirror={() => setIsMirror((m) => !m)}
            onSwitchCamera={camera.switchCamera}
            onUpload={handleUpload}
            onSnap={handleSnap}
          />

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
              <i className="fa-solid fa-circle-exclamation text-rose-600 mt-0.5"></i>
              <div className="flex-1">
                <p className="font-semibold text-rose-700">Gagal Memproses</p>
                <p className="text-xs sm:text-sm text-rose-700 mt-0.5">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-rose-600 hover:text-rose-900">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
        </div>

        <section className="lg:col-span-5 flex flex-col space-y-6">
          <AccessoryPanel
            selectedId={accessoryId}
            extraText={extraAccessory}
            onExtraText={setExtraAccessory}
            onSelect={setAccessoryId}
          />
          <ThemePanel
            selectedId={themeId}
            counts={counts}
            popularIds={popularIds}
            customText={customTheme}
            onCustomText={setCustomTheme}
            onSelect={setThemeId}
          />
        </section>
      </main>

      <footer className="w-full border-t-2 border-white bg-white/80 py-4 px-4 text-center text-xs text-slate-600">
        <p>AI Photo Studio &copy; 2026 — MediaPipe Face Mesh & FLUX.2 (Cloudflare Workers AI)</p>
      </footer>

      <ConsentModal open={consentOpen} onAccept={acceptConsent} onCancel={cancelConsent} />
      <LoadingModal open={loading} />
      <ResultModal
        open={!!result}
        beforeUrl={result?.before || ''}
        afterUrl={result?.after || ''}
        themeName={result?.themeName || ''}
        surprise={result?.surprise}
        share={share}
        onRetryShare={() => result && uploadAndShare(result.after)}
        onClose={closeResult}
      />
    </>
  );
}
