import {undefIfEmpty} from "./is-empty.js";
import {HasSensations, NEUTRAL, SENSES} from "./type/sense.js";

/**
 * @param {HasSensations} hasSensations
 * @param {string=} [none]
 * @returns {string}
 */
export const senseModsSummary = (hasSensations, none = "") => {
	const summary = SENSES.map((sense) => hasSensations[sense])
		.filter((sensation) => sensation !== NEUTRAL)
		.join("");
	return undefIfEmpty(summary) ?? none;
};
