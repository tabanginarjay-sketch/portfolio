import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function makeTransparentLogo(srcPath, outTransparentPath, outIconPath = null) {
  const img = await loadImage(srcPath);
  const W = img.width;
  const H = img.height;

  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const src = ctx.getImageData(0, 0, W, H).data;

  // Convert pure pitch-black (#000000) background smoothly to alpha transparency
  // while keeping crisp white & coral/cyan foreground strokes at full color fidelity!
  let minX = W, maxX = 0, minY = H, maxY = 0;
  const outImg = ctx.createImageData(W, H);
  const dst = outImg.data;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const r = src[i], g = src[i + 1], b = src[i + 2];
      const maxCh = Math.max(r, g, b);

      if (maxCh <= 10) {
        dst[i] = 0; dst[i + 1] = 0; dst[i + 2] = 0; dst[i + 3] = 0;
        continue;
      }

      // Smooth alpha ramp on anti-aliased dark edge pixels (10..220)
      // Un-premultiply color against black so edges stay pure bright white/coral/cyan
      const a = Math.min(1, Math.max(0, (maxCh - 10) / 210));
      const scale = a > 0.05 ? Math.min(1 / a, 255 / maxCh) : 1;

      dst[i] = Math.min(255, Math.round(r * scale));
      dst[i + 1] = Math.min(255, Math.round(g * scale));
      dst[i + 2] = Math.min(255, Math.round(b * scale));
      dst[i + 3] = Math.round(a * 255);

      if (a > 0.15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  ctx.putImageData(outImg, 0, 0);

  // Tightly crop into a clean centered square canvas (512x512) with 8% breathing padding
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  const side = Math.max(bw, bh);
  const pad = Math.round(side * 0.08);
  const cropSide = side + pad * 2;

  const outSize = 512;
  const transCanvas = createCanvas(outSize, outSize);
  const tCtx = transCanvas.getContext('2d');
  const drawW = (bw / cropSide) * outSize;
  const drawH = (bh / cropSide) * outSize;
  const drawX = (outSize - drawW) / 2;
  const drawY = (outSize - drawH) / 2;
  tCtx.drawImage(c, minX, minY, bw, bh, drawX, drawY, drawW, drawH);

  fs.writeFileSync(outTransparentPath, transCanvas.toBuffer('image/png'));
  console.log('Saved transparent logo:', outTransparentPath, { bw, bh });

  // Also generate 512x512 rounded obsidian app/favicon icon if requested
  if (outIconPath) {
    const iconCanvas = createCanvas(512, 512);
    const iCtx = iconCanvas.getContext('2d');

    // Rounded dark obsidian luxury badge (#080809 with subtle top sheen)
    const radius = 112;
    iCtx.beginPath();
    iCtx.roundRect(0, 0, 512, 512, radius);
    iCtx.closePath();
    const bg = iCtx.createLinearGradient(0, 0, 512, 512);
    bg.addColorStop(0, '#141416');
    bg.addColorStop(1, '#050506');
    iCtx.fillStyle = bg;
    iCtx.fill();

    // Subtle crisp inner ring
    iCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    iCtx.lineWidth = 8;
    iCtx.stroke();

    // Draw centered logo nicely inside badge
    const margin = 84;
    iCtx.drawImage(transCanvas, margin, margin, 512 - margin * 2, 512 - margin * 2);

    fs.writeFileSync(outIconPath, iconCanvas.toBuffer('image/png'));
    console.log('Saved app/favicon icon:', outIconPath);
  }
}

async function main() {
  const brainDir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb';

  await makeTransparentLogo(
    `${brainDir}/aj_monogram_logo_1795166719086.jpg`,
    'public/images/arjay-logo.png',
    'app/icon.png'
  );

  await makeTransparentLogo(
    `${brainDir}/aj_monogram_emblem_1795166725852.jpg`,
    'public/images/arjay-logo-alt.png'
  );
}

main().catch(console.error);
