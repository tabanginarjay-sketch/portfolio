import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function main() {
  const videoPath = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/.user_uploaded/media_1795193641434_0f8afdb1.mp4';
  const outDir = 'C:/Users/jherald ramos/.gemini/antigravity/brain/f21a097d-0e10-43fb-a02b-1e1b189d73bb/video_transition_frames';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage();
  const videoBuf = fs.readFileSync(videoPath);
  const videoB64 = `data:video/mp4;base64,${videoBuf.toString('base64')}`;
  await page.setContent(`<!DOCTYPE html><html><body><video id="v" src="${videoB64}" muted></video><canvas id="c"></canvas></body></html>`);

  const times = [0.6, 0.9, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.5, 3.2, 3.5, 3.8, 4.1];
  for (let idx = 0; idx < times.length; idx++) {
    const t = times[idx];
    const frameData = await page.evaluate(async (seekTime) => {
      const v = document.getElementById('v');
      const c = document.getElementById('c');
      v.currentTime = seekTime;
      await new Promise(r => { v.onseeked = r; });
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(v, 0, 0);
      return c.toDataURL('image/jpeg', 0.85);
    }, t);
    const base64Data = frameData.replace(/^data:image\/jpeg;base64,/, '');
    fs.writeFileSync(path.join(outDir, `trans_${idx}_t${t.toFixed(2)}s.jpg`), Buffer.from(base64Data, 'base64'));
  }
  await browser.close();
  console.log('Done extracting transition frames!');
}

main().catch(console.error);
