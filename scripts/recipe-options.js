import console from "node:console";
import {readdirSync} from "node:fs";
import {parseArgs} from "node:util";
import {formatRecipe} from "../format-recipe.js";
import {comparatorBuilder, ComparatorBuilder} from "../src/comparator.js";
import {Predicate} from "../src/filter-pipeline.js";
import {filterRecipesByInventory} from "../src/filter-recipes-by-inventory.js";
import {givens} from "../src/givens.js";
import {isEmpty, undefIfEmpty} from "../src/is-empty.js";
import {loadInventory} from "../src/load-inventory.js";
import {priceModForRecipe} from "../src/price-mod-for-recipe.js";
import {rarityForRecipe} from "../src/rarity-for-recipe.js";
import {senseModsSummary} from "../src/sense-mods-summary.js";
import {maybeIntFrom} from "../src/spreadsheet-helpers.js";
import {CAULDRON_SIZE_MAX} from "../src/type/cauldron.js";
import {PotionName} from "../src/type/potion.js";
import {Recipe} from "../src/type/recipe.js";
import {zeroPad} from "../src/zero-pad.js";

const {
	values: {
		all: wantAll,
		available,
		count: wantCount,
		ignoreStock,
		ignoreQuinn,
		inventory: inventoryPath,
		minItems: minItemsText,
		maxItems: maxItemsText,
		maxMagimins: maxMagiminsText,
		potion: potions,
		recipes: recipesPaths,
		shoppingOnly,
	},
} = parseArgs({
	options: {
		all: {default: "", type: "string"},
		available: {type: "boolean"},
		count: {default: "", short: "n", type: "string"},
		ignoreQuinn: {type: "boolean"},
		ignoreStock: {type: "boolean"},
		inventory: {type: "string"},
		maxItems: {default: "", type: "string"},
		maxMagimins: {default: "", type: "string"},
		minItems: {default: "", type: "string"},
		potion: {default: [], multiple: true, type: "string"},
		recipes: {default: [], multiple: true, type: "string"},
		shoppingOnly: {type: "boolean"},
		skipRecipes: {default: [], multiple: true, type: "string"},
	},
	strict: true,
});

const all = undefIfEmpty(wantAll) ?? "";
if (all !== "") {
	readdirSync("db", {encoding: "utf8", withFileTypes: true})
		.filter((d) => d.isFile() && d.name.includes(all) && !d.name.endsWith("-wide.tsv") && d.name.endsWith(".tsv") && !d.name.startsWith("."))
		.map((d) => `db/${d.name}`)
		.forEach((path) => recipesPaths.push(path));
}

