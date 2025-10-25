const notifier = require('node-notifier');
const logger = require('./logger');

const sendNotification = (title, message, options = {}) => {
    logger.info(`Sending notification: ${title} - ${message}`);
    notifier.notify(
        {
            title,
            message,
            sound: options.sound || true, // Play a sound by default
            wait: options.wait || false, // Do not wait for user interaction by default
            ...options,
        },
        (err, response) => {
            if (err) {
                logger.error('Error sending notification:', err);
            }
        }
    );
};

const showSuccessNotification = (bookingDetails) => {
    const { movieName, theater, showtime, seats } = bookingDetails;
    const title = '🎬 Tickets Found!';
    const message = `${movieName}\n${theater} - ${showtime}\nSeats: ${seats.join(', ')}`;
    sendNotification(title, message, { wait: true }); // Wait for user to click
};

const showErrorNotification = (errorMessage) => {
    const title = '❌ Automation Error';
    sendNotification(title, errorMessage, { wait: true });
};

const showStatusNotification = (statusMessage) => {
    const title = 'ℹ️ Automation Status';
    sendNotification(title, statusMessage, { sound: false }); // No sound for general status
};


module.exports = {
  sendNotification,
  showSuccessNotification,
  showErrorNotification,
  showStatusNotification,
};
