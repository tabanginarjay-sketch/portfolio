import fs from 'fs';

// Polyfill Math.sumPrecise required by modern pdfjs-dist
if (!Math.sumPrecise) {
  Math.sumPrecise = function(iterable) {
    let sum = 0;
    for (const val of iterable) {
      sum += Number(val);
    }
    return sum;
  };
}

import { createCanvas, Path2D } from '@napi-rs/canvas';
globalThis.Path2D = Path2D;

import * as pdfjs from 'pdfjs-dist/build/pdf.mjs';

const fontDir = 'c:/Users/jherald ramos/portfolio/portfolio/node_modules/pdfjs-dist/standard_fonts/';
const cmapDir = 'c:/Users/jherald ramos/portfolio/portfolio/node_modules/pdfjs-dist/cmaps/';

async function renderPdfPage(pdfPath, outPath, scale = 2.0) {
  try {
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjs.getDocument({
      data,
      standardFontDataUrl: fontDir,
      cMapUrl: cmapDir,
      cMapPacked: true,
      disableFontFace: true,
    });
    const doc = await loadingTask.promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale });
    
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    const context = canvas.getContext('2d');
    
    // Fill white background first so transparent PDFs don't become black
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, Math.round(viewport.width), Math.round(viewport.height));

    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    
    const buffer = canvas.toBuffer('image/jpeg', 95);
    fs.writeFileSync(outPath, buffer);
    console.log(`Rendered: ${outPath} (${Math.round(viewport.width)}x${Math.round(viewport.height)}) [${buffer.length} bytes]`);
  } catch (err) {
    console.error(`Error rendering ${pdfPath}:`, err);
  }
}

async function main() {
  const userDir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/';
  const targetDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/certificates';
  fs.mkdirSync(targetDir, { recursive: true });

  console.log('Rendering all 5 official credentials with full vector font support...');
  
  // 1. Cisco Cybersecurity Course Completion
  await renderPdfPage(userDir + 'media_1795148564320_cc79f46b.pdf', targetDir + '/cisco_cybersecurity.jpg', 2.0);

  // 2. DICT Region VIII Certificate of Participation (16-hr Governance & Management)
  await renderPdfPage(userDir + 'media_1795148564352_d857de4d.pdf', targetDir + '/dict_cybersecurity.jpg', 2.0);

  // 3. Jobs180 / BCP Career Seminar: Marketing ME Live
  await renderPdfPage(userDir + 'media_1795148564360_38e95b60.pdf', targetDir + '/bcp_marketing_me.jpg', 2.0);

  // 4. AI Dev PH: Fundamentals of AI-Driven Development
  await renderPdfPage(userDir + 'media_1795148564362_f6bedd34.pdf', targetDir + '/aidev_fundamentals.jpg', 2.0);

  // 5. Ar-jay Tabangin Resume / CV (for preview modal)
  await renderPdfPage(userDir + 'media_1795148564369_eef0e6bc.pdf', targetDir + '/arjay_cv_preview.jpg', 2.0);

  console.log('Done rendering all files!');
}

main();
