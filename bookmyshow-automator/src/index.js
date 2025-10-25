require('dotenv').config();
const logger = require('./utils/logger');
const preferences = require('./config/preferences');
const { initBrowser, createPage, closeBrowser } = require('./automation/browser');
const { restoreBrowserSession, isSessionValid } = require('./utils/sessionManager');
const { performLogin } = require('./automation/login');
const { startPolling, stopPolling } = require('./scheduler/poller');
const { checkTicketsReleased } = require('./booking/ticketChecker');
const { searchMovie, filterTheaters } = require('./automation/navigation');
const { parseSeatMap, identifySeatSections } = require('./booking/seatParser');
const { selectBestSeats } = require('./booking/seatSelector');
const { clickSeats, proceedToPayment } = require('./booking/checkoutHandler');
const { showSuccessNotification, showErrorNotification, showStatusNotification } = require('./utils/notifier');

const main = async () => {
    let browser = null;
    try {
        logger.info('Starting BookMyShow Automation...');
        browser = await initBrowser();
        const page = await createPage(browser);

        // Session and Login
        const sessionLoaded = await restoreBrowserSession(page);
        if (!sessionLoaded || !(await isSessionValid(page))) {
            const loggedIn = await performLogin(page);
            if (!loggedIn) {
                throw new Error('Login failed. Exiting.');
            }
        }

        // Main polling logic
        const checkFunction = async () => {
            const { released } = await checkTicketsReleased(page, preferences.movieName, preferences.date, preferences.city);
            if (released) {
                showStatusNotification(`Tickets for ${preferences.movieName} are released!`);
                stopPolling();
                await bookTickets(page);
            } else {
                showStatusNotification(`Tickets for ${preferences.movieName} are not yet released. Still checking...`);
            }
        };

        startPolling(checkFunction, process.env.POLL_INTERVAL || 45);

    } catch (error) {
        logger.error('A critical error occurred in the main process:', error);
        showErrorNotification('A critical error occurred. Check logs.');
        if (browser) {
            await closeBrowser(browser);
        }
        process.exit(1);
    }
};

const bookTickets = async (page) => {
    try {
        logger.info('Starting the booking process...');
        await searchMovie(page, preferences.movieName);
        const theaters = await filterTheaters(page, preferences.theaters, preferences.date);

        if (theaters.length === 0) {
            logger.warn('No matching theaters found.');
            return;
        }
        
        // For simplicity, let's try the first matching theater
        // A more robust implementation would iterate through them based on priority
        
        // This is where we would navigate to the showtime and then the seat map
        // This part is complex and requires more detailed navigation logic
        // For now, let's assume we have navigated to the seat selection page
        
        // The following is a conceptual flow
        /*
        await navigateToShowtime(page, theaters[0], preferences.screenTypes[0], preferences.timeSlots[0]);
        const seatMap = await parseSeatMap(page);
        if (seatMap) {
            const sections = identifySeatSections(seatMap);
            const bestSeats = selectBestSeats(seatMap, preferences.seatPreferences, sections);

            if (bestSeats) {
                await clickSeats(page, bestSeats.group.map(seat => `${bestSeats.row}-${seat}`));
                const paymentUrl = await proceedToPayment(page);
                if (paymentUrl) {
                    showSuccessNotification({
                        movieName: preferences.movieName,
                        theater: theaters[0].name,
                        showtime: '...', // This would be extracted
                        seats: bestSeats.group,
                    });
                    logger.info(`Booking process paused. Please complete payment at: ${paymentUrl}`);
                    // The script will now wait. The browser remains open.
                }
            } else {
                logger.warn('Could not find suitable seats.');
            }
        }
        */
       logger.info("Conceptual booking flow finished. More implementation needed for full navigation.");


    } catch (error) {
        logger.error('Error during the booking process:', error);
        showErrorNotification('An error occurred during booking. Check logs.');
    }
};


// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('SIGINT received. Shutting down gracefully.');
    stopPolling();
    // any other cleanup
    process.exit(0);
});

main();
