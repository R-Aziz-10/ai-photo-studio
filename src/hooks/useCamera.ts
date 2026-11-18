import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

type Facing = 'user' | 'environment';

export function useCamera(videoRef: RefObject<HTMLVideoElement>) {
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [facingMode, setFacingMode] = useState<Facing>('user');
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(
    async (mode: Facing) => {
      setError(null);
      try {
        stopStream();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: mode },
          audio: false,
        });
        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
          setActive(true);
        };
      } catch (err) {
        console.error('Gagal mengakses kamera:', err);
        setActive(false);
        setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
      }
    },
    [videoRef, stopStream]
  );

  const activate = useCallback(() => start(facingMode), [start, facingMode]);

  const switchCamera = useCallback(async () => {
    const next: Facing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    setActive(false);
    await start(next);
  }, [facingMode, start]);

  useEffect(() => stopStream, [stopStream]);

  return { active, error, activate, switchCamera };
}
