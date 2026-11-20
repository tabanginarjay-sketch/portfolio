import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

// 1. PROCESS SMOKE REFERENCE INTO TRANSPARENT PLUMES
async function processSmoke() {
  const smokePath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795155361831_e0915099.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';
  fs.mkdirSync(outDir, { recursive: true });

  const img = await loadImage(smokePath);
  const w = img.width;
  const h = img.height;

  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  // Convert black background to transparent alpha, preserve white/silver smoke tendrils
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];

    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // Threshold noise & watermark in black background
    if (lum < 16) {
      d[i + 3] = 0;
    } else {
      // Smooth sigmoid curve for silky ethereal transparency
      const norm = (lum - 16) / (255 - 16);
      const alpha = Math.min(255, Math.round(Math.pow(norm, 1.1) * 255));
      d[i + 3] = alpha;

      // Make the smoke color a soft luminous silver-white
      d[i] = 230;
      d[i + 1] = 240;
      d[i + 2] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Save standard plume
  const buf1 = canvas.toBuffer('image/png');
  fs.writeFileSync(outDir + '/smoke-tendril-1.png', buf1);
  console.log('Saved smoke-tendril-1.png:', buf1.length);

  // Save horizontal flipped plume for variety
  const canvas2 = createCanvas(w, h);
  const ctx2 = canvas2.getContext('2d');
  ctx2.translate(w, 0);
  ctx2.scale(-1, 1);
  ctx2.drawImage(canvas, 0, 0);
  const buf2 = canvas2.toBuffer('image/png');
  fs.writeFileSync(outDir + '/smoke-tendril-2.png', buf2);
  console.log('Saved smoke-tendril-2.png:', buf2.length);
}

