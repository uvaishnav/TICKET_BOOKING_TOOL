const logger = require('../utils/logger');

const findConsecutiveSeats = (availableSeats, count) => {
    if (!availableSeats || availableSeats.length < count) {
        return [];
    }

    const consecutiveGroups = [];
    for (let i = 0; i <= availableSeats.length - count; i++) {
        const group = availableSeats.slice(i, i + count);
        const isConsecutive = group.every((seat, index) => {
            if (index === 0) return true;
            return parseInt(seat) === parseInt(group[index - 1]) + 1;
        });

        if (isConsecutive) {
            consecutiveGroups.push(group);
            // To avoid overlapping groups, we can jump i
            i += count - 1;
        }
    }
    return consecutiveGroups;
};

const scoreSeatGroup = (group, preferences, row, sections) => {
    let score = 0;
    const { preferredRows, sectionPreference } = preferences;

    // Score based on row
    if (preferredRows.includes(row)) {
        score += 10; // High score for preferred row
    }

    // Score based on section
    const middleSeat = group[Math.floor(group.length / 2)];
    if (sectionPreference === 'middle') {
        if (middleSeat >= sections.middle.start && middleSeat <= sections.middle.end) {
            score += 5;
        }
    } else if (sectionPreference === 'left') {
        if (middleSeat >= sections.left.start && middleSeat <= sections.left.end) {
            score += 5;
        }
    } else if (sectionPreference === 'right') {
        if (middleSeat >= sections.right.start && middleSeat <= sections.right.end) {
            score += 5;
        }
    }
    
    // Add more scoring logic here, e.g., distance from center of row.

    return score;
};

const selectBestSeats = (seatMap, preferences, sections) => {
    logger.info('Selecting best seats based on preferences...');
    const { numberOfTickets, preferredRows, minRowsFromScreen } = preferences;

    let bestSelection = {
        group: [],
        row: '',
        score: -1,
    };

    const rowsToConsider = Object.keys(seatMap.rows).filter(rowId => {
        // Example: Assuming rows are alphabetical, and we can calculate distance from screen
        const rowIndex = rowId.charCodeAt(0) - 'A'.charCodeAt(0);
        return rowIndex >= minRowsFromScreen;
    });

    // Prioritize preferred rows
    const sortedRows = [
        ...preferredRows.filter(r => rowsToConsider.includes(r)),
        ...rowsToConsider.filter(r => !preferredRows.includes(r)),
    ];

    for (const row of sortedRows) {
        const availableSeats = seatMap.rows[row].available;
        const consecutiveGroups = findConsecutiveSeats(availableSeats, numberOfTickets);

        if (consecutiveGroups.length > 0) {
            for (const group of consecutiveGroups) {
                const score = scoreSeatGroup(group, preferences, row, sections);
                if (score > bestSelection.score) {
                    bestSelection = { group, row, score };
                }
            }
        }
    }

    if (bestSelection.score !== -1) {
        logger.info(`Best seats selected: Row ${bestSelection.row}, Seats ${bestSelection.group.join(', ')} with score ${bestSelection.score}`);
        return bestSelection;
    } else {
        logger.warn('Could not find any suitable consecutive seats. Fallback logic may be needed.');
        // Implement fallback logic here if needed (e.g., split groups)
        return null;
    }
};

module.exports = {
  selectBestSeats,
  findConsecutiveSeats,
  scoreSeatGroup,
};
