const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded';
const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/certificates';
fs.mkdirSync(outDir, { recursive: true });

const files = [
  'media_1795148564320_cc79f46b.pdf',
  'media_1795148564352_d857de4d.pdf',
  'media_1795148564360_38e95b60.pdf',
  'media_1795148564362_f6bedd34.pdf',
  'media_1795148564369_eef0e6bc.pdf'
];

files.forEach((f, idx) => {
  const buf = fs.readFileSync(path.join(dir, f));
  let pos = 0;
  let count = 0;
  while ((pos = buf.indexOf(Buffer.from([0xFF, 0xD8, 0xFF]), pos)) !== -1) {
    const end = buf.indexOf(Buffer.from([0xFF, 0xD9]), pos + 3);
    if (end !== -1) {
      const imgBuf = buf.subarray(pos, end + 2);
      if (imgBuf.length > 5000) {
        const outName = 'pdf_' + idx + '_img_' + count + '.jpg';
        fs.writeFileSync(path.join(outDir, outName), imgBuf);
        console.log('Extracted from ' + f + ' -> ' + outName + ' (' + imgBuf.length + ' bytes)');
        count++;
      }
      pos = end + 2;
    } else {
      pos += 3;
    }
  }
  if (count === 0) console.log('No JPEGs found in ' + f);
});
