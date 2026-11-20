import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function generateCinematicPortrait() {
  const srcPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795157951044_43c1a33c.jpg';
  const img = await loadImage(srcPath);

  const origW = img.width;  // 1024
  const origH = img.height; // 768

  const origCanvas = createCanvas(origW, origH);
  const origCtx = origCanvas.getContext('2d');
  origCtx.drawImage(img, 0, 0);

  const origData = origCtx.getImageData(0, 0, origW, origH);
  const src = origData.data;

  // 1. Flood-fill from borders
  const isBg = new Uint8Array(origW * origH);
  const queue = [];

  function isWhiteBackdrop(idx) {
    const r = src[idx], g = src[idx + 1], b = src[idx + 2];
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
    return r > 210 && g > 210 && b > 210 && maxDiff < 32;
  }

  for (let x = 0; x < origW; x++) {
    const top = (0 * origW + x) * 4;
    if (isWhiteBackdrop(top)) { isBg[0 * origW + x] = 1; queue.push(x, 0); }
    const bot = ((origH - 1) * origW + x) * 4;
    if (isWhiteBackdrop(bot)) { isBg[(origH - 1) * origW + x] = 1; queue.push(x, origH - 1); }
  }
  for (let y = 0; y < origH; y++) {
    const l = (y * origW + 0) * 4;
    if (isWhiteBackdrop(l)) { isBg[y * origW + 0] = 1; queue.push(0, y); }
    const r = (y * origW + (origW - 1)) * 4;
    if (isWhiteBackdrop(r)) { isBg[y * origW + (origW - 1)] = 1; queue.push(origW - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < origW && ny >= 0 && ny < origH) {
        const nPos = ny * origW + nx;
        if (!isBg[nPos]) {
          const idx = nPos * 4;
          if (isWhiteBackdrop(idx)) {
            isBg[nPos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // 2. Erosion and edge feathering
  const mask = new Float32Array(origW * origH);
  for (let i = 0; i < origW * origH; i++) mask[i] = isBg[i] ? 0.0 : 1.0;

  const eroded = new Float32Array(origW * origH);
  for (let y = 2; y < origH - 2; y++) {
    for (let x = 2; x < origW - 2; x++) {
      let minVal = 1.0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy <= 5) {
            const val = mask[(y + dy) * origW + (x + dx)];
            if (val < minVal) minVal = val;
          }
        }
      }
      eroded[y * origW + x] = minVal;
    }
  }

  const smoothAlpha = new Float32Array(origW * origH);
  for (let y = 3; y < origH - 3; y++) {
    for (let x = 3; x < origW - 3; x++) {
      let sum = 0;
      let count = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const w = 1.0 / (1.0 + (dx * dx + dy * dy) * 0.4);
          sum += eroded[(y + dy) * origW + (x + dx)] * w;
          count += w;
        }
      }
      smoothAlpha[y * origW + x] = sum / count;
    }
  }

  // Canvas dimensions
  const outW = 640;
  const outH = 860;
  const outCanvas = createCanvas(outW, outH);
  const outCtx = outCanvas.getContext('2d');

  // Deep black background with subtle warm radial illumination (matching reference photo)
  outCtx.fillStyle = '#000000';
  outCtx.fillRect(0, 0, outW, outH);

  // Soft atmospheric warm studio glow behind head (matching reference photo)
  const glow = outCtx.createRadialGradient(outW * 0.5, 200, 30, outW * 0.5, 200, 320);
  glow.addColorStop(0, 'rgba(45, 34, 25, 0.45)');
  glow.addColorStop(0.4, 'rgba(22, 17, 13, 0.25)');
  glow.addColorStop(0.8, 'rgba(8, 6, 5, 0.10)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = glow;
  outCtx.fillRect(0, 0, outW, outH);

  const outImgData = outCtx.getImageData(0, 0, outW, outH);
  const dst = outImgData.data;

  // Transparent canvas export
  const transCanvas = createCanvas(outW, outH);
  const transCtx = transCanvas.getContext('2d');
  const transImgData = transCtx.createImageData(outW, outH);
  const tdst = transImgData.data;

  const cropX = Math.round(512 - outW / 2); // 192
  const cropY = 40;

  const faceCenterX = outW * 0.5; // 320
  const faceCenterY = 190;

  for (let oy = 0; oy < outH; oy++) {
    const sy = oy + cropY;
    if (sy >= origH || sy < 0) continue;

    for (let ox = 0; ox < outW; ox++) {
      const sx = ox + cropX;
      if (sx >= origW || sx < 0) continue;

      const sPos = sy * origW + sx;
      const a = smoothAlpha[sPos];
      if (a <= 0.001) continue;

      const sIdx = sPos * 4;
      let r = src[sIdx];
      let g = src[sIdx + 1];
      let b = src[sIdx + 2];

      // Decontaminate white background bleed on edges
      if (a < 0.98) {
        r = Math.max(0, Math.min(255, (r - (1 - a) * 250) / a));
        g = Math.max(0, Math.min(255, (g - (1 - a) * 250) / a));
        b = Math.max(0, Math.min(255, (b - (1 - a) * 250) / a));
      }

      // ----------------------------------------------------
      // 1. DIRECTIONAL CHIAROSCURO LIGHTING
      // ----------------------------------------------------
      const relX = (ox - faceCenterX) / (outW * 0.35);
      let lightFactor = 1.0 - (relX * 0.20);
      lightFactor = Math.max(0.60, Math.min(1.15, lightFactor));

      // ----------------------------------------------------
      // 2. SEAMLESS DISSOLVE INTO BLACK (MATCHING REFERENCE)
      // ----------------------------------------------------
      let bodyFalloff = 1.0;

      // Bottom vertical falloff: smooth dissolve starting right below chest (oy=340 down to 600)
      if (oy > 340) {
        const p = Math.min(1.0, (oy - 340) / 280);
        // Smoothstep cubic
        const smoothP = p * p * (3 - 2 * p);
        bodyFalloff *= (1.0 - smoothP);
      }

      // Lateral (left & right) edge falloff on shoulders & arms:
      // Smoothly melt the outer edges of the suit into #000000
      const distFromCenter = Math.abs(ox - faceCenterX);
      if (oy > 200 && distFromCenter > 130) {
        const maxDist = 260; // outside boundary where suit completely dissolves
        const p = Math.min(1.0, Math.max(0, (distFromCenter - 130) / (maxDist - 130)));
        const smoothP = p * p * (3 - 2 * p);
        bodyFalloff *= (1.0 - smoothP * 0.98);
      }

      // Top of hair soft blend
      if (oy < 85) {
        const topP = (85 - oy) / 85;
        bodyFalloff *= Math.max(0, 1.0 - topP * 0.30);
      }

      // ----------------------------------------------------
      // 3. COLOR GRADING (WARM AMBER SKIN + RICH BLACK SUIT)
      // ----------------------------------------------------
      const isSkin = (r > 80 && g > 50 && r > b) && !(r > 200 && g > 200 && b > 200);
      const isShirt = (r > 190 && g > 190 && b > 190);

      if (isSkin) {
        // Boost warm amber/golden tones (match reference)
        r = Math.min(255, r * 1.09 * lightFactor);
        g = Math.min(255, g * 0.97 * lightFactor);
        b = Math.min(255, b * 0.85 * lightFactor);
      } else if (isShirt) {
        r = Math.min(255, r * lightFactor * 0.95);
        g = Math.min(255, g * lightFactor * 0.95);
        b = Math.min(255, b * lightFactor * 0.95);
      } else {
        // Suit fabric: deep velvety black
        const suitFactor = Math.pow(lightFactor, 1.3) * bodyFalloff;
        r = r * 0.75 * suitFactor;
        g = g * 0.75 * suitFactor;
        b = b * 0.78 * suitFactor;
      }

      const finalAlpha = Math.max(0, Math.min(1.0, a * bodyFalloff));

      // Composite onto outCanvas
      const dIdx = (oy * outW + ox) * 4;
      const bgR = dst[dIdx];
      const bgG = dst[dIdx + 1];
      const bgB = dst[dIdx + 2];

      dst[dIdx] = Math.round(bgR * (1 - finalAlpha) + r * finalAlpha);
      dst[dIdx + 1] = Math.round(bgG * (1 - finalAlpha) + g * finalAlpha);
      dst[dIdx + 2] = Math.round(bgB * (1 - finalAlpha) + b * finalAlpha);
      dst[dIdx + 3] = 255;

      // Transparent version (RGB fades to 0 where alpha fades to 0)
      tdst[dIdx] = Math.round(r * finalAlpha);
      tdst[dIdx + 1] = Math.round(g * finalAlpha);
      tdst[dIdx + 2] = Math.round(b * finalAlpha);
      tdst[dIdx + 3] = Math.round(finalAlpha * 255);
    }
  }

  outCtx.putImageData(outImgData, 0, 0);
  transCtx.putImageData(transImgData, 0, 0);

  fs.writeFileSync('public/images/arjay-cinematic-portrait.png', outCanvas.toBuffer('image/png'));
  fs.writeFileSync('public/images/arjay-portrait-transparent.png', transCanvas.toBuffer('image/png'));

  console.log('Saved both opaque and transparent portraits with smooth lateral dissolve!');
}

generateCinematicPortrait().catch(console.error);
