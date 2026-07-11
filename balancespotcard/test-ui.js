const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({executablePath: 'C:\\Users\\LENOVO\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe'});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0', timeout: 15000 }).catch(e => console.error('GOTO ERROR:', e.message));
  
  const title = await page.title();
  console.log('TITLE:', title);
  
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('BODY LENGTH:', bodyText.length);
  console.log('BODY START:', bodyText.substring(0, 100));

  await browser.close();
})();
