/**
 * @typedef RarityName
 * @type {string}
 */

/**
 * @type {RarityName}
 */
let RarityName;

const RARITY_NAME_BY_NUM = Object.freeze([
	undefined,
	"Common",
	"Uncommon",
	"Rare",
	"Epic",
]);

const RARITY_NUM_BY_NAME = Object.freeze({
	Common: 1,
	Epic: 4,
	Rare: 3,
	Uncommon: 2,
});

// noinspection JSUnusedAssignment
module.exports = {RARITY_NAME_BY_NUM, RARITY_NUM_BY_NAME, RarityName};
