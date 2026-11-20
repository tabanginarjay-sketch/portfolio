import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import sharp from 'sharp';

async function processImage() {
  const inputPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795148347074_2869fa0f.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';

  const img = await loadImage(inputPath);
  const srcW = img.width;   // 1024
  const srcH = img.height;  // 768

  // We will work with a canvas
  const canvas = createCanvas(srcW, srcH);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, srcW, srcH);
  const d = imgData.data;

  // Let's compute a high-precision mask
  // Background in the original photo is pure studio white (R,G,B > 220)
  // Distance from pure white: dist = sqrt((255-r)^2 + (255-g)^2 + (255-b)^2)
  // When dist < 45, it is white background.
  
  // 1. Identify connected background using BFS
  const isBg = new Uint8Array(srcW * srcH);
  const queue = new Int32Array(srcW * srcH);
  let qHead = 0;
  let qTail = 0;

  function push(x, y) {
    const idx = y * srcW + x;
    if (isBg[idx]) return;

    // Protection for white collar and shirt:
    // Ar-jay's white collar is between x: 475..580 and y: 275..430
    if (x >= 475 && x <= 580 && y >= 275 && y <= 430) return;

    const pIdx = idx * 4;
    const r = d[pIdx], g = d[pIdx + 1], b = d[pIdx + 2];
    
    // Background threshold
    if (r >= 215 && g >= 215 && b >= 215) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed edges
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

  console.log('Background flood fill completed:', qTail);

  // 2. Multi-pass smooth boundary feathering
  // Create an alpha buffer (0 for background, 255 for person)
  const alphaMap = new Float32Array(srcW * srcH);
  for (let i = 0; i < srcW * srcH; i++) {
    alphaMap[i] = isBg[i] ? 0.0 : 1.0;
  }

  // Smooth blur on alphaMap for natural hair and edge blending (box blur 3x3)
  const smoothedAlpha = new Float32Array(srcW * srcH);
  for (let y = 1; y < srcH - 1; y++) {
    for (let x = 1; x < srcW - 1; x++) {
      const idx = y * srcW + x;
      if (isBg[idx]) {
        smoothedAlpha[idx] = 0;
      } else {
        // Average surrounding alpha
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

  // 3. Apply alpha and de-fringing to image data
  for (let i = 0; i < srcW * srcH; i++) {
    const pIdx = i * 4;
    const a = smoothedAlpha[i];
    
    if (a <= 0.01) {
      d[pIdx + 3] = 0;
    } else {
      d[pIdx + 3] = Math.round(a * 255);
      // De-fringe: if near boundary, darken to remove white backdrop reflection
      if (a < 0.95) {
        d[pIdx] = Math.round(d[pIdx] * a);
        d[pIdx + 1] = Math.round(d[pIdx + 1] * a);
        d[pIdx + 2] = Math.round(d[pIdx + 2] * a);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // 4. Create Final Editorial Portrait (Aspect ratio 3:4, e.g. 600 x 800)
  const destW = 600;
  const destH = 800;
  const outCanvas = createCanvas(destW, destH);
  const outCtx = outCanvas.getContext('2d');

  // Solid deep black background #000000 (NO RED CIRCLE!)
  outCtx.fillStyle = '#000000';
  outCtx.fillRect(0, 0, destW, destH);

  // Subtle clean cinematic backdrop shadow (ultra subtle dark graphite depth, no saturated red/coral)
  const softBacklight = outCtx.createRadialGradient(
    destW / 2, 280, 50,
    destW / 2, 280, 300
  );
  softBacklight.addColorStop(0, 'rgba(30, 32, 40, 0.4)');
  softBacklight.addColorStop(0.6, 'rgba(12, 13, 16, 0.2)');
  softBacklight.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = softBacklight;
  outCtx.fillRect(0, 0, destW, destH);

  // Center Ar-jay (center in source is x=527)
  const cropX = Math.round(527 - destW / 2);
  // Source is 768 height, scale slightly so portrait fits majestically
  const scale = 1.02;
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const drawX = -(cropX * scale) - 5;
  const drawY = 15;

  outCtx.drawImage(canvas, drawX, drawY, drawW, drawH);

  // 5. Cinematic Lighting and Vignette
  // A. Bottom fade into pure black (so suit dissolves seamlessly)
  const bottomGrad = outCtx.createLinearGradient(0, 520, 0, 770);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.3)');
  bottomGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.8)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 1)');
  outCtx.fillStyle = bottomGrad;
  outCtx.fillRect(0, 520, destW, destH - 520);

  // B. Left and right edge soft shadows so arms merge into the darkness
  const leftEdgeGrad = outCtx.createLinearGradient(0, 0, 70, 0);
  leftEdgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  leftEdgeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
  leftEdgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = leftEdgeGrad;
  outCtx.fillRect(0, 0, 70, destH);

  const rightEdgeGrad = outCtx.createLinearGradient(destW, 0, destW - 70, 0);
  rightEdgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  rightEdgeGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.4)');
  rightEdgeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  outCtx.fillStyle = rightEdgeGrad;
  outCtx.fillRect(destW - 70, 0, 70, destH);

  // Save to both files
  const jpegBuffer = outCanvas.toBuffer('image/jpeg', 96);
  fs.writeFileSync(outDir + '/hero-portrait.jpg', jpegBuffer);
  fs.writeFileSync(outDir + '/arjay-portrait.jpg', jpegBuffer);

  console.log(`Saved refined portrait: ${destW}x${destH}, ${jpegBuffer.length} bytes`);
}

processImage().catch(console.error);
