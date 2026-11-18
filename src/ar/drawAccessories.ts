// ============================================================
// GAMBAR AKSESORI DI CANVAS
// Setiap fungsi menggambar satu aksesoris, berpusat pada landmark wajah.
// Koordinat sudah diputar & diskalakan mengikuti wajah (lihat FaceGeometry).
// ============================================================
export type Pt = { x: number; y: number };
export type Landmark = { x: number; y: number; z?: number };

export type FaceGeometry = {
  leftEye: Pt;
  rightEye: Pt;
  forehead: Pt;
  nose: Pt;
  leftTemple: Pt;
  rightTemple: Pt;
  chin: Pt;
  noseBase: Pt; // dasar hidung
  upperLip: Pt; // tengah bibir atas
  faceWidth: number; // lebar wajah (jarak antar pelipis) — dipakai untuk ikat kepala/mahkota
  eyeDistance: number; // jarak antar mata (piksel) — dipakai sebagai skala
  angle: number; // kemiringan kepala (radian)
};

// t = waktu berdenyut (untuk animasi kedip/melayang)
export type DrawFn = (ctx: CanvasRenderingContext2D, g: FaceGeometry, t: number) => void;

// Indeks landmark MediaPipe: 33 & 263 = sudut luar mata, 10 = dahi atas, 1 = ujung hidung,
// 234 & 454 = tepi pipi/telinga kiri-kanan, 152 = dagu, 2 = dasar hidung, 0 = bibir atas
export function computeGeometry(lm: Landmark[], w: number, h: number): FaceGeometry {
  const p = (i: number): Pt => ({ x: lm[i].x * w, y: lm[i].y * h });
  const leftEye = p(33);
  const rightEye = p(263);
  const dx = rightEye.x - leftEye.x;
  const dy = rightEye.y - leftEye.y;
  return {
    leftEye,
    rightEye,
    forehead: p(10),
    nose: p(1),
    leftTemple: p(234),
    rightTemple: p(454),
    chin: p(152),
    noseBase: p(2),
    upperLip: p(0),
    faceWidth: Math.hypot(lm[454].x * w - lm[234].x * w, lm[454].y * h - lm[234].y * h),
    eyeDistance: Math.sqrt(dx * dx + dy * dy),
    angle: Math.atan2(dy, dx),
  };
}

