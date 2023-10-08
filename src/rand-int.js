/**
 * @function
 * @param {number} low
 * @param {number} high
 * @returns {number}
 */
export const randInt = (low, high) => low + Math.floor(Math.random() * (high - low));
