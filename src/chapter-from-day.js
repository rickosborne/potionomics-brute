/**
 * @param {number} day
 * @returns {number}
 */
const chapterFromDay = (day) => 1 + Math.floor((day - 1) / 10);

module.exports = {chapterFromDay};
