/**
 * @function
 * @param {number} low Inclusive
 * @param {number} high Exclusive
 * @returns {number}
 */
const randInt = (low, high) => low + Math.floor(Math.random() * (high - low));

module.exports = {randInt};
