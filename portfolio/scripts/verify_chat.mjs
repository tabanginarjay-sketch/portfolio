import puppeteer from 'puppeteer-core';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    defaultViewport: { width: 1400, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));

  // Verify Let's Chat button is NOT covered by SmokeAtmosphere and actually receives clicks
  const hitTest = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const chatBtn = btns.find((b) => b.textContent?.includes("Let's Chat"));
    if (!chatBtn) return { found: false };
    const rect = chatBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const topEl = document.elementFromPoint(cx, cy);
    return {
      found: true,
      rect: { x: Math.round(rect.left), y: Math.round(rect.top), w: Math.round(rect.width), h: Math.round(rect.height) },
      isClickableTopElement: chatBtn.contains(topEl),
      topTag: topEl?.tagName,
    };
  });
  console.log("Let's Chat hit-test:", hitTest);

  // Click Let's Chat and verify modal opens
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes("Let's Chat"));
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  const modalState = await page.evaluate(() => {
    const heading = document.querySelector('h3');
    const nameInput = document.querySelector('#contact-name');
    const emailInput = document.querySelector('#contact-email');
    const msgInput = document.querySelector('#contact-message');
    return {
      modalOpened: heading?.textContent?.includes("Let's Build Together") ?? false,
      hasNameInput: Boolean(nameInput),
      hasEmailInput: Boolean(emailInput),
      hasMsgInput: Boolean(msgInput),
    };
  });
  console.log('Modal state after click:', modalState);

  await page.screenshot({ path: 'public/certificates/verify_chat_modal.png' });
  await browser.close();
}

main().catch(console.error);
