const fs = require('fs');
const zlib = require('zlib');
const sharp = require('c:/Users/jherald ramos/portfolio/portfolio/node_modules/sharp');

const outDir = 'c:/Users/jherald ramos/portfolio/portfolio/public/certificates/extracted';
fs.mkdirSync(outDir, { recursive: true });

async function extractImagesFromPdf(filePath, prefix) {
  const buf = fs.readFileSync(filePath);
  const str = buf.toString('latin1');
  
  // Find all XObject images
  const objRe = /(\d+)\s+0\s+obj[\s\S]*?<<([\s\S]*?)>>[\s\r\n]*stream[\r\n]+([\s\S]*?)endstream/g;
  let m;
  let count = 0;
  while ((m = objRe.exec(str)) !== null) {
    const objId = m[1];
    const dict = m[2];
    const rawStream = m[3];
    
    if (dict.includes('/Subtype') && dict.includes('/Image')) {
      const wMatch = dict.match(/\/Width\s+(\d+)/);
      const hMatch = dict.match(/\/Height\s+(\d+)/);
      const filterMatch = dict.match(/\/Filter\s*(\/[a-zA-Z]+|\[[^\]]+\])/);
      const csMatch = dict.match(/\/ColorSpace\s*(\/[a-zA-Z]+)/);
      
      const width = wMatch ? parseInt(wMatch[1]) : 0;
      const height = hMatch ? parseInt(hMatch[1]) : 0;
      const filter = filterMatch ? filterMatch[1] : '';
      const cs = csMatch ? csMatch[1] : '';
      
      console.log(`[${prefix}] Found image obj ${objId}: ${width}x${height}, filter: ${filter}, cs: ${cs}`);
      
      if (filter.includes('DCTDecode')) {
        const outPath = `${outDir}/${prefix}_obj${objId}.jpg`;
        fs.writeFileSync(outPath, Buffer.from(rawStream, 'latin1'));
        console.log('Saved JPEG:', outPath);
        count++;
      } else if (filter.includes('FlateDecode') && width > 100 && height > 100) {
        try {
          const decompressed = zlib.inflateSync(Buffer.from(rawStream, 'latin1'));
          const channels = cs === '/DeviceGray' ? 1 : (cs === '/DeviceCMYK' ? 4 : 3);
          console.log(`Decompressed ${prefix}_obj${objId}: length ${decompressed.length}, expected ${width * height * channels}`);
          
          if (decompressed.length === width * height * channels) {
            const outPath = `${outDir}/${prefix}_obj${objId}.png`;
            await sharp(decompressed, { raw: { width, height, channels } })
              .png()
              .toFile(outPath);
            console.log('Saved PNG:', outPath);
            count++;
          }
        } catch(e) {
          console.error('Inflate error for obj', objId, ':', e.message);
        }
      }
    }
  }
}

async function run() {
  const dir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/';
  await extractImagesFromPdf(dir + 'media_1795148564320_cc79f46b.pdf', 'cisco');
  await extractImagesFromPdf(dir + 'media_1795148564352_d857de4d.pdf', 'dict');
  await extractImagesFromPdf(dir + 'media_1795148564360_38e95b60.pdf', 'cert3');
  await extractImagesFromPdf(dir + 'media_1795148564362_f6bedd34.pdf', 'cert4');
  await extractImagesFromPdf(dir + 'media_1795148564369_eef0e6bc.pdf', 'cv');
}

run();
