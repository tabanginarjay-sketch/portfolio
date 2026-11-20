const fs = require('fs');
const sharp = require('c:/Users/jherald ramos/portfolio/portfolio/node_modules/sharp');

async function generateArjayPortrait() {
  const inputPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795148347074_2869fa0f.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';
  fs.mkdirSync(outDir, { recursive: true });

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log('Original dimensions:', width, height, channels);

  // 1. Precise Flood Fill from exterior borders
  const isBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function isWhiteStudioBg(r, g, b) {
    // Studio backdrop in the photo is very bright (typically 230-255)
    return r >= 225 && g >= 225 && b >= 225;
  }

  function push(x, y) {
    const idx = y * width + x;
    if (isBg[idx]) return;

    // Protection zone: Do NOT flood fill into Ar-jay's white collar and shirt
    // x: 470 to 580, y: 260 to 450
    if (x >= 470 && x <= 580 && y >= 260 && y <= 450) {
      return;
    }

    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    if (isWhiteStudioBg(r, g, b)) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed outer perimeter
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, 1);
    push(x, 2);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(1, y);
    push(2, y);
    push(width - 1, y);
    push(width - 2, y);
  }

  // BFS
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1]
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nIdx = ny * width + nx;
        if (!isBg[nIdx]) {
          // Check protection zone for collar/shirt
          if (nx >= 470 && nx <= 580 && ny >= 260 && ny <= 450) {
            continue;
          }
          const npIdx = nIdx * channels;
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

  console.log('Flood fill finished. Identified background pixels:', qTail);

  // 2. Build Alpha Mask (255 for person, 0 for background)
  const mask = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    mask[i] = isBg[i] ? 0 : 255;
  }

  // Smooth the mask edges (sigma = 1.2)
  const smoothMask = await sharp(mask, { raw: { width, height, channels: 1 } })
    .blur(1.2)
    .raw()
    .toBuffer();

  // 3. Build RGBA Cutout with De-fringing
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;
    const alphaVal = smoothMask[i];
    const alphaNorm = alphaVal / 255;

    let r = data[srcIdx];
    let g = data[srcIdx + 1];
    let b = data[srcIdx + 2];

    // De-fringe: soften white edge glow on dark suit and hair
    if (alphaNorm > 0.02 && alphaNorm < 0.98) {
      r = Math.round(r * alphaNorm);
      g = Math.round(g * alphaNorm);
      b = Math.round(b * alphaNorm);
    }

    rgba[dstIdx] = r;
    rgba[dstIdx + 1] = g;
    rgba[dstIdx + 2] = b;
    rgba[dstIdx + 3] = alphaVal;
  }

  // 4. Crop nicely centered on Ar-jay (x around 527)
  // Portrait aspect ratio ~ 3:4 (e.g. width 576, height 768)
  const cropW = 576;
  const cropH = height; // 768
  const cropL = Math.max(0, Math.round(527 - cropW / 2));

  const croppedPerson = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left: cropL, top: 0, width: cropW, height: cropH })
    .png()
    .toBuffer();

  // 5. Create Background and Vignette Gradients
  // Deep black backdrop with subtle warm atelier ambient glow behind head
  const backdropSvg = `
    <svg width="${cropW}" height="${cropH}" viewBox="0 0 ${cropW} ${cropH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="backglow" cx="50%" cy="32%" r="48%">
          <stop offset="0%" stop-color="#FF5A5F" stop-opacity="0.10" />
          <stop offset="45%" stop-color="#121212" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="${cropW}" height="${cropH}" fill="#000000" />
      <rect width="${cropW}" height="${cropH}" fill="url(#backglow)" />
    </svg>
  `;

  // Vignette overlay: melts the bottom suit into pure black, and subtle edge feathering
  const vignetteSvg = `
    <svg width="${cropW}" height="${cropH}" viewBox="0 0 ${cropW} ${cropH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Bottom fade into pure black -->
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="68%" stop-color="#000000" stop-opacity="0" />
          <stop offset="85%" stop-color="#000000" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1" />
        </linearGradient>
        <!-- Left side fade -->
        <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.95" />
          <stop offset="8%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>
        <!-- Right side fade -->
        <linearGradient id="rightFade" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.95" />
          <stop offset="8%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${cropW}" height="${cropH}" fill="url(#bottomFade)" />
      <rect width="${cropW}" height="${cropH}" fill="url(#leftFade)" />
      <rect width="${cropW}" height="${cropH}" fill="url(#rightFade)" />
    </svg>
  `;

  const backdropBuf = await sharp(Buffer.from(backdropSvg)).png().toBuffer();
  const vignetteBuf = await sharp(Buffer.from(vignetteSvg)).png().toBuffer();

  // Composite: Backdrop -> Ar-jay Cutout -> Vignette
  const finalPortrait = await sharp(backdropBuf)
    .composite([
      { input: croppedPerson, top: 0, left: 0 },
      { input: vignetteBuf, top: 0, left: 0 }
    ])
    .modulate({
      brightness: 1.04,
      saturation: 1.05
    })
    .jpeg({ quality: 95 })
    .toBuffer();

  // Save to both files
  fs.writeFileSync(outDir + '/hero-portrait.jpg', finalPortrait);
  fs.writeFileSync(outDir + '/arjay-portrait.jpg', finalPortrait);
  fs.writeFileSync(outDir + '/hero-portrait-cutout.png', croppedPerson);

  console.log('Successfully created arjay-portrait.jpg and hero-portrait.jpg!');
  console.log('Output size:', finalPortrait.length, 'bytes');
}

generateArjayPortrait().catch(console.error);
