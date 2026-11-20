import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

async function applyWatermarkToImage(inputPath, outputPath) {
  const img = await loadImage(inputPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  // 1. Draw base certificate image
  ctx.drawImage(img, 0, 0);

  const W = img.width;
  const H = img.height;

  // Diamond spacing: 4.2 diamonds across width (matching reference image media_1795157168265_011d0cb7.png)
  const spacing = Math.round(W / 4.2);
  const fontSize = Math.round(spacing * 0.125); // ~46px on 1600px width
  const text = 'Ar-jay';

  // 1. Draw 45-degree diagonal lines (slope = +1, slope = -1)
  ctx.strokeStyle = 'rgba(150, 155, 165, 0.42)';
  ctx.lineWidth = Math.max(1.6, Math.round(W / 850));

  // Slope +1 lines (from top-left down-right)
  for (let offset = -W - spacing; offset <= H + spacing; offset += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(W, W + offset);
    ctx.stroke();
  }

  // Slope -1 lines (from bottom-left up-right)
  for (let offset = -spacing; offset <= W + H + spacing; offset += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, offset);
    ctx.lineTo(W, offset - W);
    ctx.stroke();
  }

  // 2. Watermark text at every intersection
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const minK = Math.floor((-W) / spacing) - 1;
  const maxK = Math.ceil(H / spacing) + 1;
  const minM = -1;
  const maxM = Math.ceil((W + H) / spacing) + 1;

  for (let k = minK; k <= maxK; k++) {
    for (let m = minM; m <= maxM; m++) {
      const x = Math.round(((m - k) * spacing) / 2);
      const y = Math.round(((m + k) * spacing) / 2);

      if (x >= -spacing && x <= W + spacing && y >= -spacing && y <= H + spacing) {
        // Clean white mask directly under the text so line doesn't strike through
        ctx.lineWidth = Math.max(6, Math.round(W / 180));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
        ctx.strokeText(text, x, y);

        // Watermark text in soft grey matching reference image
        ctx.fillStyle = 'rgba(115, 120, 130, 0.72)';
        ctx.fillText(text, x, y);
      }
    }
  }

  const isPng = outputPath.endsWith('.png');
  const buf = isPng 
    ? canvas.toBuffer('image/png') 
    : canvas.toBuffer('image/jpeg', { quality: 0.95 });

  fs.writeFileSync(outputPath, buf);
  console.log(`Saved watermarked certificate: ${outputPath}`);
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
    'bcp_marketing_me.jpg'
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

  console.log('All certificates watermarked successfully with 45-degree diamond lattice!');
}

main().catch(console.error);