// 1. KACAMATA CYBER-VISOR
export const drawGlasses: DrawFn = (ctx, g) => {
  const { leftEye, rightEye, eyeDistance, angle } = g;
  const centerX = (leftEye.x + rightEye.x) / 2;
  const centerY = (leftEye.y + rightEye.y) / 2;

  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  const glassWidth = eyeDistance * 2.35;
  const glassHeight = glassWidth * 0.36;

  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 15;

  const lensGrad = ctx.createLinearGradient(-glassWidth / 2, -glassHeight / 2, glassWidth / 2, glassHeight / 2);
  lensGrad.addColorStop(0, 'rgba(168, 85, 247, 0.78)');
  lensGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.85)');
  lensGrad.addColorStop(1, 'rgba(0, 255, 204, 0.78)');

  ctx.fillStyle = lensGrad;
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = Math.max(2.5, eyeDistance * 0.035);

  // Lensa kiri
  ctx.beginPath();
  ctx.moveTo(-glassWidth * 0.48, -glassHeight * 0.45);
  ctx.lineTo(-glassWidth * 0.06, -glassHeight * 0.35);
  ctx.lineTo(-glassWidth * 0.1, glassHeight * 0.45);
  ctx.lineTo(-glassWidth * 0.42, glassHeight * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Lensa kanan
  ctx.beginPath();
  ctx.moveTo(glassWidth * 0.48, -glassHeight * 0.45);
  ctx.lineTo(glassWidth * 0.06, -glassHeight * 0.35);
  ctx.lineTo(glassWidth * 0.1, glassHeight * 0.45);
  ctx.lineTo(glassWidth * 0.42, glassHeight * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Jembatan & gagang
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = Math.max(3, eyeDistance * 0.045);
  ctx.beginPath();
  ctx.moveTo(-glassWidth * 0.07, -glassHeight * 0.15);
  ctx.lineTo(glassWidth * 0.07, -glassHeight * 0.15);
  ctx.moveTo(-glassWidth * 0.48, -glassHeight * 0.25);
  ctx.lineTo(-glassWidth * 0.56, -glassHeight * 0.35);
  ctx.moveTo(glassWidth * 0.48, -glassHeight * 0.25);
  ctx.lineTo(glassWidth * 0.56, -glassHeight * 0.35);
  ctx.stroke();

  // Kilau di lensa
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.beginPath();
  ctx.moveTo(-glassWidth * 0.36, -glassHeight * 0.35);
  ctx.lineTo(-glassWidth * 0.26, -glassHeight * 0.33);
  ctx.lineTo(-glassWidth * 0.32, glassHeight * 0.35);
  ctx.lineTo(-glassWidth * 0.4, glassHeight * 0.32);
  ctx.closePath();
  ctx.fill();
};

// 2. ALAT KOMUNIKASI (earpiece taktis + mic + antena)
export const drawComms: DrawFn = (ctx, g, t) => {
  const { leftTemple, eyeDistance, angle } = g;
  const earX = leftTemple.x - eyeDistance * 0.12;
  const earY = leftTemple.y - eyeDistance * 0.05;

  ctx.translate(earX, earY);
  ctx.rotate(angle);

  const unitSize = eyeDistance * 0.55;

  // Rumah earpiece
  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 14;
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = Math.max(2.5, unitSize * 0.06);
  ctx.beginPath();
  ctx.roundRect(-unitSize * 0.35, -unitSize * 0.55, unitSize * 0.65, unitSize * 1.1, unitSize * 0.2);
  ctx.fill();
  ctx.stroke();

  // Inti reaktor berdenyut
  const pulseRadius = unitSize * (0.16 + Math.sin(t * 1.5) * 0.03);
  ctx.fillStyle = '#ec4899';
  ctx.beginPath();
  ctx.arc(-unitSize * 0.03, 0, pulseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Dua antena
  ctx.strokeStyle = '#00ffcc';
  ctx.lineWidth = Math.max(2, unitSize * 0.05);
  ctx.beginPath();
  ctx.moveTo(-unitSize * 0.15, -unitSize * 0.55);
  ctx.lineTo(-unitSize * 0.25, -unitSize * 1.45);
  ctx.moveTo(unitSize * 0.08, -unitSize * 0.55);
  ctx.lineTo(unitSize * 0.02, -unitSize * 1.2);
  ctx.stroke();

  // LED ujung antena berkedip
  ctx.fillStyle = Math.sin(t * 2) > 0 ? '#00ffcc' : '#ec4899';
  ctx.beginPath();
  ctx.arc(-unitSize * 0.25, -unitSize * 1.48, unitSize * 0.07, 0, Math.PI * 2);
  ctx.fill();

  // Lengan mic ke arah pipi/mulut
  ctx.strokeStyle = '#a855f7';
  ctx.lineWidth = Math.max(3, unitSize * 0.07);
  ctx.beginPath();
  ctx.moveTo(unitSize * 0.1, unitSize * 0.35);
  ctx.lineTo(unitSize * 0.55, unitSize * 0.85);
  ctx.lineTo(unitSize * 1.35, unitSize * 0.92);
  ctx.stroke();

  // Ujung mic
  ctx.fillStyle = '#00ffcc';
  ctx.beginPath();
  ctx.roundRect(unitSize * 1.3, unitSize * 0.83, unitSize * 0.25, unitSize * 0.18, 4);
  ctx.fill();

  // Busur HUD holografik
  ctx.strokeStyle = 'rgba(0, 255, 204, 0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(unitSize * 1.45, unitSize * 0.65, unitSize * 0.28, -Math.PI * 0.7, -Math.PI * 0.15);
  ctx.stroke();
};

// 3. MAHKOTA KRISTAL HOLOGRAM (melayang di atas kepala)
export const drawCrown: DrawFn = (ctx, g, t) => {
  const { forehead, eyeDistance, angle } = g;

  ctx.translate(forehead.x, forehead.y - eyeDistance * 0.65);
  ctx.rotate(angle);

  const crownWidth = eyeDistance * 2.1;
  const crownHeight = eyeDistance * 0.95;
  const floatOffset = Math.sin(t) * (eyeDistance * 0.05);
  ctx.translate(0, floatOffset);

  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 18;

  // Cincin halo
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
  ctx.lineWidth = Math.max(2, eyeDistance * 0.03);
  ctx.beginPath();
  ctx.ellipse(0, -crownHeight * 0.25, crownWidth * 0.58, crownHeight * 0.22, 0, 0, Math.PI * 2);
  ctx.stroke();

  // 5 kristal
  const spires = [
    { x: -crownWidth * 0.42, h: crownHeight * 0.55, w: crownWidth * 0.13, color: 'rgba(168, 85, 247, 0.85)' },
    { x: -crownWidth * 0.22, h: crownHeight * 0.78, w: crownWidth * 0.15, color: 'rgba(56, 189, 248, 0.88)' },
    { x: 0, h: crownHeight * 1.05, w: crownWidth * 0.19, color: 'rgba(250, 204, 21, 0.92)' },
    { x: crownWidth * 0.22, h: crownHeight * 0.78, w: crownWidth * 0.15, color: 'rgba(56, 189, 248, 0.88)' },
    { x: crownWidth * 0.42, h: crownHeight * 0.55, w: crownWidth * 0.13, color: 'rgba(168, 85, 247, 0.85)' },
  ];

  spires.forEach((s) => {
    ctx.fillStyle = s.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(s.x, -s.h);
    ctx.lineTo(s.x + s.w * 0.5, -s.h * 0.3);
    ctx.lineTo(s.x + s.w * 0.35, 0);
    ctx.lineTo(s.x - s.w * 0.35, 0);
    ctx.lineTo(s.x - s.w * 0.5, -s.h * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // Pita dasar
  const bandGrad = ctx.createLinearGradient(-crownWidth * 0.48, 0, crownWidth * 0.48, 0);
  bandGrad.addColorStop(0, '#a855f7');
  bandGrad.addColorStop(0.5, '#facc15');
  bandGrad.addColorStop(1, '#38bdf8');
  ctx.fillStyle = bandGrad;
  ctx.beginPath();
  ctx.roundRect(-crownWidth * 0.48, -crownHeight * 0.08, crownWidth * 0.96, crownHeight * 0.16, 6);
  ctx.fill();
  ctx.stroke();

  // Permata tengah
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -crownHeight * 0.45);
  ctx.lineTo(crownWidth * 0.045, -crownHeight * 0.32);
  ctx.lineTo(0, -crownHeight * 0.19);
  ctx.lineTo(-crownWidth * 0.045, -crownHeight * 0.32);
  ctx.closePath();
  ctx.fill();
};

// ============================================================
// AKSESORI TAMBAHAN
// Satuan ukuran: d = eyeDistance. Setelah rotate(angle), sumbu x searah garis mata
// dan sumbu y negatif = ke atas kepala.
// ============================================================
const SIDES = [-1, 1];

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// 4. TOPI WISUDA
export const drawGraduationCap: DrawFn = (ctx, g) => {
  const { forehead, eyeDistance: d, angle } = g;
  ctx.translate(forehead.x, forehead.y - d * 0.12);
  ctx.rotate(angle);
  ctx.lineWidth = Math.max(1.5, d * 0.02);

  // bagian yang menutupi kepala
  ctx.fillStyle = '#111827';
  ctx.strokeStyle = '#374151';
  ctx.beginPath();
  ctx.roundRect(-d * 0.85, -d * 0.55, d * 1.7, d * 0.55, d * 0.12);
  ctx.fill();
  ctx.stroke();

  // papan datar
  ctx.fillStyle = '#0b1220';
  ctx.strokeStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(-d * 1.35, -d * 0.62);
  ctx.lineTo(0, -d * 0.98);
  ctx.lineTo(d * 1.35, -d * 0.62);
  ctx.lineTo(0, -d * 0.28);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // kancing, tali, dan jumbai emas
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(0, -d * 0.63, d * 0.06, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = Math.max(2, d * 0.035);
  ctx.beginPath();
  ctx.moveTo(0, -d * 0.63);
  ctx.lineTo(d * 1.0, -d * 0.56);
  ctx.lineTo(d * 1.05, -d * 0.18);
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(d * 0.97, -d * 0.2, d * 0.16, d * 0.26, d * 0.04);
  ctx.fill();
};

// 5. IKAT KEPALA MERAH PUTIH
export const drawMerahPutih: DrawFn = (ctx, g) => {
  const { forehead, eyeDistance: d, angle, faceWidth } = g;
  ctx.translate(forehead.x, forehead.y + d * 0.1);
  ctx.rotate(angle);

  const w = faceWidth * 1.02;
  const h = d * 0.3;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 6;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, h * 0.4);
  ctx.clip();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-w / 2, -h / 2, w, h / 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(-w / 2, 0, w, h / 2);
  ctx.restore();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = Math.max(1.5, d * 0.02);
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, h * 0.4);
  ctx.stroke();
};

// 6. TELINGA KUCING
export const drawCatEars: DrawFn = (ctx, g) => {
  const { forehead, eyeDistance: d, angle, faceWidth } = g;
  ctx.translate(forehead.x, forehead.y - d * 0.05);
  ctx.rotate(angle);

  const sx = faceWidth * 0.36;

  // bando
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = Math.max(3, d * 0.07);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-sx * 1.35, d * 0.12);
  ctx.quadraticCurveTo(0, -d * 0.28, sx * 1.35, d * 0.12);
  ctx.stroke();

  SIDES.forEach((s) => {
    ctx.save();
    ctx.translate(s * sx, -d * 0.1);
    ctx.rotate(s * 0.28);

    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = Math.max(1.5, d * 0.025);
    ctx.beginPath();
    ctx.moveTo(-d * 0.3, 0);
    ctx.lineTo(0, -d * 0.8);
    ctx.lineTo(d * 0.3, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.moveTo(-d * 0.17, -d * 0.04);
    ctx.lineTo(0, -d * 0.52);
    ctx.lineTo(d * 0.17, -d * 0.04);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
};

// 7. KACAMATA BULAT KLASIK
export const drawRoundGlasses: DrawFn = (ctx, g) => {
  const { leftEye, rightEye, eyeDistance: d, angle } = g;
  ctx.translate((leftEye.x + rightEye.x) / 2, (leftEye.y + rightEye.y) / 2);
  ctx.rotate(angle);

  const cx = d * 0.35;
  const r = d * 0.3;

  ctx.lineWidth = Math.max(2.5, d * 0.055);
  ctx.strokeStyle = '#b45309';
  ctx.fillStyle = 'rgba(186, 230, 253, 0.18)';
  SIDES.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s * cx, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // jembatan & gagang
  ctx.beginPath();
  ctx.moveTo(-cx + r, -r * 0.2);
  ctx.quadraticCurveTo(0, -r * 0.6, cx - r, -r * 0.2);
  ctx.moveTo(-cx - r, -r * 0.1);
  ctx.lineTo(-d * 0.8, 0);
  ctx.moveTo(cx + r, -r * 0.1);
  ctx.lineTo(d * 0.8, 0);
  ctx.stroke();

  // kilau
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = Math.max(1.5, d * 0.03);
  SIDES.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s * cx, 0, r * 0.7, Math.PI * 1.15, Math.PI * 1.45);
    ctx.stroke();
  });
};

// 8. KACAMATA HITAM
export const drawSunglasses: DrawFn = (ctx, g) => {
  const { leftEye, rightEye, eyeDistance: d, angle } = g;
  ctx.translate((leftEye.x + rightEye.x) / 2, (leftEye.y + rightEye.y) / 2);
  ctx.rotate(angle);

  const cx = d * 0.35;
  const w = d * 0.68;
  const h = d * 0.46;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.fillStyle = 'rgba(8, 8, 12, 0.93)';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = Math.max(2.5, d * 0.05);
  SIDES.forEach((s) => {
    ctx.beginPath();
    ctx.roundRect(s * cx - w / 2, -h * 0.55, w, h, d * 0.16);
    ctx.fill();
    ctx.stroke();
  });

  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.moveTo(-cx + w / 2, -h * 0.25);
  ctx.lineTo(cx - w / 2, -h * 0.25);
  ctx.moveTo(-cx - w / 2, -h * 0.25);
  ctx.lineTo(-d * 0.85, -h * 0.2);
  ctx.moveTo(cx + w / 2, -h * 0.25);
  ctx.lineTo(d * 0.85, -h * 0.2);
  ctx.stroke();

  // kilau
  ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
  SIDES.forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(s * cx - w * 0.3, -h * 0.45);
    ctx.lineTo(s * cx - w * 0.12, -h * 0.45);
    ctx.lineTo(s * cx - w * 0.28, h * 0.25);
    ctx.lineTo(s * cx - w * 0.42, h * 0.25);
    ctx.closePath();
    ctx.fill();
  });
};

