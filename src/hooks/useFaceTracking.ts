import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { getFaceMesh } from '../ar/faceMesh';
import { renderAccessory } from '../config/accessories';

export type TrackingStatus = 'idle' | 'initializing' | 'locked' | 'searching' | 'error';

type Options = {
  videoRef: RefObject<HTMLVideoElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  enabled: boolean; // true saat kamera aktif
  accessoryId: string;
};

/**
 * Menjalankan pelacakan wajah pada setiap frame video dan menggambar aksesoris
 * ke canvas overlay. Mengembalikan FPS dan status pelacakan.
 */
export function useFaceTracking({ videoRef, canvasRef, enabled, accessoryId }: Options) {
  const [fps, setFps] = useState(0);
  const [status, setStatus] = useState<TrackingStatus>('idle');

  // Ref agar loop selalu membaca aksesoris terbaru tanpa memulai ulang pelacak
  const accessoryRef = useRef(accessoryId);
  accessoryRef.current = accessoryId;

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      setFps(0);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const faceMesh = getFaceMesh();
    if (!video || !canvas || !faceMesh) {
      setStatus('error');
      return;
    }
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let stopped = false;
    let rafId = 0;
    let busy = false;
    let frames = 0;
    let lastTick = performance.now();

    setStatus('initializing');

    faceMesh.onResults((results: any) => {
      if (stopped) return;
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const landmarks = results.multiFaceLandmarks && results.multiFaceLandmarks[0];
      if (landmarks) {
        setStatus('locked');
        renderAccessory(ctx, accessoryRef.current, landmarks, canvas.width, canvas.height);
      } else {
        setStatus('searching');
      }
    });

    const loop = async () => {
      if (stopped) return;
      if (video.readyState >= 2 && !busy) {
        busy = true;
        try {
          await faceMesh.send({ image: video });
          frames++;
          const now = performance.now();
          if (now - lastTick >= 1000) {
            setFps(Math.round((frames * 1000) / (now - lastTick)));
            frames = 0;
            lastTick = now;
          }
        } catch (err) {
          console.warn('Pelacak wajah gagal, mencoba lagi...', err);
          setStatus('error');
          await new Promise((r) => setTimeout(r, 2000));
        }
        busy = false;
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      stopped = true;
      cancelAnimationFrame(rafId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [enabled, videoRef, canvasRef]);

  return { fps, status };
}
