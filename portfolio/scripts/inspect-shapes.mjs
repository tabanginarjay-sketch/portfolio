import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://arjaytabangin.vercel.app', { waitUntil: 'networkidle2' });

  const shapes = await page.evaluate(() => {
    const allCyan = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.borderColor.includes('34, 211, 238') || style.backgroundColor.includes('0, 229, 255') || style.backgroundColor.includes('34, 211, 238');
    }).map(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        className: el.className,
        tagName: el.tagName,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        borderRadius: style.borderRadius,
        transform: style.transform
      };
    });
    return allCyan;
  });

  console.log('Shapes found:', JSON.stringify(shapes, null, 2));
  await browser.close();
}

main().catch(console.error);
