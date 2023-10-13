import console from "node:console";
import {parseArgs} from "node:util";
import {existsSync} from "../src/exists-sync.js";
import {Predicate} from "../src/filter-pipeline.js";
import {givens} from "../src/givens.js";
import {isEmpty} from "../src/is-empty.js";
import {loadSpreadsheet} from "../src/load-csv.js";
import {sortRecipesTopMagimin} from "../src/recipe-comparator.js";
import {recipeFromRow} from "../src/recipe-from-row.js";
import {recipeSet} from "../src/recipe-id-set.js";
import {maybeIntFrom} from "../src/spreadsheet-helpers.js";
import {spreadsheetStream, SpreadsheetStream} from "../src/spreadsheet-stream.js";
import {CAULDRON_SIZE_MAX} from "../src/type/cauldron.js";
import {PotionName} from "../src/type/potion.js";
import {Recipe, WideRecipe} from "../src/type/recipe.js";
import {recipeWidener, wideRecipeColumns} from "../src/widen-recipe.js";

const {
	values: {
		maxItems: wantItemsMax,
		minItems: wantItemsMin,
		maxMagimins: wantMagiminsMax,
		minMagimins: wantMagiminsMin,
		notIn: notInPaths,
		potion: wantPotions,
		recipes: recipesPaths,
	},
} = parseArgs({
	options: {
		maxItems: {type: "string"},
		maxMagimins: {type: "string"},
		minItems: {type: "string"},
		minMagimins: {type: "string"},
		notIn: {default: [], multiple: true, type: "string"},
		potion: {default: [], multiple: true, type: "string"},
		recipes: {multiple: true, type: "string"},
	},
	strict: true,
});

const minItems = maybeIntFrom(wantItemsMin) ?? 2;
const maxItems = maybeIntFrom(wantItemsMax) ?? CAULDRON_SIZE_MAX;
const minMagimins = maybeIntFrom(wantMagiminsMin) ?? 1;
const maxMagimins = maybeIntFrom(wantMagiminsMax) ?? givens.MAGIMINS_MAX;
const excludedRecipes = recipeSet();
notInPaths.forEach((path) => {
	console.log(`Loading excluded recipes from: ${path}`);
	loadSpreadsheet(path, (/**RecipeRow*/row) => {
		const recipe = recipeFromRow(row);
		excludedRecipes.add(recipe);
		return undefined;
	});
});


/** @type {Predicate.<PotionName>} */
let potionFilter;
if (wantPotions.length > 0 && wantPotions.every((name) => name.startsWith("!"))) {
	const notNames = wantPotions.map((name) => name.replace(/^!/, ""));
	const unknown = notNames.filter((name) => givens.potions.find((potion) => potion.name === name) == null);
	if (unknown.length > 0) {
		throw new Error(`Unknown --potion: ${unknown.join(", ")}`);
	}
	console.log(`Potions: exclude ${notNames.join(", ")}`);
	potionFilter = (/**PotionName*/potionName) => notNames.every((name) => name !== potionName);
} else if (wantPotions.length > 0) {
	const unknown = wantPotions.filter((name) => givens.potions.find((potion) => potion.name === name) == null);
	if (unknown.length > 0) {
		throw new Error(`Unknown --potion: ${unknown.join(", ")}`);
	}
	potionFilter = (/**PotionName*/potionName) => wantPotions.some((name) => name === potionName);
} else {
	potionFilter = () => true;
}

let writeCount = 0;
let readCount = 0;
let magiminMin = givens.MAGIMINS_MAX;
let magiminMax = 0;
if (isEmpty(recipesPaths)) {
	throw new Error("Required: --recipes");
}
const widenRecipe = recipeWidener();
const recipeComparator = sortRecipesTopMagimin();

recipesPaths.map((recipesPath) => {
	if (!existsSync(recipesPath, (s) => s.isFile())) {
		throw new Error(`Does not exist: ${recipesPath}`);
	}
	const outPath = recipesPath.replace(/(\.[^.]+)$/, "-wide$1");
	console.log(`Output: ${outPath}`);
	if (existsSync(outPath)) {
		throw new Error(`Already exists: ${outPath}`);
	}
	return [recipesPath, outPath];
}).forEach(([recipesPath, outPath]) => {
	/** @type {SpreadsheetStream.<WideRecipe>} */
	const out = spreadsheetStream(outPath, wideRecipeColumns(maxItems));
	loadSpreadsheet(recipesPath, (/**RecipeRow*/row) => {
		readCount++;
		/** @type {Recipe} */
		const recipe = recipeFromRow(row);
		if (recipe.ingredientCount < minItems) return undefined;
		if (recipe.ingredientCount > maxItems) return undefined;
		if (!potionFilter(recipe.potionName)) return undefined;
		if (recipe.magimins < minMagimins || recipe.magimins > maxMagimins) return undefined;
		if (excludedRecipes.has(recipe)) return undefined;
		return recipe;
	})
		.sort(recipeComparator)
		.forEach((/**Recipe*/recipe) => {
			const wide = widenRecipe(recipe);
			if (recipe.magimins > magiminMax) {
				magiminMax = recipe.magimins;
			} else if (recipe.magimins < magiminMin) {
				magiminMin = recipe.magimins;
			}
			out.write(wide);
			writeCount++;
		});
	out.close();
});

console.log(`Recipes: ${readCount.toLocaleString()} read; ${writeCount.toLocaleString()} written`);
console.log(`Magimins: ${magiminMin.toLocaleString()} to ${magiminMax.toLocaleString()}`);
