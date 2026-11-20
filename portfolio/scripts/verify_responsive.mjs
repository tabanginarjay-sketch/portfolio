import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const viewports = [
    { name: 'ios_iphone', width: 390, height: 844, isMobile: true },
    { name: 'android_phone', width: 360, height: 740, isMobile: true },
    { name: 'desktop_hero', width: 1400, height: 900, isMobile: false },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.isMobile });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({
      path: `public/certificates/verify_${vp.name}.png`,
      clip: { x: 0, y: 0, width: vp.width, height: vp.height },
    });
    console.log(`Saved verify_${vp.name}.png`);
    await page.close();
  }

  await browser.close();
}

main().catch(console.error);
