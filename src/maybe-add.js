/**
 * @param {number|undefined|null} a
 * @param {number|undefined|null} b
 * @returns {number|undefined}
 */
const maybeAdd = (a, b) => a == null || b == null ? undefined : (a + b);

module.exports = {maybeAdd};
