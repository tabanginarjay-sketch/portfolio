import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  
  // Wait 1s for canvas and animations to render
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'hero_final_verification.png', clip: { x: 0, y: 0, width: 1440, height: 850 } });
  
  const certSection = await page.$('#certificates');
  if (certSection) {
    await certSection.screenshot({ path: 'certificates_final_verification.png' });
  }

  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).map(a => ({ 
      href: a.href, 
      label: a.getAttribute('aria-label') || a.innerText 
    }));
  });

  const gitHubLinks = links.filter(l => l.href.includes('github.com'));
  const teleLinks = links.filter(l => l.href.includes('t.me'));

  console.log('GitHub links found:', gitHubLinks);
  console.log('Telegram links found:', teleLinks);

  await browser.close();
})();
