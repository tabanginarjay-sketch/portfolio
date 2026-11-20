import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait for canvas animations and portrait to load
  await new Promise(r => setTimeout(r, 2000));

  const outPath = 'c:/Users/jherald ramos/portfolio/portfolio/public/certificates/real_hero_view.png';
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1400, height: 900 } });
  console.log('Saved real_hero_view.png');

  const certEl = await page.waitForSelector('#certificates');
  if (certEl) {
    await certEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 800));
    await certEl.screenshot({ path: 'c:/Users/jherald ramos/portfolio/portfolio/public/certificates/certs_2x2_verification.png' });
    console.log('Saved certs_2x2_verification.png');
  }

  await browser.close();
}

main().catch(console.error);
