import {givens} from "./givens.js";
import {simpleColumn} from "./spreadsheet-helpers.js";
import {CAULDRON_SIZE_MAX} from "./type/cauldron.js";
import {Recipe, WideRecipe} from "./type/recipe.js";


/**
 * @function
 * @param {number|undefined} [maxItems]
 * @returns {({name: string, toString:(function(*,string,WideRecipe):string)})[]}
 */
export const wideRecipeColumns = (maxItems = CAULDRON_SIZE_MAX) => {
	/** @type {number[]} */
	const indexes = "*".repeat(maxItems).split("").map((_v, index) => index + 1);
	return [
		simpleColumn("Potion"),
		simpleColumn("Tier"),
		simpleColumn("Stars"),
		simpleColumn("MM"),
		simpleColumn("Cost"),
		simpleColumn("Taste"),
		simpleColumn("Touch"),
		simpleColumn("Smell"),
		simpleColumn("Sight"),
		simpleColumn("Sound"),
		simpleColumn("Count"),
		...(indexes.flatMap((index) => [
			simpleColumn(`I${index}`),
			{name: `#${index}`, toString: (_v, _n, r) => r[`C${index}`]},
		])),
		simpleColumn("A"),
		simpleColumn("B"),
		simpleColumn("C"),
		simpleColumn("D"),
		simpleColumn("E"),
		{name: "In Stock", toString: (_v, _n, r) => r.InStock},
	];
};

/**
 * @function
 * @returns {function(Recipe):WideRecipe}
 */
export const recipeWidener = () => {
	const stockRefs = Object.fromEntries(givens.ingredients
		.map((i) => i.name)
		.sort()
		.map((name, index) => [name, `Ingredients!$C$${index + 2}`]));
	return (/**Recipe*/ recipe) => {
		/** @type {{[key: string]: number}} */
		const countOf = {};
		recipe.ingredientNames.forEach((name) => {
			countOf[name] = (countOf[name] ?? 0) + 1;
		});
		/** @type {WideRecipe} */
		const wide = {
			A: recipe.A,
			B: recipe.B,
			C: recipe.C,
			Cost: recipe.price,
			Count: recipe.ingredientCount,
			D: recipe.D,
			E: recipe.E,
			MM: recipe.magimins,
			Potion: recipe.potionName,
			Sight: recipe.sight,
			Smell: recipe.smell,
			Sound: recipe.sound,
			Stars: recipe.stars,
			Taste: recipe.taste,
			Tier: recipe.tier,
			Touch: recipe.touch,
		};
		/** @type {string[]} */
		let stockExpressions = [];
		Object.entries(countOf)
			.sort((a, b) => a[0].localeCompare(b[0]))
			.forEach(([name, count], index) => {
				const colIndex = index + 1;
				wide[`I${colIndex}`] = name;
				wide[`C${colIndex}`] = count;
				stockExpressions.push(`${stockRefs[name]}>=${count}`);
			});
		wide.InStock = `=AND(${stockExpressions.join(",")})`;
		return wide;
	};
};
