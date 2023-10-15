const {Recipe} = require("./type/recipe.js");
const {BAD, GOOD, NEUTRAL, RANDOM, SENSES} = require("./type/sense.js");

/**
 * @param {Recipe} recipe
 * @returns {{approx: boolean, mod: number, mods: string, price: string}}
 */
const priceModForRecipe = (recipe) => {
	let mod = 0;
	let approx = false;
	const mods = SENSES.map((sense) => recipe[sense])
		.map((sensation) => {
			if (sensation === GOOD) mod += 5;
			else if (sensation === BAD) mod -= 5;
			else if (sensation === RANDOM) approx = true;
			return sensation === NEUTRAL ? "." : sensation;
		})
		.join("");
	let price = `${recipe.price.toLocaleString()}g`;
	if (mod !== 0 || approx) {
		price = `${price} (${mod > 0 ? "+" : ""}${mod}%${approx ? "?" : ""})`;
	}
	return {approx, mod: mod / 100, mods, price};
};

module.exports = {priceModForRecipe};
