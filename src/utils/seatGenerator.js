/**
 * Seat Generator Utility
 * Generates stable seat layouts based on sessionId for consistent display.
 */

const ROWS = 8;
const COLS = 10;
const SEAT_PRICE_NORMAL = 200;
const SEAT_PRICE_PREMIUM = 240;

/**
 * Creates a seeded random number generator for consistent results
 * @param {string} sessionId - Unique session identifier
 * @returns {function} - Function that returns pseudo-random number 0-1
 */
const createSeededRandom = (sessionId) => {
    // Convert sessionId to a numeric seed
    let seed = sessionId.split('').reduce((acc, char, idx) => {
        return acc + char.charCodeAt(0) * (idx + 1);
    }, 0);

    // Linear Congruential Generator
    return () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
    };
};

/**
 * Generates seat layout for a specific session
 * @param {string} sessionId - Unique session identifier
 * @param {number} occupancyRate - Probability of seat being occupied (0-1), default 0.2
 * @returns {Array} - Array of seat objects
 */
export const generateSeatsForSession = (sessionId, occupancyRate = 0.2) => {
    const seededRandom = createSeededRandom(sessionId);
    const seats = [];

    for (let r = 0; r < ROWS; r++) {
        const rowLabel = String.fromCharCode(65 + r); // A, B, C...
        for (let c = 1; c <= COLS; c++) {
            const isPremium = r >= ROWS - 2; // Last 2 rows are premium
            const isOccupied = seededRandom() < occupancyRate;

            seats.push({
                id: `${rowLabel}${c}`,
                row: rowLabel,
                number: c,
                price: isPremium ? SEAT_PRICE_PREMIUM : SEAT_PRICE_NORMAL,
                type: isPremium ? 'Premium' : 'Normal',
                status: isOccupied ? 'occupied' : 'available'
            });
        }
    }

    return seats;
};

export { ROWS, COLS, SEAT_PRICE_NORMAL, SEAT_PRICE_PREMIUM };
