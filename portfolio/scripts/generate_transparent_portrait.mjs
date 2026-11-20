import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

async function generateTransparentPortrait() {
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

  // 1. Identify connected background using BFS
  const isBg = new Uint8Array(srcW * srcH);
  const queue = new Int32Array(srcW * srcH);
  let qHead = 0;
  let qTail = 0;

  function push(x, y) {
    const idx = y * srcW + x;
    if (isBg[idx]) return;

    // Protection for white collar and shirt
    if (x >= 475 && x <= 580 && y >= 275 && y <= 430) return;

    const pIdx = idx * 4;
    const r = d[pIdx], g = d[pIdx + 1], b = d[pIdx + 2];
    
    if (r >= 215 && g >= 215 && b >= 215) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed outer edges
  for (let x = 0; x < srcW; x++) {
    push(x, 0);
    push(x, 1);
    push(x, srcH - 1);
  }
  for (let y = 0; y < srcH; y++) {
    push(0, y);
    push(1, y);
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
          if (nx >= 475 && nx <= 580 && ny >= 275 && ny <= 430) continue;
          const npIdx = nIdx * 4;
          const nr = d[npIdx], ng = d[npIdx + 1], nb = d[npIdx + 2];
          if (nr >= 215 && ng >= 215 && nb >= 215) {
            isBg[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  // Multi-pass smooth boundary feathering
  const alphaMap = new Float32Array(srcW * srcH);
  for (let i = 0; i < srcW * srcH; i++) {
    alphaMap[i] = isBg[i] ? 0.0 : 1.0;
  }

  const smoothedAlpha = new Float32Array(srcW * srcH);
  for (let y = 1; y < srcH - 1; y++) {
    for (let x = 1; x < srcW - 1; x++) {
      const idx = y * srcW + x;
      if (isBg[idx]) {
        smoothedAlpha[idx] = 0;
      } else {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            sum += alphaMap[(y + dy) * srcW + (x + dx)];
          }
        }
        smoothedAlpha[idx] = sum / 9.0;
      }
    }
  }

  for (let i = 0; i < srcW * srcH; i++) {
    const pIdx = i * 4;
    const a = smoothedAlpha[i];
    
    if (a <= 0.01) {
      d[pIdx + 3] = 0;
    } else {
      d[pIdx + 3] = Math.round(a * 255);
      // De-fringe edge pixels
      if (a < 0.95) {
        d[pIdx] = Math.round(d[pIdx] * a);
        d[pIdx + 1] = Math.round(d[pIdx + 1] * a);
        d[pIdx + 2] = Math.round(d[pIdx + 2] * a);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 2. Crop tightly and centered on Ar-jay (dest: 600 x 800)
  const destW = 600;
  const destH = 800;
  const outCanvas = createCanvas(destW, destH);
  const outCtx = outCanvas.getContext('2d');

  // Background is 100% TRANSPARENT! (No background fill!)
  outCtx.clearRect(0, 0, destW, destH);

  const cropX = Math.round(527 - destW / 2);
  const scale = 1.02;
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const drawX = -(cropX * scale) - 5;
  const drawY = 15;

  outCtx.drawImage(canvas, drawX, drawY, drawW, drawH);

  // 3. Smooth bottom fade on alpha channel so the suit fades into 0 opacity at the bottom
  outCtx.globalCompositeOperation = 'destination-out';
  const bottomGrad = outCtx.createLinearGradient(0, 520, 0, 770);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
  bottomGrad.addColorStop(0.85, 'rgba(0, 0, 0, 0.85)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 1)'); // completely transparent at bottom!
  outCtx.fillStyle = bottomGrad;
  outCtx.fillRect(0, 520, destW, destH - 520);

  // Soft edge fade on sides
  const leftEdge = outCtx.createLinearGradient(0, 0, 45, 0);
  leftEdge.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  leftEdge.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = leftEdge;
  outCtx.fillRect(0, 0, 45, destH);

  const rightEdge = outCtx.createLinearGradient(destW, 0, destW - 45, 0);
  rightEdge.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  rightEdge.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = rightEdge;
  outCtx.fillRect(destW - 45, 0, 45, destH);

  // Reset composite operation
  outCtx.globalCompositeOperation = 'source-over';

  const pngBuffer = outCanvas.toBuffer('image/png');
  fs.writeFileSync(outDir + '/arjay-portrait-transparent.png', pngBuffer);
  console.log(`Saved transparent portrait: ${destW}x${destH}, ${pngBuffer.length} bytes`);
}

generateTransparentPortrait().catch(console.error);
