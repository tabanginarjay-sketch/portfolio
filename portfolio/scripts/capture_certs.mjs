import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    defaultViewport: { width: 1400, height: 1100 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000#certificates', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const certSection = await page.$('#certificates');
  if (certSection) {
    await certSection.screenshot({ path: 'public/certificates/certs_only_4.png' });
    console.log('Saved certs_only_4.png');
  }
  await browser.close();
}

main().catch(console.error);
