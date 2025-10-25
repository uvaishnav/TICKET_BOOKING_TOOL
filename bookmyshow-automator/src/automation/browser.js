const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const initBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS_MODE === 'true',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // <- this one doesn't works in Windows
      '--disable-gpu'
    ],
  });
  return browser;
};

const createPage = async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36');
  
  // Block images and fonts to speed up loading
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (['image', 'font'].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  return page;
};

const closeBrowser = async (browser) => {
  await browser.close();
};

module.exports = {
  initBrowser,
  createPage,
  closeBrowser,
};