// 2. PROCESS PORTRAIT WITH ADVANCED DEFRINGE & ZERO WHITE EDGE
async function processPortrait() {
  const inputPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795148347074_2869fa0f.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';

  const img = await loadImage(inputPath);
  const srcW = img.width;   // 1024
  const srcH = img.height;  // 768

  const canvas = createCanvas(srcW, srcH);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, srcW, srcH);
  const d = imgData.data;

  // BFS Flood Fill Background
  const isBg = new Uint8Array(srcW * srcH);
  const queue = new Int32Array(srcW * srcH);
  let qHead = 0;
  let qTail = 0;

  function isWhitePixel(r, g, b) {
    // White or near white background
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    return (r > 190 && g > 190 && b > 190 && maxDiff < 30) || (r > 210 && g > 210 && b > 210);
  }

  function push(x, y) {
    if (x < 0 || x >= srcW || y < 0 || y >= srcH) return;
    const idx = y * srcW + x;
    if (isBg[idx]) return;

    // Protection for white collar and shirt
    if (x >= 475 && x <= 580 && y >= 270 && y <= 430) return;

    const p = idx * 4;
    if (isWhitePixel(d[p], d[p + 1], d[p + 2])) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed borders
  for (let x = 0; x < srcW; x++) {
    push(x, 0);
    push(x, 1);
    push(x, 2);
    push(x, srcH - 1);
    push(x, srcH - 2);
  }
  for (let y = 0; y < srcH; y++) {
    push(0, y);
    push(1, y);
    push(2, y);
    push(srcW - 1, y);
    push(srcW - 2, y);
  }

  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % srcW;
    const cy = Math.floor(curr / srcW);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < srcW && ny >= 0 && ny < srcH) {
        const nIdx = ny * srcW + nx;
        if (!isBg[nIdx]) {
          if (nx >= 475 && nx <= 580 && ny >= 270 && ny <= 430) continue;
          const p = nIdx * 4;
          if (isWhitePixel(d[p], d[p + 1], d[p + 2])) {
            isBg[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  // Erode the foreground mask by 1.5 pixels into the black suit/silhouette
  // to completely shave off the white anti-aliased edge fringe!
  const erodedFg = new Uint8Array(srcW * srcH);
  for (let y = 1; y < srcH - 1; y++) {
    for (let x = 1; x < srcW - 1; x++) {
      const idx = y * srcW + x;
      if (isBg[idx]) continue;

      // Protected shirt
      if (x >= 475 && x <= 580 && y >= 270 && y <= 430) {
        erodedFg[idx] = 1;
        continue;
      }

      // Check 3x3 neighborhood: if any neighbor is background, erode
      let hasBg = false;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (isBg[(y + dy) * srcW + (x + dx)]) {
            hasBg = true;
            break;
          }
        }
        if (hasBg) break;
      }

      if (!hasBg) {
        erodedFg[idx] = 1;
      }
    }
  }

  // Erode once more along edges for pixels with high luminance (white spill)
  const finalAlpha = new Float32Array(srcW * srcH);
  for (let y = 2; y < srcH - 2; y++) {
    for (let x = 2; x < srcW - 2; x++) {
      const idx = y * srcW + x;
      if (!erodedFg[idx]) {
        finalAlpha[idx] = 0;
        continue;
      }

      const p = idx * 4;
      const r = d[p], g = d[p + 1], b = d[p + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // If near background boundary and still bright (white fringe residue), shave off
      if (!(x >= 475 && x <= 580 && y >= 270 && y <= 430)) {
        let nearEdge = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!erodedFg[(y + dy) * srcW + (x + dx)]) {
              nearEdge = true;
              break;
            }
          }
          if (nearEdge) break;
        }

        if (nearEdge && lum > 140) {
          finalAlpha[idx] = 0;
          continue;
        }
      }

      finalAlpha[idx] = 1.0;
    }
  }

  // Smooth feathering of alpha (1px radius Gaussian-like blur)
  const smoothedAlpha = new Float32Array(srcW * srcH);
  for (let y = 1; y < srcH - 1; y++) {
    for (let x = 1; x < srcW - 1; x++) {
      const idx = y * srcW + x;
      if (finalAlpha[idx] === 0) {
        smoothedAlpha[idx] = 0;
      } else {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += finalAlpha[(y + dy) * srcW + (x + dx)];
          }
        }
        smoothedAlpha[idx] = sum / 9.0;
      }
    }
  }

  // Color Decontamination on boundary pixels:
  // Any semi-transparent pixel on the suit/hair is clamped to dark black/shadow
  for (let i = 0; i < srcW * srcH; i++) {
    const p = i * 4;
    const a = smoothedAlpha[i];
    const x = i % srcW;
    const y = Math.floor(i / srcW);

    if (a <= 0.05) {
      d[p + 3] = 0;
    } else {
      d[p + 3] = Math.round(a * 255);

      // Decontaminate edge: if not the shirt, remove any lingering white light spill
      if (!(x >= 475 && x <= 580 && y >= 270 && y <= 430)) {
        if (a < 0.98) {
          // Multiply RGB by alpha to suppress white fringe completely
          d[p] = Math.round(d[p] * a * 0.7);
          d[p + 1] = Math.round(d[p + 1] * a * 0.7);
          d[p + 2] = Math.round(d[p + 2] * a * 0.7);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Crop & Center onto output canvas (600 x 800)
  const destW = 600;
  const destH = 800;
  const outCanvas = createCanvas(destW, destH);
  const outCtx = outCanvas.getContext('2d');
  outCtx.clearRect(0, 0, destW, destH);

  const cropX = Math.round(527 - destW / 2);
  const scale = 1.02;
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const drawX = -(cropX * scale) - 5;
  const drawY = 15;

  outCtx.drawImage(canvas, drawX, drawY, drawW, drawH);

  // Soft natural bottom fade on ALPHA ONLY (destination-out) so the bottom melts cleanly
  // starting at y=520 down to y=780
  outCtx.globalCompositeOperation = 'destination-out';
  const bottomGrad = outCtx.createLinearGradient(0, 500, 0, 780);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(0.3, 'rgba(0, 0, 0, 0.15)');
  bottomGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0.65)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 1)'); // 100% transparent at bottom!
  outCtx.fillStyle = bottomGrad;
  outCtx.fillRect(0, 500, destW, destH - 500);

  outCtx.globalCompositeOperation = 'source-over';

  const pngBuf = outCanvas.toBuffer('image/png');
  fs.writeFileSync(outDir + '/arjay-portrait-transparent.png', pngBuf);
  console.log('Saved perfected arjay-portrait-transparent.png:', pngBuf.length);
}

async function main() {
  await processSmoke();
  await processPortrait();
  console.log('Done processing smoke and portrait!');
}

main().catch(console.error);
