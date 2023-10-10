/**
 * @function
 * @param {number} low Inclusive
 * @param {number} high Exclusive
 * @returns {number}
 */
export const randInt = (low, high) => low + Math.floor(Math.random() * (high - low));
