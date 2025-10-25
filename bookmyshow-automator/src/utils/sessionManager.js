const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

const cookiesFilePath = path.join(__dirname, '../../data/cookies.json');

const saveBrowserSession = async (page) => {
  try {
    const cookies = await page.cookies();
    await fs.writeFile(cookiesFilePath, JSON.stringify(cookies, null, 2));
    logger.info('Session cookies saved successfully.');
  } catch (error) {
    logger.error('Failed to save session cookies:', error);
  }
};

const restoreBrowserSession = async (page) => {
  try {
    const cookiesString = await fs.readFile(cookiesFilePath);
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
    logger.info('Session cookies loaded successfully.');
    return true;
  } catch (error) {
    logger.warn('No session cookies found or failed to load. Starting a new session.');
    return false;
  }
};

const isSessionValid = async (page) => {
    try {
        await page.goto('https://in.bookmyshow.com/explore/account', { waitUntil: 'networkidle2' });
        const url = page.url();
        if (url.includes('signin')) {
            logger.warn('Session is invalid or expired. Need to login again.');
            return false;
        }
        logger.info('Session is valid.');
        return true;
    } catch (error) {
        logger.error('Error validating session:', error);
        return false;
    }
};


module.exports = {
  saveBrowserSession,
  restoreBrowserSession,
  isSessionValid,
};
