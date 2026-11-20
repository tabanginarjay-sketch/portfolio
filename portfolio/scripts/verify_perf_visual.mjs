import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Simulate smooth mouse movement across Hero to confirm zero lag / errors
  await page.mouse.move(400, 300);
  await page.mouse.move(900, 400, { steps: 10 });
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: 'public/certificates/verify_perf_hero.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });

  // Scroll to #edits and verify GPU divider alignment + auto-sweep starts cleanly upon intersection
  const editsEl = await page.waitForSelector('#edits');
  await editsEl.scrollIntoView();
  await new Promise((r) => setTimeout(r, 1200));
  await editsEl.screenshot({ path: 'public/certificates/verify_perf_edits.png' });

  const stats = await page.evaluate(() => {
    const cards = document.querySelectorAll('#edits [role="slider"]').length;
    const smokeCanvas = document.querySelector('#hero canvas');
    return {
      editSliders: cards,
      smokeInternalSize: smokeCanvas ? `${smokeCanvas.width}x${smokeCanvas.height}` : 'none',
    };
  });

  console.log('Perf visual stats:', stats, 'pageErrors:', errors);
  await browser.close();
}

main().catch(console.error);
