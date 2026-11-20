import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to live production site...');
  await page.goto('https://arjaytabangin.vercel.app', { waitUntil: 'networkidle2' });

  // 1. Initial State: scrollY = 0, check button state
  const initialBtn = await page.evaluate(() => {
    const btn = document.querySelector('.back-to-top-btn');
    if (!btn) return null;
    const parent = btn.parentElement;
    const style = window.getComputedStyle(parent);
    return {
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      transform: style.transform
    };
  });
  console.log('Initial state (top of page):', initialBtn);

  // 2. Scroll down 1200px
  console.log('Scrolling down 1200px...');
  await page.evaluate(() => window.scrollTo(0, 1200));
  await new Promise(r => setTimeout(r, 600));

  const scrolledBtn = await page.evaluate(() => {
    const btn = document.querySelector('.back-to-top-btn');
    if (!btn) return null;
    const parent = btn.parentElement;
    const style = window.getComputedStyle(parent);
    return {
      opacity: style.opacity,
      pointerEvents: style.pointerEvents,
      transform: style.transform
    };
  });
  console.log('Scrolled state (at 1200px):', scrolledBtn);

  // Capture screenshot of Dark mode with Back to Top button visible
  const darkPath = 'C:\\Users\\jherald ramos\\.gemini\\antigravity\\brain\\f21a097d-0e10-43fb-a02b-1e1b189d73bb\\verify_back_to_top_dark.png';
  await page.screenshot({ path: darkPath });
  console.log('Saved dark mode screenshot:', darkPath);

  // 3. Switch to Light Mode and capture screenshot
  console.log('Toggling to Light Mode...');
  await page.evaluate(() => {
    const themeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Light') || b.textContent.includes('Dark')));
    if (themeBtn) themeBtn.click();
    else document.documentElement.classList.add('light');
  });
  await new Promise(r => setTimeout(r, 400));

  const lightPath = 'C:\\Users\\jherald ramos\\.gemini\\antigravity\\brain\\f21a097d-0e10-43fb-a02b-1e1b189d73bb\\verify_back_to_top_light.png';
  await page.screenshot({ path: lightPath });
  console.log('Saved light mode screenshot:', lightPath);

  // 4. Test clicking Back to Top button
  console.log('Clicking Back to Top button...');
  await page.evaluate(() => {
    const btn = document.querySelector('.back-to-top-btn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const finalScrollY = await page.evaluate(() => window.scrollY);
  console.log('Final scroll position after click:', finalScrollY);

  await browser.close();
}

main().catch(console.error);
