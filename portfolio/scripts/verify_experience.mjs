import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Desktop capture
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  const expEl = await page.waitForSelector('#experience');
  await expEl.scrollIntoView();
  await new Promise((r) => setTimeout(r, 400));
  await expEl.screenshot({ path: 'public/certificates/verify_experience_desktop.png' });
  console.log('Saved verify_experience_desktop.png');
  await page.close();

  // Mobile capture
  const mPage = await browser.newPage();
  await mPage.setViewport({ width: 390, height: 844, isMobile: true });
  await mPage.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  const mExpEl = await mPage.waitForSelector('#experience');
  await mExpEl.scrollIntoView();
  await new Promise((r) => setTimeout(r, 400));
  await mExpEl.screenshot({ path: 'public/certificates/verify_experience_mobile.png' });
  console.log('Saved verify_experience_mobile.png');
  await mPage.close();

  await browser.close();
}

main().catch(console.error);