// 9. LINGKARAN CAHAYA (HALO)
export const drawHalo: DrawFn = (ctx, g, t) => {
  const { forehead, eyeDistance: d, angle } = g;
  ctx.translate(forehead.x, forehead.y - d * 0.8 + Math.sin(t) * d * 0.04);
  ctx.rotate(angle);

  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = Math.max(4, d * 0.09);
  ctx.beginPath();
  ctx.ellipse(0, 0, d * 0.62, d * 0.17, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(254, 249, 195, 0.9)';
  ctx.lineWidth = Math.max(1.5, d * 0.035);
  ctx.beginPath();
  ctx.ellipse(0, 0, d * 0.62, d * 0.17, 0, 0, Math.PI * 2);
  ctx.stroke();
};

// 10. TOPI PENYIHIR
export const drawWizardHat: DrawFn = (ctx, g) => {
  const { forehead, eyeDistance: d, angle } = g;
  ctx.translate(forehead.x, forehead.y - d * 0.15);
  ctx.rotate(angle);

  // kerucut topi
  const grad = ctx.createLinearGradient(0, -d * 1.9, 0, 0);
  grad.addColorStop(0, '#7c3aed');
  grad.addColorStop(1, '#4c1d95');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#2e1065';
  ctx.lineWidth = Math.max(1.5, d * 0.025);
  ctx.beginPath();
  ctx.moveTo(-d * 0.8, -d * 0.1);
  ctx.quadraticCurveTo(-d * 0.3, -d * 1.2, d * 0.35, -d * 1.85);
  ctx.quadraticCurveTo(d * 0.5, -d * 1.2, d * 0.8, -d * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // bintang
  ctx.fillStyle = '#fde047';
  drawStar(ctx, -d * 0.18, -d * 0.7, d * 0.1);
  drawStar(ctx, d * 0.22, -d * 1.1, d * 0.075);
  drawStar(ctx, d * 0.3, -d * 0.45, d * 0.065);

  // pita emas
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = Math.max(3, d * 0.08);
  ctx.beginPath();
  ctx.moveTo(-d * 0.78, -d * 0.16);
  ctx.quadraticCurveTo(0, d * 0.02, d * 0.78, -d * 0.16);
  ctx.stroke();

  // pinggiran topi
  ctx.fillStyle = '#3b0764';
  ctx.strokeStyle = '#2e1065';
  ctx.lineWidth = Math.max(1.5, d * 0.025);
  ctx.beginPath();
  ctx.ellipse(0, -d * 0.02, d * 1.25, d * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

// 11. MAHKOTA BUNGA
const PETAL_COLORS = ['#f472b6', '#ffffff', '#fbbf24', '#c4b5fd', '#fb7185'];

export const drawFlowerCrown: DrawFn = (ctx, g) => {
  const { forehead, eyeDistance: d, angle, faceWidth } = g;
  ctx.translate(forehead.x, forehead.y + d * 0.02);
  ctx.rotate(angle);

  const half = faceWidth * 0.5;
  const n = 9;
  const pos = (i: number) => {
    const u = (i / n) * 2 - 1;
    return { x: u * half, y: d * 0.28 * u * u - d * 0.12 };
  };

  // tangkai
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = Math.max(3, d * 0.06);
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const { x, y } = pos(i);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // daun kecil di sela bunga
  ctx.fillStyle = '#22c55e';
  for (let i = 0; i < n; i++) {
    const a = pos(i);
    const b = pos(i + 1);
    ctx.beginPath();
    ctx.ellipse((a.x + b.x) / 2, (a.y + b.y) / 2 - d * 0.07, d * 0.1, d * 0.045, -0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  // bunga
  for (let i = 0; i <= n; i++) {
    const { x, y } = pos(i);
    const r = d * (0.17 + 0.04 * (i % 2));
    ctx.fillStyle = PETAL_COLORS[i % PETAL_COLORS.length];
    for (let k = 0; k < 5; k++) {
      const a = (k * 2 * Math.PI) / 5 + i;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.55, r * 0.4, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
};

// 12. TOPENG PAHLAWAN
export const drawHeroMask: DrawFn = (ctx, g) => {
  const { leftEye, rightEye, eyeDistance: d, angle } = g;
  ctx.translate((leftEye.x + rightEye.x) / 2, (leftEye.y + rightEye.y) / 2);
  ctx.rotate(angle);

  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = '#dc2626';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1.5, d * 0.025);

  ctx.beginPath();
  // bentuk luar topeng
  ctx.moveTo(-d * 0.95, -d * 0.1);
  ctx.quadraticCurveTo(-d * 0.5, -d * 0.55, 0, -d * 0.3);
  ctx.quadraticCurveTo(d * 0.5, -d * 0.55, d * 0.95, -d * 0.1);
  ctx.quadraticCurveTo(d * 0.8, d * 0.4, d * 0.3, d * 0.38);
  ctx.quadraticCurveTo(0, d * 0.2, -d * 0.3, d * 0.38);
  ctx.quadraticCurveTo(-d * 0.8, d * 0.4, -d * 0.95, -d * 0.1);
  ctx.closePath();
  // lubang mata (even-odd supaya bolong)
  ctx.ellipse(-d * 0.35, 0, d * 0.22, d * 0.15, 0.15, 0, Math.PI * 2);
  ctx.moveTo(d * 0.35 + d * 0.22, 0);
  ctx.ellipse(d * 0.35, 0, d * 0.22, d * 0.15, -0.15, 0, Math.PI * 2);
  ctx.fill('evenodd');
  ctx.stroke();
};

// 13. KUMIS
export const drawMustache: DrawFn = (ctx, g) => {
  const { noseBase, upperLip, eyeDistance: d, angle } = g;
  ctx.translate(
    noseBase.x + (upperLip.x - noseBase.x) * 0.6,
    noseBase.y + (upperLip.y - noseBase.y) * 0.6
  );
  ctx.rotate(angle);

  ctx.fillStyle = '#1f1305';
  ctx.strokeStyle = '#3b2a12';
  ctx.lineWidth = Math.max(1, d * 0.015);
  SIDES.forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(0, -d * 0.02);
    ctx.bezierCurveTo(s * d * 0.15, -d * 0.12, s * d * 0.4, -d * 0.1, s * d * 0.5, d * 0.06);
    ctx.bezierCurveTo(s * d * 0.42, 0, s * d * 0.28, d * 0.04, s * d * 0.15, d * 0.07);
    ctx.bezierCurveTo(s * d * 0.08, d * 0.09, s * d * 0.02, d * 0.07, 0, d * 0.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
};
