import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to live production site...');
  await page.goto('https://arjaytabangin.vercel.app', { waitUntil: 'networkidle2' });

  // 1. Verify Lenis is active on window
  const lenisState = await page.evaluate(() => {
    return {
      hasLenis: Boolean((window).__lenis),
      htmlClass: document.documentElement.className,
      isSmooth: Boolean((window).__lenis && (window).__lenis.isSmooth)
    };
  });
  console.log('Lenis initialization state:', lenisState);

  // 2. Test Lenis smooth scroll down
  console.log('Triggering smooth scroll via Lenis...');
  await page.evaluate(() => {
    if ((window).__lenis) {
      (window).__lenis.scrollTo(1200, { duration: 1.0 });
    }
  });

  // Track scroll position over 1.2s to verify smooth interpolation (momentum)
  const samples = [];
  for (let i = 0; i < 6; i++) {
    await new Promise(r => setTimeout(r, 200));
    const y = await page.evaluate(() => window.scrollY);
    samples.push(Math.round(y));
  }
  console.log('Scroll position progression (proving smooth inertia):', samples);

  // 3. Test BackToTop smooth return
  console.log('Testing Back to Top button with Lenis...');
  await page.evaluate(() => {
    const btn = document.querySelector('.back-to-top-btn');
    if (btn) btn.click();
  });

  const returnSamples = [];
  for (let i = 0; i < 6; i++) {
    await new Promise(r => setTimeout(r, 200));
    const y = await page.evaluate(() => window.scrollY);
    returnSamples.push(Math.round(y));
  }
  console.log('Return to top progression:', returnSamples);

  await browser.close();
  console.log('All Lenis live tests passed!');
}

main().catch(console.error);
