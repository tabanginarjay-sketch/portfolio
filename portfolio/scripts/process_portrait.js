const fs = require('fs');
const sharp = require('c:/Users/jherald ramos/portfolio/portfolio/node_modules/sharp');

async function processPortrait() {
  const inputPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795148347074_2869fa0f.jpg';
  const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/images';
  fs.mkdirSync(outDir, { recursive: true });

  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log('Original dimensions:', width, height, channels);

  // 1. Flood fill from outer perimeter to identify background
  // Background pixels are connected to perimeter and bright (r>220, g>220, b>220)
  const isBg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function push(x, y) {
    const idx = y * width + x;
    if (isBg[idx]) return;
    const pIdx = idx * channels;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];
    // Threshold for studio white backdrop
    if (r > 215 && g > 215 && b > 215) {
      isBg[idx] = 1;
      queue[qTail++] = idx;
    }
  }

  // Seed with outer edges (top, bottom, left, right)
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, 1);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(1, y);
    push(width - 1, y);
    push(width - 2, y);
  }

  // BFS flood fill
  while (qHead < qTail) {
    const curr = queue[qHead++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4-neighborhood
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
          const npIdx = nIdx * channels;
          const nr = data[npIdx];
          const ng = data[npIdx + 1];
          const nb = data[npIdx + 2];
          // Flood fill white background
          if (nr > 215 && ng > 215 && nb > 215) {
            isBg[nIdx] = 1;
            queue[qTail++] = nIdx;
          }
        }
      }
    }
  }

  console.log('Background flood fill completed. Background pixels:', qTail);

  // 2. Create Alpha Mask Buffer (255 for person, 0 for background)
  const mask = Buffer.alloc(width * height);
  for (let i = 0; i < width * height; i++) {
    mask[i] = isBg[i] ? 0 : 255;
  }

  // 3. Smooth the alpha mask using sharp Gaussian blur to avoid jagged cutout edges
  const smoothMask = await sharp(mask, { raw: { width, height, channels: 1 } })
    .blur(1.5)
    .raw()
    .toBuffer();

  // 4. Create RGBA image with smoothed mask and de-fringing
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;
    const alpha = smoothMask[i] / 255;

    let r = data[srcIdx];
    let g = data[srcIdx + 1];
    let b = data[srcIdx + 2];

    // De-fringe: If pixel has white fringe near boundary, darken it
    if (alpha > 0.05 && alpha < 0.95) {
      r = Math.round(r * alpha);
      g = Math.round(g * alpha);
      b = Math.round(b * alpha);
    }

    rgba[dstIdx] = r;
    rgba[dstIdx + 1] = g;
    rgba[dstIdx + 2] = b;
    rgba[dstIdx + 3] = smoothMask[i];
  }

  // 5. Crop around Ar-jay:
  // Center is around x=512, Ar-jay occupies from roughly x=300 to x=724, y=60 to 768
  // Let's create a nicely framed portrait (width 640, height 768) centered on Ar-jay
  const cropLeft = Math.max(0, Math.round(512 - 320));
  const cropWidth = 640;
  const cropHeight = height;

  const croppedPerson = await sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: 0, width: cropWidth, height: cropHeight })
    .png()
    .toBuffer();

  // 6. Build the Editorial Studio Backdrop:
  // Pure black canvas #000000 with a subtle warm coral/amber ambient glow behind his head
  // and smooth bottom fade into pure black
  const canvasWidth = cropWidth;
  const canvasHeight = cropHeight;

  // Create SVG overlay for bottom fade and ambient studio glow
  const backdropSvg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Ambient moody studio back-light -->
        <radialGradient id="backlight" cx="50%" cy="35%" r="45%">
          <stop offset="0%" stop-color="#FF5A5F" stop-opacity="0.12" />
          <stop offset="50%" stop-color="#141414" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="#000000" />
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#backlight)" />
    </svg>
  `;

  const vignetteSvg = `
    <svg width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Bottom fade into pure black so torso melts into the page -->
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0" />
          <stop offset="55%" stop-color="#000000" stop-opacity="0" />
          <stop offset="85%" stop-color="#000000" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#000000" stop-opacity="1" />
        </linearGradient>
        <!-- Side vignettes -->
        <linearGradient id="sideFadeLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.9" />
          <stop offset="15%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="sideFadeRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.9" />
          <stop offset="15%" stop-color="#000000" stop-opacity="0" />
        </linearGradient>
      </defs>
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#bottomFade)" />
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#sideFadeLeft)" />
      <rect width="${canvasWidth}" height="${canvasHeight}" fill="url(#sideFadeRight)" />
    </svg>
  `;

  const backdropBuffer = await sharp(Buffer.from(backdropSvg)).png().toBuffer();
  const vignetteBuffer = await sharp(Buffer.from(vignetteSvg)).png().toBuffer();

  // Composite: Backdrop -> Cropped Person -> Vignette / Fade Overlay
  await sharp(backdropBuffer)
    .composite([
      { input: croppedPerson, top: 0, left: 0 },
      { input: vignetteBuffer, top: 0, left: 0 }
    ])
    .modulate({
      brightness: 1.02,
      saturation: 1.05
    })
    .jpeg({ quality: 95 })
    .toFile(outDir + '/hero-portrait.jpg');

  // Also save a PNG version with transparency if needed
  await sharp(croppedPerson)
    .composite([
      { input: vignetteBuffer, top: 0, left: 0 }
    ])
    .png()
    .toFile(outDir + '/hero-portrait-cutout.png');

  console.log('Successfully generated blended hero-portrait.jpg and hero-portrait-cutout.png!');
}

processPortrait().catch(err => console.error(err));
