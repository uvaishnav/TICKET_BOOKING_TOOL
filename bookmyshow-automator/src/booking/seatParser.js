const logger = require('../utils/logger');

const parseSeatMap = async (page) => {
    logger.info('Parsing seat map...');
    try {
        // Wait for the seat layout to be visible
        const seatLayoutSelector = '#seat-layout';
        await page.waitForSelector(seatLayoutSelector, { timeout: 10000 });

        const seatMap = await page.evaluate(() => {
            const rows = {};
            const seatLayout = document.querySelector('#seat-layout');
            if (!seatLayout) return null;

            const rowElements = Array.from(seatLayout.querySelectorAll('.row'));

            rowElements.forEach(rowEl => {
                const rowId = rowEl.querySelector('.row-id').innerText.trim();
                if (!rowId) return;

                rows[rowId] = {
                    seats: [],
                    available: [],
                };

                const seatElements = Array.from(rowEl.querySelectorAll('a.seat'));
                seatElements.forEach(seatEl => {
                    const seatNumberEl = seatEl.querySelector('div');
                    if (!seatNumberEl) return;

                    const seatNumber = seatNumberEl.innerText.trim();
                    rows[rowId].seats.push(seatNumber);

                    // BMS uses different classes for seat status.
                    // '_available' is a common one.
                    if (seatEl.classList.contains('_available')) {
                        rows[rowId].available.push(seatNumber);
                    }
                });
            });

            // This is a simplified representation. Pricing and sections would need more complex parsing.
            return {
                rows,
                // sections: { left: [], middle: [], right: [] }, // Placeholder
                // pricing: {}, // Placeholder
            };
        });

        if (seatMap) {
            logger.info('Seat map parsed successfully.');
        } else {
            logger.warn('Could not find seat map on the page.');
        }
        return seatMap;

    } catch (error) {
        logger.error('Error parsing seat map:', error);
        await page.screenshot({ path: 'seat_map_error.png' });
        return null;
    }
};

const identifySeatSections = (seatMap) => {
    // This is a placeholder for logic to identify seat sections (left, middle, right).
    // This would likely involve analyzing the seat numbers and their positions.
    logger.info('Identifying seat sections (not implemented).');
    return {
        left: { start: 1, end: 5 },
        middle: { start: 6, end: 15 },
        right: { start: 16, end: 20 },
    };
};

const getAvailableSeats = (seatMap, row) => {
    if (seatMap && seatMap.rows && seatMap.rows[row]) {
        return seatMap.rows[row].available;
    }
    return [];
};


module.exports = {
  parseSeatMap,
  identifySeatSections,
  getAvailableSeats,
};
