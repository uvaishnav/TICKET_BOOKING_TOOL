const cron = require('node-cron');
const logger = require('../utils/logger');

let cronJob = null;

const startPolling = (checkFunction, intervalSeconds) => {
    if (cronJob) {
        logger.warn('Polling is already running.');
        return;
    }

    logger.info(`Starting polling every ${intervalSeconds} seconds.`);
    
    // Validate the interval to be a valid cron expression
    const cronInterval = `*/${intervalSeconds} * * * * *`;
    if (!cron.validate(cronInterval)) {
        logger.error(`Invalid cron interval: ${cronInterval}`);
        return;
    }

    cronJob = cron.schedule(cronInterval, async () => {
        logger.info('Executing polling check...');
        try {
            await checkFunction();
        } catch (error) {
            logger.error('Error during polling check:', error);
        }
    });

    cronJob.start();
};

const stopPolling = () => {
    if (cronJob) {
        logger.info('Stopping polling.');
        cronJob.stop();
        cronJob = null;
    } else {
        logger.info('Polling is not running.');
    }
};

const adjustInterval = (checkFunction, newIntervalSeconds) => {
    logger.info(`Adjusting polling interval to ${newIntervalSeconds} seconds.`);
    stopPolling();
    startPolling(checkFunction, newIntervalSeconds);
};

module.exports = {
  startPolling,
  stopPolling,
  adjustInterval,
};
