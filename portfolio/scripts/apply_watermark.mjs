import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

async function applyWatermarkToImage(inputPath, outputPath) {
  const img = await loadImage(inputPath);
  const W = img.width;
  const H = img.height;

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // 1. Draw clean unwatermarked certificate
  ctx.drawImage(img, 0, 0);

  // 2. Build watermark on a separate transparent offscreen layer
  //    so clearing line intersections NEVER paints white over the certificate text!
  const wmCanvas = createCanvas(W, H);
  const wmCtx = wmCanvas.getContext('2d');

  const spacing = Math.round(W / 3.8);
  const fontSize = Math.round(spacing * 0.105);
  const text = 'Ar-jay';

  // Draw crisp 45-degree diamond lattice lines
  wmCtx.strokeStyle = 'rgba(95, 102, 115, 0.72)';
  wmCtx.lineWidth = Math.max(1.2, W / 1050);

  for (let offset = -W - spacing; offset <= H + spacing; offset += spacing) {
    wmCtx.beginPath();
    wmCtx.moveTo(0, offset);
    wmCtx.lineTo(W, W + offset);
    wmCtx.stroke();
  }

  for (let offset = -spacing; offset <= W + H + spacing; offset += spacing) {
    wmCtx.beginPath();
    wmCtx.moveTo(0, offset);
    wmCtx.lineTo(W, offset - W);
    wmCtx.stroke();
  }

  wmCtx.font = `500 ${fontSize}px sans-serif`;
  wmCtx.textAlign = 'center';
  wmCtx.textBaseline = 'middle';

  const metrics = wmCtx.measureText(text);
  const clearW = metrics.width + fontSize * 0.55;
  const clearH = fontSize * 1.45;

  const minK = Math.floor(-W / spacing) - 1;
  const maxK = Math.ceil(H / spacing) + 1;
  const minM = -1;
  const maxM = Math.ceil((W + H) / spacing) + 1;

  const nodes = [];
  for (let k = minK; k <= maxK; k++) {
    for (let m = minM; m <= maxM; m++) {
      const x = Math.round(((m - k) * spacing) / 2);
      const y = Math.round(((m + k) * spacing) / 2);
      if (x >= -spacing && x <= W + spacing && y >= -spacing && y <= H + spacing) {
        nodes.push({ x, y });
      }
    }
  }

  // Erase line intersections on wmCanvas ONLY (leaves certificate untouched underneath!)
  wmCtx.globalCompositeOperation = 'destination-out';
  wmCtx.fillStyle = '#000000';
  for (const { x, y } of nodes) {
    wmCtx.fillRect(x - clearW / 2, y - clearH / 2, clearW, clearH);
  }

  // Draw clean "Ar-jay" watermark labels at every intersection
  wmCtx.globalCompositeOperation = 'source-over';
  wmCtx.fillStyle = 'rgba(80, 86, 98, 1.0)';
  for (const { x, y } of nodes) {
    wmCtx.fillText(text, x, y);
  }

  // 3. Composite watermark layer at low, translucent opacity (22% text / ~16% lines)
  //    Clear anti-theft protection while keeping every detail of the certificate 100% readable
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.drawImage(wmCanvas, 0, 0);
  ctx.restore();

  const isPng = outputPath.endsWith('.png');
  const buf = isPng
    ? canvas.toBuffer('image/png')
    : canvas.toBuffer('image/jpeg', { quality: 0.95 });

  fs.writeFileSync(outputPath, buf);
  console.log(`Saved subtle watermarked certificate: ${outputPath}`);
}

async function main() {
  const dir = 'public/certificates';
  const backupDir = path.join(dir, 'originals_unwatermarked');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const certFiles = [
    'cisco_cybersecurity.jpg',
    'dict_cybersecurity.jpg',
    'aidev_fundamentals.jpg',
    'bcp_marketing_me.jpg',
    'bcp_laravel_webinar.jpg',
    'bcp_research_seminar.jpg',
    'concentrix_anthem_cct.jpg',
  ];

  for (const file of certFiles) {
    const src = path.join(dir, file);
    const backup = path.join(backupDir, file);

    if (!fs.existsSync(backup)) {
      fs.copyFileSync(src, backup);
      console.log(`Backed up original: ${backup}`);
    }

    await applyWatermarkToImage(backup, src);
  }

  console.log('All certificates watermarked with subtle translucent 22% opacity!');
}

main().catch(console.error);
