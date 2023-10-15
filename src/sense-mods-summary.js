const {undefIfEmpty} = require("./is-empty.js");
const {HasSensations, NEUTRAL, SENSES} = require("./type/sense.js");

/**
 * @param {HasSensations} hasSensations
 * @param {string=} [none]
 * @returns {string}
 */
const senseModsSummary = (hasSensations, none = "") => {
	const summary = SENSES.map((sense) => hasSensations[sense])
		.filter((sensation) => sensation !== NEUTRAL)
		.join("");
	return undefIfEmpty(summary) ?? none;
};

module.exports = {senseModsSummary};
