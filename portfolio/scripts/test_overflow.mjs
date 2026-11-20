import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; height: 3000px; background: #000; }
        .hero {
          position: relative;
          height: 600px;
          overflow: hidden;
          background: #111;
        }
        .fixed-ball {
          position: fixed;
          left: 50px;
          top: 300px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 25px #22d3ee;
          z-index: 999;
        }
      </style>
    </head>
    <body>
      <div class="hero">
        <div class="fixed-ball"></div>
      </div>
      <div style="height: 2400px; padding: 50px; color: white;">
        <h1>Section 2 (Scrolled way past Hero)</h1>
      </div>
    </body>
    </html>
  `);
  
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.screenshot({ path: 'public/test_fixed_overflow.png' });
  await browser.close();
  console.log('Test completed');
}

main().catch(console.error);
