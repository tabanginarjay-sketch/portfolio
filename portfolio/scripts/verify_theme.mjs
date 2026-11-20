import puppeteer from 'puppeteer-core';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to live portfolio...');
  await page.goto('https://arjaytabangin.vercel.app', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/verify_theme_dark.png' });
  console.log('Saved verify_theme_dark.png');

  // Check initial theme
  const initialTheme = await page.evaluate(() => {
    return {
      htmlClass: document.documentElement.className,
      hasLight: document.documentElement.classList.contains('light'),
      hasDark: document.documentElement.classList.contains('dark')
    };
  });
  console.log('Initial Theme State:', initialTheme);

  // Click the theme toggle button
  console.log('Toggling to Light Mode...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('header button'));
    const themeBtn = btns.find(b => b.getAttribute('title')?.includes('Light') || b.innerText.includes('Light'));
    if (themeBtn) {
      themeBtn.click();
      return true;
    }
    return false;
  });
  console.log('Theme button clicked:', clicked);

  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'public/verify_theme_light_hero.png' });
  console.log('Saved verify_theme_light_hero.png');

  const lightState = await page.evaluate(() => {
    return {
      htmlClass: document.documentElement.className,
      hasLight: document.documentElement.classList.contains('light'),
      hasDark: document.documentElement.classList.contains('dark'),
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      h1Color: window.getComputedStyle(document.querySelector('h1') || document.body).color
    };
  });
  console.log('Light Mode State:', lightState);

  // Scroll to Projects in Light Mode
  await page.evaluate(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'public/verify_theme_light_projects.png' });
  console.log('Saved verify_theme_light_projects.png');

  // Scroll to Experience in Light Mode
  await page.evaluate(() => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'public/verify_theme_light_experience.png' });
  console.log('Saved verify_theme_light_experience.png');

  await browser.close();
  console.log('All verification screenshots complete!');
}

main().catch(console.error);
