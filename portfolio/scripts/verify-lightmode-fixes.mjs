import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to production site...');
  await page.goto('https://arjaytabangin.vercel.app', { waitUntil: 'networkidle2' });

  // Switch to Light Mode
  console.log('Switching to Light Mode...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Light'));
    if (btn) btn.click();
    else document.documentElement.classList.add('light');
  });

  // Wait 600ms for smooth 450ms color transition to complete
  await new Promise(r => setTimeout(r, 600));

  // Check Logo in Light Mode
  const logoInfo = await page.evaluate(() => {
    const img = document.querySelector('.header-logo-badge img');
    return img ? { src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight } : null;
  });
  console.log('Logo info in Light Mode:', logoInfo);

  // Screenshot 1: Hero & Header in Light Mode
  const heroPath = 'C:\\Users\\jherald ramos\\.gemini\\antigravity\\brain\\f21a097d-0e10-43fb-a02b-1e1b189d73bb\\verify_fixed_hero_light.png';
  await page.screenshot({ path: heroPath });
  console.log('Saved Hero Light screenshot:', heroPath);

  // Scroll to Experience & Achievements
  console.log('Scrolling to Achievements & Experience...');
  await page.evaluate(() => {
    const el = document.getElementById('experience');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Check Achievements Card styles
  const achInfo = await page.evaluate(() => {
    const card = document.querySelector('.achievements-card');
    if (!card) return null;
    const style = window.getComputedStyle(card);
    const title = card.querySelector('h4');
    const titleStyle = title ? window.getComputedStyle(title) : null;
    return {
      bg: style.backgroundColor,
      bgImage: style.backgroundImage,
      borderColor: style.borderColor,
      titleColor: titleStyle ? titleStyle.color : null
    };
  });
  console.log('Achievements Card styles in Light Mode:', achInfo);

  // Screenshot 2: Achievements in Light Mode
  const expPath = 'C:\\Users\\jherald ramos\\.gemini\\antigravity\\brain\\f21a097d-0e10-43fb-a02b-1e1b189d73bb\\verify_fixed_achievements_light.png';
  await page.screenshot({ path: expPath });
  console.log('Saved Achievements Light screenshot:', expPath);

  // Scroll to Certificates
  console.log('Scrolling to Certificates...');
  await page.evaluate(() => {
    const el = document.getElementById('certificates');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Check Certificate visibility (should NOT be shielded)
  const certInfo = await page.evaluate(() => {
    const shield = document.querySelector('.cert-privacy-shield');
    const images = Array.from(document.querySelectorAll('.cert-protected img')).map(img => img.src);
    return {
      isShielded: Boolean(shield),
      certImageCount: images.length
    };
  });
  console.log('Certificates state in Light Mode:', certInfo);

  // Screenshot 3: Certificates in Light Mode
  const certPath = 'C:\\Users\\jherald ramos\\.gemini\\antigravity\\brain\\f21a097d-0e10-43fb-a02b-1e1b189d73bb\\verify_fixed_certificates_light.png';
  await page.screenshot({ path: certPath });
  console.log('Saved Certificates Light screenshot:', certPath);

  await browser.close();
}

main().catch(console.error);
