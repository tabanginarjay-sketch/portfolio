import fs from 'fs';
import { createCanvas, loadImage } from '@napi-rs/canvas';

async function createPortrait() {
  const inputPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795148347074_2869fa0f.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';
  fs.mkdirSync(outDir, { recursive: true });

  const img = await loadImage(inputPath);
  const srcW = img.width;   // 1024
  const srcH = img.height;  // 768

  console.log(`Source image loaded: ${srcW}x${srcH}`);

  // Create temporary canvas for pixel processing
  const srcCanvas = createCanvas(srcW, srcH);
  const srcCtx = srcCanvas.getContext('2d');
  srcCtx.drawImage(img, 0, 0);

  const imgData = srcCtx.getImageData(0, 0, srcW, srcH);
  const data = imgData.data; // Uint8ClampedArray: [R, G, B, A, R, G, B, A...]

  // 1. Flood-fill from outer edges to identify the white studio background
  const isBg = new Uint8Array(srcW * srcH);
  const queue = new Int32Array(srcW * srcH);
  let qHead = 0;
  let qTail = 0;

  function isWhiteStudioBg(r, g, b) {
    // Studio backdrop in the photo is pure white / near-white
    return r >= 220 && g >= 220 && b >= 220;
  }

  function push(x, y) {
    const idx = y * srcW + x;
    if (isBg[idx]) return;

    // Protection zone: Ar-jay's white collared shirt (centered around x=527, y=280 to 420)
    if (x >= 470 && x <= 585 && y >= 260 && y <= 450) {
      return;
    }

    const pIdx = idx * 4;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    if (isWhiteStudioBg(r, g, b)) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed with outer edges (top, bottom, left, right)
  for (let x = 0; x < srcW; x++) {
    push(x, 0);
    push(x, 1);
    push(x, 2);
    push(x, srcH - 1);
  }
  for (let y = 0; y < srcH; y++) {
    push(0, y);
    push(1, y);
    push(2, y);
    push(srcW - 1, y);
    push(srcW - 2, y);
  }

  // BFS
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
          // Never enter the white shirt zone
          if (nx >= 470 && nx <= 585 && ny >= 260 && ny <= 450) {
            continue;
          }
          const npIdx = nIdx * 4;
          const nr = data[npIdx];
          const ng = data[npIdx + 1];
          const nb = data[npIdx + 2];
          if (isWhiteStudioBg(nr, ng, nb)) {
            isBg[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  console.log(`Background pixels identified: ${qTail} out of ${srcW * srcH}`);

  // 2. Set Alpha = 0 for background, and de-fringe outer boundary pixels
  for (let i = 0; i < srcW * srcH; i++) {
    const pIdx = i * 4;
    if (isBg[i]) {
      data[pIdx + 3] = 0; // Transparent
    }
  }

  // Edge de-fringing (anti-aliasing boundary)
  for (let y = 1; y < srcH - 1; y++) {
    for (let x = 1; x < srcW - 1; x++) {
      const idx = y * srcW + x;
      if (!isBg[idx]) {
        // Count background neighbors
        let bgNeighbors = 0;
        if (isBg[idx - 1]) bgNeighbors++;
        if (isBg[idx + 1]) bgNeighbors++;
        if (isBg[idx - srcW]) bgNeighbors++;
        if (isBg[idx + srcW]) bgNeighbors++;

        if (bgNeighbors > 0) {
          const pIdx = idx * 4;
          const factor = 1 - (bgNeighbors * 0.22);
          data[pIdx + 3] = Math.round(255 * factor);
          // Darken the fringe so no white halo shows against black
          data[pIdx] = Math.round(data[pIdx] * factor);
          data[pIdx + 1] = Math.round(data[pIdx + 1] * factor);
          data[pIdx + 2] = Math.round(data[pIdx + 2] * factor);
        }
      }
    }
  }

  // Put processed image data back
  srcCtx.putImageData(imgData, 0, 0);

  // 3. Compose Final Editorial Portrait on Canvas (600 x 768)
  const destW = 600;
  const destH = 768;
  const canvas = createCanvas(destW, destH);
  const ctx = canvas.getContext('2d');

  // A. Pure Pitch Black Background #000000
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, destW, destH);

  // B. Moody ambient rim-lighting glow behind Ar-jay's upper torso and head
  const radGlow = ctx.createRadialGradient(
    destW / 2, 260, 40,
    destW / 2, 260, 320
  );
  radGlow.addColorStop(0, 'rgba(255, 90, 95, 0.08)'); // Subtle coral theme accent
  radGlow.addColorStop(0.5, 'rgba(25, 25, 30, 0.6)');
  radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, destW, destH);

  // C. Draw Ar-jay's isolated portrait centered
  // Ar-jay center in src is at x=527
  const srcCropL = Math.round(527 - destW / 2); // 527 - 300 = 227
  ctx.drawImage(
    srcCanvas,
    srcCropL, 0, destW, destH, // source rect
    0, 0, destW, destH        // dest rect
  );

  // D. Torso & Bottom Suit Gradient Fade into solid #000000
  // Starts fading at y = 560, becomes 100% pure black at y = 740
  const bottomFade = ctx.createLinearGradient(0, 520, 0, 750);
  bottomFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomFade.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
  bottomFade.addColorStop(0.85, 'rgba(0, 0, 0, 0.85)');
  bottomFade.addColorStop(1, 'rgba(0, 0, 0, 1)');
  ctx.fillStyle = bottomFade;
  ctx.fillRect(0, 520, destW, destH - 520);

  // E. Side feathering so shoulders naturally fade into the dark background
  const leftFade = ctx.createLinearGradient(0, 0, 45, 0);
  leftFade.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  leftFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = leftFade;
  ctx.fillRect(0, 0, 45, destH);

  const rightFade = ctx.createLinearGradient(destW, 0, destW - 45, 0);
  rightFade.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
  rightFade.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = rightFade;
  ctx.fillRect(destW - 45, 0, 45, destH);

  // 4. Save Final Portrait
  const jpegBuffer = canvas.toBuffer('image/jpeg', 95);
  fs.writeFileSync(outDir + '/hero-portrait.jpg', jpegBuffer);
  fs.writeFileSync(outDir + '/arjay-portrait.jpg', jpegBuffer);

  // Also save clean PNG cutout
  const cutoutCanvas = createCanvas(destW, destH);
  const cutoutCtx = cutoutCanvas.getContext('2d');
  cutoutCtx.drawImage(
    srcCanvas,
    srcCropL, 0, destW, destH,
    0, 0, destW, destH
  );
  // Apply bottom fade on cutout too
  cutoutCtx.globalCompositeOperation = 'destination-out';
  const outFade = cutoutCtx.createLinearGradient(0, 520, 0, 750);
  outFade.addColorStop(0, 'rgba(0, 0, 0, 0)');
  outFade.addColorStop(1, 'rgba(0, 0, 0, 1)');
  cutoutCtx.fillStyle = outFade;
  cutoutCtx.fillRect(0, 520, destW, destH - 520);

  const pngBuffer = cutoutCanvas.toBuffer('image/png');
  fs.writeFileSync(outDir + '/hero-portrait-cutout.png', pngBuffer);

  console.log(`Successfully generated hero-portrait.jpg and arjay-portrait.jpg (${destW}x${destH}, ${jpegBuffer.length} bytes)`);
}

createPortrait().catch(console.error);
