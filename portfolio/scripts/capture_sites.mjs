import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // 1. Sole Surgeon
  try {
    console.log('Navigating to Sole Surgeon...');
    await page.goto('https://sole-surgeon-pwa.vercel.app/', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // wait for animations/fonts
    const soleSurgeonPath = path.resolve('public/images/projects/sole-surgeon.png');
    fs.mkdirSync(path.dirname(soleSurgeonPath), { recursive: true });
    await page.screenshot({ path: soleSurgeonPath, type: 'png' });
    console.log('Sole Surgeon screenshot saved to', soleSurgeonPath);
  } catch (err) {
    console.error('Error capturing Sole Surgeon:', err.message);
  }

  // 2. EduScholar
  const eduUrls = [
    'https://eduscholar.up.railway.app',
    'http://eduscholar.up.railway.app',
    'https://eduscholar-production.up.railway.app',
    'https://eduscholar.railway.app'
  ];

  for (const url of eduUrls) {
    try {
      console.log('Testing EduScholar URL:', url);
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = res ? res.status() : 'no response';
      const title = await page.title();
      const content = await page.evaluate(() => document.body.innerText.slice(0, 200));
      console.log(`URL: ${url} -> Status: ${status}, Title: "${title}", Preview: "${content.replace(/\n/g, ' ')}"`);
      if (status === 200) {
        await new Promise(r => setTimeout(r, 2000));
        const eduPath = path.resolve('public/images/projects/eduscholar.png');
        await page.screenshot({ path: eduPath, type: 'png' });
        console.log('EduScholar screenshot saved to', eduPath);
        break;
      }
    } catch (err) {
      console.error(`Error with ${url}:`, err.message);
    }
  }

  await browser.close();
}

main().catch(err => {
  console.error('Main error:', err);
  process.exit(1);
});
