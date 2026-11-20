import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Desktop verification
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  const editsEl = await page.waitForSelector('#edits');
  await editsEl.scrollIntoView();
  // Wait 1.6s so we see staggered auto-sweep slider transition in action!
  await new Promise((r) => setTimeout(r, 1600));

  const check = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('#edits img'));
    const sliders = Array.from(document.querySelectorAll('#edits [role="slider"]'));
    return {
      totalImages: imgs.length,
      allLoaded: imgs.every((i) => i.complete && i.naturalWidth > 0),
      sliderCount: sliders.length,
      sliderValues: sliders.map((s) => s.getAttribute('aria-valuenow')),
    };
  });
  console.log('Desktop #edits check:', check);

  await editsEl.screenshot({ path: 'public/certificates/verify_edits_desktop.png' });
  console.log('Saved verify_edits_desktop.png');
  await page.close();

  // Mobile verification (top 2 cards + header)
  const mPage = await browser.newPage();
  await mPage.setViewport({ width: 390, height: 844, isMobile: true });
  await mPage.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  const mEditsEl = await mPage.waitForSelector('#edits');
  await mEditsEl.scrollIntoView();
  await new Promise((r) => setTimeout(r, 1400));
  const box = await mEditsEl.boundingBox();
  await mPage.screenshot({
    path: 'public/certificates/verify_edits_mobile.png',
    clip: { x: 0, y: Math.max(0, box.y), width: 390, height: 950 },
  });
  console.log('Saved verify_edits_mobile.png');
  await mPage.close();

  await browser.close();
}

main().catch(console.error);
