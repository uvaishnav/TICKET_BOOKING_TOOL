const { SELECTORS, URLS } = require('../config/constants');
const logger = require('../utils/logger');
const { saveBrowserSession } = require('../utils/sessionManager');

const performLogin = async (page) => {
  logger.info('Attempting to login...');
  try {
    await page.goto(URLS.HYDERABAD, { waitUntil: 'networkidle2' });

    // Click on Sign in button
    const signInButtonSelector = 'a.bwc__sc-1nbn7v6-10';
    await page.waitForSelector(signInButtonSelector);
    await page.click(signInButtonSelector);

    // Wait for the login modal to appear
    await page.waitForSelector(SELECTORS.EMAIL_INPUT);
    
    await page.type(SELECTORS.EMAIL_INPUT, process.env.BMS_EMAIL);
    await page.click(SELECTORS.CONTINUE_BUTTON);

    // BMS might have a check here, a delay might be needed.
    await page.waitForTimeout(2000); 

    // Check if password input is visible
    const passwordInputVisible = await page.$(SELECTORS.PASSWORD_INPUT) !== null;
    if (passwordInputVisible) {
        await page.type(SELECTORS.PASSWORD_INPUT, process.env.BMS_PASSWORD);
        await page.click(SELECTORS.CONTINUE_BUTTON);
    }
    
    // Wait for successful login. A good way is to wait for a specific element that only appears when logged in.
    // For example, the profile icon. Let's assume a selector for it.
    const profileIconSelector = '.bwc__sc-1nbn7v6-6.bwc__sc-1nbn7v6-7'; 
    await page.waitForSelector(profileIconSelector, { timeout: 60000 });
    
    logger.info('Login successful.');
    await saveBrowserSession(page);
    return true;
  } catch (error) {
    logger.error('Login failed:', error);
    await page.screenshot({ path: 'login_error.png' });
    return false;
  }
};

const isLoggedIn = async (page) => {
    try {
        await page.goto(URLS.BASE, { waitUntil: 'networkidle2' });
        const profileIconSelector = '.bwc__sc-1nbn7v6-6.bwc__sc-1nbn7v6-7';
        const loggedIn = await page.$(profileIconSelector) !== null;
        if(loggedIn) {
            logger.info('User is already logged in.');
        } else {
            logger.info('User is not logged in.');
        }
        return loggedIn;
    } catch (error) {
        logger.error('Error checking login status:', error);
        return false;
    }
};


module.exports = {
  performLogin,
  isLoggedIn,
};
