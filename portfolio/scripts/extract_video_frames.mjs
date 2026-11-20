import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function main() {
  const videoPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795193641434_0f8afdb1.mp4';
  const outDir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/video_frames';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Convert video to base64 or serve via data URL or file URL
  // In Chromium, --allow-file-access-from-files allows file:/// video loading
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });

  // Read video buffer into base64
  console.log('Reading video file...');
  const videoBuf = fs.readFileSync(videoPath);
  const videoB64 = `data:video/mp4;base64,${videoBuf.toString('base64')}`;
  console.log('Video size in bytes:', videoBuf.length);

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; background: black;">
        <video id="v" src="${videoB64}" muted playsinline></video>
        <canvas id="c"></canvas>
      </body>
    </html>
  `;

  await page.setContent(html);

  const meta = await page.evaluate(async () => {
    const v = document.getElementById('v');
    await new Promise(r => {
      v.onloadedmetadata = r;
      v.load();
    });
    return {
      duration: v.duration,
      videoWidth: v.videoWidth,
      videoHeight: v.videoHeight
    };
  });

  console.log('Video metadata:', meta);

  const { duration, videoWidth, videoHeight } = meta;
  const numFrames = 8;
  const step = duration / (numFrames - 1);

  for (let i = 0; i < numFrames; i++) {
    const t = Math.min(duration, i * step);
    const frameData = await page.evaluate(async (seekTime) => {
      const v = document.getElementById('v');
      const c = document.getElementById('c');
      v.currentTime = seekTime;
      await new Promise(r => {
        v.onseeked = r;
      });
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(v, 0, 0);
      return c.toDataURL('image/jpeg', 0.85);
    }, t);

    const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, '');
    const frameFile = path.join(outDir, `frame_${i}_t${t.toFixed(2)}s.jpg`);
    fs.writeFileSync(frameFile, Buffer.from(base64Data, 'base64'));
    console.log(`Saved frame ${i} at ${t.toFixed(2)}s: ${frameFile}`);
  }

  await browser.close();
}

main().catch(console.error);