if (isEmpty(inventoryPath)) {
	throw new Error("Required: --inventory");
}
if (isEmpty(recipesPaths)) {
	throw new Error("Required: --recipes");
}
const count = maybeIntFrom(wantCount) ?? 25;
const maxItems = maybeIntFrom(maxItemsText) ?? CAULDRON_SIZE_MAX;
const minItems = maybeIntFrom(minItemsText) ?? 2;
const maxMagimins = maybeIntFrom(maxMagiminsText) ?? givens.MAGIMINS_MAX;
const inventory = loadInventory(inventoryPath, {quinnOnly: !ignoreQuinn, stockedOnly: !shoppingOnly && !ignoreStock});
/** @type {Predicate.<PotionName>} */
let potionFilter;
if (potions.length > 0) {
	/** @type {PotionName[]} */
	let potionNames = [];
	if (potions.every((name) => name.startsWith("!"))) {
		potionNames = potions.map((name) => name.replace("!", ""));
		console.log(`Potion: excluding ${potionNames.join(", ")}`);
		potionFilter = (name) => !potionNames.includes(name);
	} else {
		potionNames = potions;
		console.log(`Potion: ${potionNames.join(", ")}`);
		potionFilter = (name) => potionNames.includes(name);
	}
	const notFound = potionNames.filter((name) => givens.potions.find((p) => p.name === name) == null);
	if (notFound.length > 0) {
		throw new Error(`Unknown --potion: ${notFound.join(", ")}`);
	}
} else {
	potionFilter = () => true;
}
console.log({count, inventoryCount: Object.keys(inventory).length, maxItems, maxMagimins});
/** @type {Recipe[]|undefined} */
let recipes = [];
/** @type {Recipe[]} */
let topRecipes = [];
/** @type {{[key: string]: number}} */
let topIngredients = {};
for (let recipesPath of recipesPaths) {
	console.log(`Scanning ${recipesPath} for matching recipes ...`);
	const filtered = filterRecipesByInventory(recipesPath, inventory, minItems, maxItems, maxMagimins, ignoreStock, !ignoreQuinn, potionFilter, () => !shoppingOnly);
	filtered.recipes
		.filter((r) => potionFilter(r.potionName))
		.forEach((r) => recipes.push(r));
	if (filtered.recipes.length > 0 && recipes.length > 0 && !shoppingOnly) {
		console.log(`Found: ${filtered.recipes.length} recipes; total: ${recipes.length}`);
		if (all === "") {
			break;
		}
	} else {
		console.log(`No recipes matched.  Got ${filtered.topRecipes.length} suggestions.`);
		if (shoppingOnly || recipes.length === 0) {
			filtered.topRecipes.forEach((r) => topRecipes.push(r));
			Object.entries(filtered.topIngredients)
				.forEach(([name, count]) => {
					topIngredients[name] = (topIngredients[name] ?? 0) + count;
				});
		}
	}
	if (recipes.length > count) {
		const maxMagimins = recipes.map((r) => r.magimins).reduce((p, c) => Math.max(p, c));
		/** @type {Recipe[]} */
		const atMax = recipes.filter((r) => r.magimins === maxMagimins);
		if (atMax.length > count) {
			console.log(`Trimming recipes: ${recipes.length} → ${atMax.length}`);
			recipes = atMax;
		}
	}
}
if (available) {
	Object.keys(topIngredients).forEach((name) => {
		if (!(name in inventory)) {
			delete topIngredients[name];
		}
	});
}
/** @type {ComparatorBuilder.<Recipe>} */
const builder = comparatorBuilder();
const comparator = builder
	.numbers((recipe) => recipe.magimins).reversed()
	.numbers((recipe) => rarityForRecipe(recipe).rarity)
	.numbers((recipe) => priceModForRecipe(recipe).mod).reversed()
	.numbers((recipe) => recipe.ingredientNames.length).reversed()
	.numbers((recipe) => recipe.price)
	.build();

if (recipes.length === 0) {
	// noinspection PointlessBooleanExpressionJS
	if (topRecipes == null || topIngredients == null) {
		throw new Error(`No recipes found, nor any suggestions available.  Brute more recipes.`);
	}
	if (shoppingOnly) {
		// noinspection JSObjectNullOrUndefined
		console.log(`Found ${Object.keys(topIngredients).length} ingredients in ${topRecipes.length} recipes.`);
	} else {
		console.log("⚠️ No recipes found which match your inventory. ⚠️");
	}
	console.log("Shopping list:");
	const shopping = Object.entries(topIngredients)
		.sort((a, b) => b[1] - a[1])
		.slice(0, count);
	const maxCountLen = shopping.map((e) => e[1]).reduce((p, c) => Math.max(p, c), 0).toLocaleString().length;
	shopping.forEach(([name, count]) => {
		const countText = count.toLocaleString();
		const left = " ".repeat(maxCountLen - countText.length);
		const ingredient = givens.ingredients.find((ingredient) => ingredient.name === name);
		const senseMods = senseModsSummary(ingredient, "neutral");
		console.log(["  ", left, countText, " ", name, " (", ingredient.rarity, ", ", senseMods, ")"].join(""));
	});
	console.log("\nTop recipes:");
	topRecipes.sort(comparator).slice(0, count * 2).forEach((recipe) => {
		recipes.push(recipe);
	});
}

const zeroes = Math.ceil(Math.log10(count + 1));

recipes.sort(comparator).slice(0, count).forEach((recipe, index) => {
	console.log(`${zeroPad(index + 1, zeroes)}. ${formatRecipe(recipe)}`);
});
