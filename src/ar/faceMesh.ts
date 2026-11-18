// Pembungkus MediaPipe FaceMesh (dimuat lewat <script> di index.html sebagai window.FaceMesh).
// Versi dikunci agar file model yang diunduh sama dengan skrip-nya.
const FACEMESH_VERSION = '0.4.1633559619';

let instance: any = null;

/** Satu instance dipakai seumur aplikasi (menghindari inisialisasi WASM berulang). */
export function getFaceMesh(): any | null {
  if (instance) return instance;
  const Ctor = (window as any).FaceMesh;
  if (!Ctor) return null;

  instance = new Ctor({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${FACEMESH_VERSION}/${file}`,
  });
  instance.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });
  return instance;
}
