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
import { THEMES, CUSTOM_THEME_ID } from './config/themes';
import { composePrompt, validateCustomInputs } from './config/customPrompts';
import { ASK_CONSENT_EVERY_PHOTO, FACE_PRESERVE_PROMPT, OUTPUT_SIZE, POPULAR_TOP_N } from './config/constants';

import { useCamera } from './hooks/useCamera';
import { useFaceTracking } from './hooks/useFaceTracking';
import { captureFrame, fileToDataUrl } from './services/capture';
import { generateStyledImage } from './services/ai';
import { uploadResult } from './services/storage';
import { logStylePick, fetchStyleCounts } from './services/trends';

const CONSENT_KEY = 'ai_studio_consent';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  // Kamera, pelacakan wajah & pilihan
  const camera = useCamera(videoRef);
  const [isMirror, setIsMirror] = useState(true);
  const [accessoryId, setAccessoryId] = useState('none');
  const [themeId, setThemeId] = useState(THEMES[0].id);
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
  const [result, setResult] = useState<null | { before: string; after: string; themeName: string }>(null);
  const [share, setShare] = useState<ShareState>({ url: null, status: 'idle' });
  const shareToken = useRef(0);

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
    const theme = themeId === CUSTOM_THEME_ID ? null : THEMES.find((t) => t.id === themeId) || THEMES[0];
    const accessory = ACCESSORIES.find((a) => a.id === accessoryId) || ACCESSORIES[0];

    const prompt = composePrompt({
      theme,
      themeId,
      accessory,
      customTheme,
      extraAccessory,
      facePrompt: FACE_PRESERVE_PROMPT,
    });

    setErrorMsg(null);
    setLoading(true);
    try {
      const after = await generateStyledImage(source, prompt, OUTPUT_SIZE, theme ? theme.id : 'cyberpunk');
      setResult({ before: source, after, themeName: theme ? theme.name : 'Kustom' });
      logStylePick(theme ? theme.id : CUSTOM_THEME_ID).then(refreshCounts);
      uploadAndShare(after);
    } catch (err: any) {
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

  const accessoryName = (ACCESSORIES.find((a) => a.id === accessoryId) || ACCESSORIES[0]).name;

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
            disabled={loading}
            onActivate={camera.activate}
            onToggleMirror={() => setIsMirror((m) => !m)}
            onSwitchCamera={camera.switchCamera}
            onUpload={handleUpload}
            onSnap={handleSnap}
          />

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start gap-3 text-sm">
              <i className="fa-solid fa-circle-exclamation text-rose-400 mt-0.5"></i>
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Gagal Memproses</p>
                <p className="text-xs sm:text-sm text-rose-200/90 mt-0.5">{errorMsg}</p>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
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

      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>AI Photo Studio &copy; 2026 — MediaPipe Face Mesh & FLUX.2 (Cloudflare Workers AI)</p>
      </footer>

      <ConsentModal open={consentOpen} onAccept={acceptConsent} onCancel={cancelConsent} />
      <LoadingModal open={loading} />
      <ResultModal
        open={!!result}
        beforeUrl={result?.before || ''}
        afterUrl={result?.after || ''}
        themeName={result?.themeName || ''}
        share={share}
        onRetryShare={() => result && uploadAndShare(result.after)}
        onClose={closeResult}
      />
    </>
  );
}
