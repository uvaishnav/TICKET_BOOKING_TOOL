const logger = require('../utils/logger');
const { SELECTORS } = require('../config/constants');

const clickSeats = async (page, selectedSeats) => {
    logger.info(`Clicking selected seats: ${selectedSeats.join(', ')}`);
    try {
        for (const seat of selectedSeats) {
            // The seat ID might need to be constructed based on how they are represented in the DOM
            const seatSelector = `a[data-seat-id="${seat}"]`; // This is an assumed selector
            await page.waitForSelector(seatSelector);
            await page.click(seatSelector);
            await page.waitForTimeout(500); // Small delay between clicks
        }
        logger.info('All selected seats have been clicked.');
        return true;
    } catch (error) {
        logger.error('Error clicking seats:', error);
        await page.screenshot({ path: 'seat_clicking_error.png' });
        return false;
    }
};

const proceedToPayment = async (page) => {
    logger.info('Proceeding to payment...');
    try {
        // This selector is for the "Proceed" or "Pay" button after selecting seats.
        const proceedButtonSelector = SELECTORS.PROCEED_BUTTON; // Using from constants
        await page.waitForSelector(proceedButtonSelector, { visible: true });
        await page.click(proceedButtonSelector);

        // Wait for navigation to the payment page.
        // The URL might change, or a specific element on the payment page can be awaited.
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
        
        const paymentPageUrl = page.url();
        logger.info(`Navigated to payment page: ${paymentPageUrl}`);
        
        // Verification of being on the payment page
        if (paymentPageUrl.includes('payment')) {
            logger.info('Successfully on the payment page.');
            return paymentPageUrl;
        } else {
            logger.warn('May not have reached the payment page. Please verify.');
            return paymentPageUrl;
        }
    } catch (error) {
        logger.error('Error proceeding to payment:', error);
        await page.screenshot({ path: 'payment_proceed_error.png' });
        return null;
    }
};

const verifyBookingDetails = async (page) => {
    logger.info('Verifying booking details on payment page...');
    try {
        // This is a placeholder for logic to extract and verify booking details.
        // Selectors for movie name, theater, time, seats, and price would be needed.
        const movieNameSelector = '.movie-title-class'; // Example selector
        const movieName = await page.$eval(movieNameSelector, el => el.innerText);
        
        // ... and so on for other details.

        const bookingSummary = {
            movieName,
            // theater, showtime, seats, price
        };
        
        logger.info('Booking details verified:', bookingSummary);
        return bookingSummary;
    } catch (error) {
        logger.error('Error verifying booking details:', error);
        return null;
    }
};


module.exports = {
  clickSeats,
  proceedToPayment,
  verifyBookingDetails,
};
