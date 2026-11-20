import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function main() {
  const srcPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795157951044_43c1a33c.jpg';
  const img = await loadImage(srcPath);

  const W = img.width;  // 1024
  const H = img.height; // 768

  // Step 1: Read source image pixels
  const srcCanvas = createCanvas(W, H);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);

  const srcData = srcCtx.getImageData(0, 0, W, H);
  const src = srcData.data;

  // Step 2: Flood-fill to find all connected background pixels from border
  const isBg = new Uint8Array(W * H);
  const queue = [];

  function isWhiteBackdrop(idx) {
    const r = src[idx], g = src[idx + 1], b = src[idx + 2];
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
    return r > 215 && g > 215 && b > 215 && maxDiff < 30;
  }

  // Push border pixels
  for (let x = 0; x < W; x++) {
    const top = (0 * W + x) * 4;
    if (isWhiteBackdrop(top)) { isBg[0 * W + x] = 1; queue.push(x, 0); }
    const bot = ((H - 1) * W + x) * 4;
    if (isWhiteBackdrop(bot)) { isBg[(H - 1) * W + x] = 1; queue.push(x, H - 1); }
  }
  for (let y = 0; y < H; y++) {
    const l = (y * W + 0) * 4;
    if (isWhiteBackdrop(l)) { isBg[y * W + 0] = 1; queue.push(0, y); }
    const r = (y * W + (W - 1)) * 4;
    if (isWhiteBackdrop(r)) { isBg[y * W + (W - 1)] = 1; queue.push(W - 1, y); }
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
        const nPos = ny * W + nx;
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

  // Step 3: High-precision mask generation with 2px erosion to peel white edge
  const rawMask = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) rawMask[i] = isBg[i] ? 0.0 : 1.0;

  const eroded = new Float32Array(W * H);
  for (let y = 2; y < H - 2; y++) {
    for (let x = 2; x < W - 2; x++) {
      let minVal = 1.0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy <= 4.5) {
            const v = rawMask[(y + dy) * W + (x + dx)];
            if (v < minVal) minVal = v;
          }
        }
      }
      eroded[y * W + x] = minVal;
    }
  }

  // 3-pixel box blur for soft, natural anti-aliased edge
  const smoothMask = new Float32Array(W * H);
  for (let y = 3; y < H - 3; y++) {
    for (let x = 3; x < W - 3; x++) {
      let sum = 0, count = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          sum += eroded[(y + dy) * W + (x + dx)];
          count++;
        }
      }
      smoothMask[y * W + x] = sum / count;
    }
  }

  // Step 4: Output Composition
  // Crop window centered on Ar-jay:
  // Center is x=512, y=60..760
  // Output canvas: 600 x 780
  const outW = 600;
  const outH = 780;
  const cropStartX = Math.round(512 - outW / 2); // 212
  const cropStartY = 35;

  const outCanvas = createCanvas(outW, outH);
  const outCtx = outCanvas.getContext('2d');

  // Pure black background #000000
  outCtx.fillStyle = '#000000';
  outCtx.fillRect(0, 0, outW, outH);

  // Soft atmospheric warm studio glow behind head (matching reference photo media_1795157995104_df9d3543.png)
  const glow = outCtx.createRadialGradient(outW * 0.5, 175, 25, outW * 0.5, 175, 290);
  glow.addColorStop(0, 'rgba(40, 30, 22, 0.45)');
  glow.addColorStop(0.45, 'rgba(18, 14, 10, 0.22)');
  glow.addColorStop(0.85, 'rgba(6, 5, 4, 0.08)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = glow;
  outCtx.fillRect(0, 0, outW, outH);

  const outImgData = outCtx.getImageData(0, 0, outW, outH);
  const dst = outImgData.data;

  // Transparent output canvas
  const transCanvas = createCanvas(outW, outH);
  const transCtx = transCanvas.getContext('2d');
  const transImgData = transCtx.createImageData(outW, outH);
  const tdst = transImgData.data;

  const faceCenterX = outW * 0.5; // 300
  const faceCenterY = 175;

  for (let oy = 0; oy < outH; oy++) {
    const sy = oy + cropStartY;
    if (sy >= H || sy < 0) continue;

    for (let ox = 0; ox < outW; ox++) {
      const sx = ox + cropStartX;
      if (sx >= W || sx < 0) continue;

      const sPos = sy * W + sx;
      const m = smoothMask[sPos];
      if (m <= 0.001) continue;

      const sIdx = sPos * 4;
      let r = src[sIdx];
      let g = src[sIdx + 1];
      let b = src[sIdx + 2];

      // Decontaminate white background bleed on edges
      if (m < 0.98) {
        r = Math.max(0, Math.min(255, (r - (1 - m) * 245) / m));
        g = Math.max(0, Math.min(255, (g - (1 - m) * 245) / m));
        b = Math.max(0, Math.min(255, (b - (1 - m) * 245) / m));
      }

      // ------------------------------------------------------------------
      // A. DIRECTIONAL CHIAROSCURO LIGHTING (Soft key light from left, shadow on right)
      // ------------------------------------------------------------------
      // In the reference photo, one side has subtle highlight, other side has soft shadow
      const relX = (ox - faceCenterX) / (outW * 0.35);
      let lightFactor = 1.0 - (relX * 0.22);
      lightFactor = Math.max(0.62, Math.min(1.12, lightFactor));

      // ------------------------------------------------------------------
      // B. SEAMLESS FALLOFF (MELTING INTO BLACK BACKGROUND)
      // ------------------------------------------------------------------
      let bodyFalloff = 1.0;

      // Bottom falloff: starting at chest/arms (oy = 360 down to 680)
      if (oy > 360) {
        const p = Math.min(1.0, (oy - 360) / 320);
        // Smoothstep cubic
        const smoothP = p * p * (3 - 2 * p);
        bodyFalloff *= (1.0 - smoothP);
      }

      // Lateral shoulder & arm falloff: left & right outer edges dissolve into #000000
      const distFromCenter = Math.abs(ox - faceCenterX);
      if (oy > 190 && distFromCenter > 135) {
        const maxDist = 265;
        const p = Math.min(1.0, Math.max(0, (distFromCenter - 135) / (maxDist - 135)));
        const smoothP = p * p * (3 - 2 * p);
        bodyFalloff *= (1.0 - smoothP * 0.98);
      }

      // Hair top blend
      if (oy < 80) {
        const topP = (80 - oy) / 80;
        bodyFalloff *= Math.max(0, 1.0 - topP * 0.35);
      }

      // ------------------------------------------------------------------
      // C. CINEMATIC COLOR GRADE (Matching reference media_1795157995104_df9d3543.png)
      // ------------------------------------------------------------------
      // Tone down harsh flash exposure, add rich warm amber tones
      const isSkin = (r > 80 && g > 50 && r > b) && !(r > 200 && g > 200 && b > 200);
      const isShirt = (r > 190 && g > 190 && b > 190);

      if (isSkin) {
        // Reference photo has warm amber skin tones:
        // Moderately reduce overall flash glare (~0.92) while boosting warm amber red/yellow
        r = Math.min(255, r * 1.06 * lightFactor * 0.94);
        g = Math.min(255, g * 0.95 * lightFactor * 0.94);
        b = Math.min(255, b * 0.82 * lightFactor * 0.94);
      } else if (isShirt) {
        r = Math.min(255, r * lightFactor * 0.92);
        g = Math.min(255, g * lightFactor * 0.92);
        b = Math.min(255, b * lightFactor * 0.92);
      } else {
        // Suit: velvety deep black
        const suitFactor = Math.pow(lightFactor, 1.3) * bodyFalloff;
        r = r * 0.72 * suitFactor;
        g = g * 0.72 * suitFactor;
        b = b * 0.75 * suitFactor;
      }

      const finalAlpha = Math.max(0, Math.min(1.0, m * bodyFalloff));

      // Blend onto outCanvas
      const dIdx = (oy * outW + ox) * 4;
      const bgR = dst[dIdx];
      const bgG = dst[dIdx + 1];
      const bgB = dst[dIdx + 2];

      dst[dIdx] = Math.round(bgR * (1 - finalAlpha) + r * finalAlpha);
      dst[dIdx + 1] = Math.round(bgG * (1 - finalAlpha) + g * finalAlpha);
      dst[dIdx + 2] = Math.round(bgB * (1 - finalAlpha) + b * finalAlpha);
      dst[dIdx + 3] = 255;

      // Transparent canvas (with alpha fade)
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
  console.log('Successfully written both arjay-cinematic-portrait.png and arjay-portrait-transparent.png');
}

main().catch(console.error);
