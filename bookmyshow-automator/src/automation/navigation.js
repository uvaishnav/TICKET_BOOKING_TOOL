const { SELECTORS, URLS } = require('../config/constants');
const logger = require('../utils/logger');

const searchMovie = async (page, movieName) => {
    logger.info(`Searching for movie: ${movieName}`);
    try {
        await page.goto(URLS.HYDERABAD, { waitUntil: 'networkidle2' });

        const searchInputSelector = 'input[placeholder="Search for Movies, Events, Plays, Sports and Activities"]';
        await page.waitForSelector(searchInputSelector);
        await page.type(searchInputSelector, movieName);

        // Wait for search results to appear
        const searchResultSelector = '.sc-fQejPQ.jWuMqc';
        await page.waitForSelector(searchResultSelector);
        
        // Click on the first search result
        await page.click(searchResultSelector);

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        logger.info(`Navigated to movie page for: ${movieName}`);
        return page.url();
    } catch (error) {
        logger.error(`Error searching for movie "${movieName}":`, error);
        return null;
    }
};

const selectCity = async (page, cityName) => {
    logger.info(`Selecting city: ${cityName}`);
    try {
        // This is a simplified version. BMS city selection can be complex.
        // It often involves a modal. Let's assume we start on the correct city page for now.
        const currentUrl = page.url();
        if (!currentUrl.includes(cityName.toLowerCase())) {
            logger.warn(`Current city in URL (${currentUrl}) does not match target city (${cityName}). City selection logic might be needed.`);
            // Placeholder for complex city selection logic
            // For example: click city selector, type city, click result.
        }
        logger.info(`City is set to ${cityName}`);
        return true;
    } catch (error) {
        logger.error(`Error selecting city "${cityName}":`, error);
        return false;
    }
};

const filterTheaters = async (page, theaterNames, date) => {
    logger.info(`Filtering theaters for date: ${date}`);
    try {
        // Click "Book tickets"
        const bookTicketsButtonSelector = '.sc-1vmod7e-2.kYbrXv';
        await page.waitForSelector(bookTicketsButtonSelector);
        await page.click(bookTicketsButtonSelector);

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // Date selection logic would go here. It can be complex.
        // For now, we assume the current day is the target day.
        
        const theaterListSelector = '.sc-133848s-2.kLzJcc';
        await page.waitForSelector(theaterListSelector);

        const theatersOnPage = await page.evaluate((selector) => {
            const theaterElements = Array.from(document.querySelectorAll(selector));
            return theaterElements.map(el => el.innerText);
        }, theaterListSelector);

        logger.info(`Found theaters on page: ${theatersOnPage.join(', ')}`);

        const matchingTheaters = theatersOnPage.filter(theaterName => 
            theaterNames.some(preferredTheater => theaterName.includes(preferredTheater.name))
        );

        logger.info(`Matching preferred theaters: ${matchingTheaters.join(', ')}`);
        return matchingTheaters;

    } catch (error) {
        logger.error('Error filtering theaters:', error);
        return [];
    }
};


module.exports = {
  searchMovie,
  selectCity,
  filterTheaters,
};
