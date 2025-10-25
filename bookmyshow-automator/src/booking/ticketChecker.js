const logger = require('../utils/logger');
const { selectCity, searchMovie } = require('../automation/navigation');

const checkTicketsReleased = async (page, movieName, date, cityName) => {
    logger.info(`Checking if tickets are released for "${movieName}" in ${cityName} on date: ${date}`);
    try {
        await selectCity(page, cityName);
        await searchMovie(page, movieName);

        // This selector is for the main "Book tickets" button on the movie page.
        const bookTicketsButtonSelector = '.sc-1vmod7e-2.kYbrXv';
        const notifyMeButtonSelector = 'button.sc-1vmod7e-2.gJbHot'; // Example selector for "Notify Me"
        
        await page.waitForSelector(`${bookTicketsButtonSelector}, ${notifyMeButtonSelector}`);

        const isBookTicketsVisible = await page.$(bookTicketsButtonSelector) !== null;
        
        if (isBookTicketsVisible) {
            logger.info(`Tickets are released for "${movieName}".`);
            return { released: true };
        } else {
            logger.info(`Tickets are not yet released for "${movieName}". "Notify Me" button found.`);
            return { released: false };
        }
    } catch (error) {
        logger.error(`Error checking ticket release status for "${movieName}":`, error);
        // If neither button is found, it could be an error or a different page state.
        // For example "Coming Soon" which doesn't have a button.
        const comingSoonSelector = '.sc-1vmod7e-4.dYlUgr'; // Example selector for "Coming Soon" text
        const isComingSoon = await page.$(comingSoonSelector) !== null;
        if(isComingSoon) {
            logger.info(`"${movieName}" is marked as "Coming Soon".`);
        } else {
            logger.error(`Could not determine ticket release status for "${movieName}".`);
        }
        return { released: false };
    }
};

const checkSpecificShow = async (page, theater, screenType, timeSlot) => {
    // This is a placeholder for more complex logic.
    // It would involve navigating to the theater page for the movie and checking the status of showtimes.
    logger.info(`Checking specific show for ${theater.name}, ${screenType.type}, between ${timeSlot.start} and ${timeSlot.end}`);
    // This function will be implemented in more detail later.
    // For now, it's a placeholder.
    return 'Not implemented';
};

const parseAvailableShows = async (page) => {
    logger.info('Parsing available shows...');
    try {
        // This function will parse the showtimes page and return a structured list of available shows.
        // This is a complex task and will be built out.
        const showtimesSelector = '.showtime-pill-container'; // Example selector
        await page.waitForSelector(showtimesSelector);

        const shows = await page.evaluate(() => {
            // Logic to extract showtimes, screen types, and availability status
            return [
                // Example structure
                { theater: 'Prasads Multiplex', screen: 'IMAX', time: '19:00', status: 'Available' },
                { theater: 'AMB Cinemas', screen: 'PCX', time: '20:00', status: 'Filling Fast' },
            ];
        });
        logger.info('Successfully parsed available shows.');
        return shows;
    } catch (error) {
        logger.error('Error parsing available shows:', error);
        return [];
    }
};


module.exports = {
  checkTicketsReleased,
  checkSpecificShow,
  parseAvailableShows,
};
