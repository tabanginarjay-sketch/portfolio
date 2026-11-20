import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

async function main() {
  const srcPath =
    'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795157951044_43c1a33c.jpg';
  const img = await loadImage(srcPath);
  const W = img.width;
  const H = img.height;

  const srcCanvas = createCanvas(W, H);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);
  const src = srcCtx.getImageData(0, 0, W, H).data;

  // -------------------------------------------------------------------------
  // 1. ESTIMATE LOCAL WHITE BACKDROP COLOR PER ROW (left & right margins)
  // -------------------------------------------------------------------------
  const rowBgR = new Float32Array(H);
  const rowBgG = new Float32Array(H);
  const rowBgB = new Float32Array(H);
  for (let y = 0; y < H; y++) {
    let sr = 0, sg = 0, sb = 0, cnt = 0;
    for (let x = 0; x < 120; x++) {
      const i = (y * W + x) * 4;
      sr += src[i]; sg += src[i + 1]; sb += src[i + 2]; cnt++;
    }
    for (let x = W - 120; x < W; x++) {
      const i = (y * W + x) * 4;
      sr += src[i]; sg += src[i + 1]; sb += src[i + 2]; cnt++;
    }
    rowBgR[y] = sr / cnt;
    rowBgG[y] = sg / cnt;
    rowBgB[y] = sb / cnt;
  }

  // -------------------------------------------------------------------------
  // 2. DEFINITE BACKGROUND VIA MULTI-BORDER FLOOD FILL
  // -------------------------------------------------------------------------
  const defBg = new Uint8Array(W * H);
  const qx = new Int32Array(W * H);
  const qy = new Int32Array(W * H);
  let qHead = 0, qTail = 0;

  const isPureBg = (x, y) => {
    const i = (y * W + x) * 4;
    const r = src[i], g = src[i + 1], b = src[i + 2];
    const dr = r - rowBgR[y];
    const dg = g - rowBgG[y];
    const db = b - rowBgB[y];
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    // Strict pure backdrop (very close to local white studio wall)
    return dist < 18 && chroma < 14 && r > 228 && g > 228 && b > 228;
  };

  const pushBg = (x, y) => {
    const pos = y * W + x;
    if (!defBg[pos] && isPureBg(x, y)) {
      defBg[pos] = 1;
      qx[qTail] = x;
      qy[qTail] = y;
      qTail++;
    }
  };

  for (let x = 0; x < W; x++) { pushBg(x, 0); pushBg(x, H - 1); }
  for (let y = 0; y < H; y++) { pushBg(0, y); pushBg(W - 1, y); }

  while (qHead < qTail) {
    const cx = qx[qHead], cy = qy[qHead];
    qHead++;
    if (cx + 1 < W) pushBg(cx + 1, cy);
    if (cx - 1 >= 0) pushBg(cx - 1, cy);
    if (cy + 1 < H) pushBg(cx, cy + 1);
    if (cy - 1 >= 0) pushBg(cx, cy - 1);
  }

  // Also catch any tiny enclosed white-backdrop specks strictly in the hair region (y < 230)
  // that might peek through hair wisps (far above the white shirt collar which starts around y > 265)
  for (let y = 20; y < 235; y++) {
    for (let x = 300; x < 720; x++) {
      const pos = y * W + x;
      if (defBg[pos]) continue;
      const i = pos * 4;
      const r = src[i], g = src[i + 1], b = src[i + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (r > 205 && g > 205 && b > 205 && chroma < 16) {
        // Check if near outer background (within 10px)
        let nearBg = false;
        for (let dy = -10; dy <= 10 && !nearBg; dy += 2) {
          for (let dx = -10; dx <= 10 && !nearBg; dx += 2) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < W && ny >= 0 && ny < H && defBg[ny * W + nx]) {
              nearBg = true;
            }
          }
        }
        if (nearBg) defBg[pos] = 1;
      }
    }
  }

  // -------------------------------------------------------------------------
  // 3. DISTANCE TRANSFORM FROM DEFINITE BACKGROUND (FOR TRIMAP)
  // -------------------------------------------------------------------------
  // dBg[pos] = approximate pixel distance inside foreground from nearest defBg pixel
  const MAX_DIST = 10;
  const dBg = new Uint8Array(W * H);
  dBg.fill(255);
  qHead = 0; qTail = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const pos = y * W + x;
      if (defBg[pos]) {
        dBg[pos] = 0;
        // Only seed frontier bg pixels that touch non-bg
        let touchesFg = false;
        if (x + 1 < W && !defBg[pos + 1]) touchesFg = true;
        else if (x - 1 >= 0 && !defBg[pos - 1]) touchesFg = true;
        else if (y + 1 < H && !defBg[pos + W]) touchesFg = true;
        else if (y - 1 >= 0 && !defBg[pos - W]) touchesFg = true;
        if (touchesFg) {
          qx[qTail] = x; qy[qTail] = y; qTail++;
        }
      }
    }
  }

  while (qHead < qTail) {
    const cx = qx[qHead], cy = qy[qHead];
    qHead++;
    const cd = dBg[cy * W + cx];
    if (cd >= MAX_DIST) continue;
    const nd = cd + 1;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const [dx, dy] of dirs) {
      const nx = cx + dx, ny = cy + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        const nPos = ny * W + nx;
        if (dBg[nPos] > nd) {
          dBg[nPos] = nd;
          qx[qTail] = nx; qy[qTail] = ny; qTail++;
        }
      }
    }
  }

  // Trimap definition:
  // dBg == 0          -> Definite Background (except 1px immediate border solved continuously)
  // 1 <= dBg <= 4     -> Unknown Edge Band (closed-form alpha matting!)
  // dBg >= 5          -> Definite Foreground (alpha = 1.0, pure untouched interior)
  const UNKNOWN_RAD = 4;

  // -------------------------------------------------------------------------
  // 4. CLOSED-FORM ORTHOGONAL PROJECTION ALPHA MATTING & DECONTAMINATION
  // -------------------------------------------------------------------------
  const alpha = new Float32Array(W * H);
  const cleanR = new Float32Array(W * H);
  const cleanG = new Float32Array(W * H);
  const cleanB = new Float32Array(W * H);

  for (let y = 0; y < H; y++) {
    const wr = rowBgR[y], wg = rowBgG[y], wb = rowBgB[y];
    for (let x = 0; x < W; x++) {
      const pos = y * W + x;
      const i = pos * 4;
      const r = src[i], g = src[i + 1], b = src[i + 2];
      const d = dBg[pos];

      if (d === 0) {
        alpha[pos] = 0;
        cleanR[pos] = r; cleanG[pos] = g; cleanB[pos] = b;
        continue;
      }

      if (d > UNKNOWN_RAD) {
        alpha[pos] = 1.0;
        cleanR[pos] = r; cleanG[pos] = g; cleanB[pos] = b;
        continue;
      }

      // Sample nearest Definite Foreground pixels (dBg > UNKNOWN_RAD) within radius 9px
      let fr = 0, fg = 0, fb = 0, wSum = 0;
      const searchR = 9;
      for (let dy = -searchR; dy <= searchR; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= H) continue;
        for (let dx = -searchR; dx <= searchR; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= W) continue;
          const nPos = ny * W + nx;
          if (dBg[nPos] > UNKNOWN_RAD) {
            const dist2 = dx * dx + dy * dy;
            if (dist2 <= searchR * searchR) {
              const wt = 1.0 / (dist2 + 1.0);
              const ni = nPos * 4;
              fr += src[ni] * wt;
              fg += src[ni + 1] * wt;
              fb += src[ni + 2] * wt;
              wSum += wt;
            }
          }
        }
      }

      if (wSum === 0) {
        // Fallback if very thin strand (e.g. stray hair tip): use dark hair color
        fr = 22; fg = 22; fb = 25;
      } else {
        fr /= wSum; fg /= wSum; fb /= wSum;
      }

      // Orthogonal projection onto line from W to F_local in RGB space:
      // C = a * F_local + (1 - a) * W  =>  W - C = a * (W - F_local)
      const vr = wr - fr, vg = wg - fg, vb = wb - fb;
      const ur = wr - r,  ug = wg - g,  ub = wb - b;
      const denom = vr * vr + vg * vg + vb * vb;

      let a = 1.0;
      if (denom > 100) {
        a = (ur * vr + ug * vg + ub * vb) / denom;
        // Soft threshold to eliminate tiny JPEG noise in white background while preserving crisp edges
        a = clamp((a - 0.06) / 0.88, 0, 1);
      }

      // Smoothly taper outer 1px slightly to eliminate any lingering bright pixel
      if (d === 1) {
        a = Math.pow(a, 1.35);
      }

      alpha[pos] = a;

      // Clean foreground color recovery (NO white halo, NO orange blowout!)
      // Blend smoothly between exact unmixed pixel and local interior foreground color
      const safeA = Math.max(a, 0.35);
      const unmixR = clamp((r - (1 - a) * wr) / safeA, 0, 255);
      const unmixG = clamp((g - (1 - a) * wg) / safeA, 0, 255);
      const unmixB = clamp((b - (1 - a) * wb) / safeA, 0, 255);

      // More reliance on clean interior F_local near outer transparent edge
      const mixW = a * a * a;
      cleanR[pos] = mixW * unmixR + (1 - mixW) * fr;
      cleanG[pos] = mixW * unmixG + (1 - mixW) * fg;
      cleanB[pos] = mixW * unmixB + (1 - mixW) * fb;
    }
  }

  // Ultra-subtle 3x3 anti-aliasing pass ONLY on the unknown edge band (never blurs interior!)
  const finalAlpha = new Float32Array(alpha);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const pos = y * W + x;
      if (dBg[pos] >= 1 && dBg[pos] <= UNKNOWN_RAD) {
        const avg =
          (alpha[pos] * 4 +
            alpha[pos - 1] * 2 +
            alpha[pos + 1] * 2 +
            alpha[pos - W] * 2 +
            alpha[pos + W] * 2 +
            alpha[pos - W - 1] +
            alpha[pos - W + 1] +
            alpha[pos + W - 1] +
            alpha[pos + W + 1]) /
          16;
        finalAlpha[pos] = avg;
      }
    }
  }

  // Find exact bounding box of matted subject for clean framing
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (finalAlpha[y * W + x] > 0.05) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log('Clean matted bbox:', { minX, maxX, minY, maxY, w: maxX - minX, h: maxY - minY, cx: (minX + maxX) / 2 });

  // -------------------------------------------------------------------------
  // 5. CONTINUOUS STUDIO RELIGHTING & EDITORIAL COLOR GRADING (NO BLOTCHES!)
  // -------------------------------------------------------------------------
  // Crop tightly and cleanly with balanced studio padding around Ar-jay
  // Subject spans roughly x: 340..712 (center ~526), y: 52..767
  const padX = 55;
  const padTop = 30;
  const cropX = Math.max(0, Math.round((minX + maxX) / 2 - (maxX - minX) / 2 - padX));
  const cropW = Math.min(W - cropX, Math.round((maxX - minX) + padX * 2));
  const cropY = Math.max(0, minY - padTop);
  const cropH = H - cropY;

  console.log('Output transparent portrait dimensions:', cropW, 'x', cropH, 'from', { cropX, cropY });

  const outCanvas = createCanvas(cropW, cropH);
  const outCtx = outCanvas.getContext('2d');
  const outImg = outCtx.createImageData(cropW, cropH);
  const dst = outImg.data;

  // Face center in output coordinates (for subtle Rembrandt studio lighting)
  const faceX = 524 - cropX;
  const faceY = 175 - cropY;

  for (let oy = 0; oy < cropH; oy++) {
    const sy = oy + cropY;
    for (let ox = 0; ox < cropW; ox++) {
      const sx = ox + cropX;
      const pos = sy * W + sx;
      let a = finalAlpha[pos];
      if (a <= 0.002) continue;

      let r = cleanR[pos] / 255;
      let g = cleanG[pos] / 255;
      let b = cleanB[pos] / 255;

      // A. Smooth continuous Filmic Contrast + Shadow Depth Curve (zero hard thresholds!)
      // Deepens dusty dark greys of the suit into rich tailored obsidian black while keeping midtones crisp
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const shadowGamma = 1.0 + 0.32 * Math.pow(1 - lum, 2.1); // 1.32 in deep blacks -> 1.0 in highlights
      r = Math.pow(clamp(r, 0, 1), shadowGamma);
      g = Math.pow(clamp(g, 0, 1), shadowGamma);
      b = Math.pow(clamp(b, 0, 1), shadowGamma);

      // Velvety studio highlight roll-off (removes flat white flash glare on collar & forehead)
      const rolloff = (v) => (v > 0.68 ? 0.68 + (v - 0.68) * 0.62 : v);
      r = rolloff(r);
      g = rolloff(g);
      b = rolloff(b);

      // B. Continuous Subtle Editorial Color Balance (warm golden midtones, clean neutral blacks & whites)
      const midtoneWeight = 4 * lum * (1 - lum); // Smooth bell curve peaking at 0.5 luminance
      r *= 1.0 + 0.05 * midtoneWeight;
      g *= 1.0 - 0.008 * midtoneWeight;
      b *= 1.0 - 0.07 * midtoneWeight;

      // C. Subtle Sculpted Studio Lighting (Rembrandt key light from front-left, gentle shadow falloff right & down)
      const relX = (ox - faceX) / (cropW * 0.42); // -1 on left, +1 on right
      const relY = (oy - faceY) / (cropH * 0.72);

      // Tasteful directional studio modeling (face stays clear, warm & sculpted)
      const dirLight = clamp(1.04 - relX * 0.16 - Math.max(0, relY) * 0.10, 0.70, 1.08);

      // Smooth shadow falloff below folded arms so lower waist & tiny bottom shirt sliver melt cleanly into obsidian
      const lowerDim = 1.0 - 0.75 * smoothstep(cropH * 0.58, cropH * 0.86, oy);

      // Subtle 3D edge wrap on far outer sleeves so edges feel naturally shot in a dark studio
      const outerEdgeFactor =
        1.0 - 0.24 * smoothstep(0.32, 0.50, Math.abs(ox - faceX) / cropW) * smoothstep(cropH * 0.26, cropH * 0.52, oy);

      const totalLight = dirLight * lowerDim * outerEdgeFactor;

      r = clamp(r * totalLight, 0, 1);
      g = clamp(g * totalLight, 0, 1);
      b = clamp(b * totalLight, 0, 1);

      // D. Seamless Bottom Alpha Dissolve (below crossed arms, completely 0 before bottom edge)
      const bottomFade = 1.0 - smoothstep(cropH * 0.65, cropH * 0.91, oy);
      a *= bottomFade;

      if (a <= 0.002) continue;

      const di = (oy * cropW + ox) * 4;
      dst[di] = Math.round(r * 255);
      dst[di + 1] = Math.round(g * 255);
      dst[di + 2] = Math.round(b * 255);
      dst[di + 3] = Math.round(a * 255);
    }
  }

  outCtx.putImageData(outImg, 0, 0);

  const outPath = 'public/images/arjay-portrait-hero.png';
  fs.writeFileSync(outPath, outCanvas.toBuffer('image/png'));
  console.log('Saved true transparent studio portrait:', outPath);

  // Also save a diagnostic composite on dark grey + black so we can inspect edges closely!
  const diagCanvas = createCanvas(cropW * 2, cropH);
  const diagCtx = diagCanvas.getContext('2d');
  // Left half: pure black + subtle radial glow (like hero)
  diagCtx.fillStyle = '#000000';
  diagCtx.fillRect(0, 0, cropW, cropH);
  const g1 = diagCtx.createRadialGradient(cropW / 2, cropH * 0.32, 20, cropW / 2, cropH * 0.32, cropW * 0.65);
  g1.addColorStop(0, 'rgba(60, 48, 42, 0.35)');
  g1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  diagCtx.fillStyle = g1;
  diagCtx.fillRect(0, 0, cropW, cropH);
  diagCtx.drawImage(outCanvas, 0, 0);

  // Right half: medium slate grey (#2a2f38) to mercilessly reveal ANY white halo, fringe, or speck!
  diagCtx.fillStyle = '#2a2f38';
  diagCtx.fillRect(cropW, 0, cropW, cropH);
  diagCtx.drawImage(outCanvas, cropW, 0);

  fs.writeFileSync('public/certificates/diag_portrait_check.png', diagCanvas.toBuffer('image/png'));
  console.log('Saved diagnostic inspection image: public/certificates/diag_portrait_check.png');
}

main().catch(console.error);
