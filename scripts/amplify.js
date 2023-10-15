const console = require("node:console");
const process = require("node:process");
const {parseArgs} = require("node:util");
const {filterPipeline, Predicate} = require("../src/filter-pipeline.js");
const {givens} = require("../src/givens.js");
const {idGenerator} = require("../src/id-generator.js");
const {checkRecipeFromInventory} = require("../src/inventory-can-make.js");
const {undefIfEmpty} = require("../src/is-empty.js");
const {loadSpreadsheet} = require("../src/load-csv.js");
const {loadInventory} = require("../src/load-inventory.js");
const {optional} = require("../src/optional.js");
const {RECIPE_DB_HEADERS} = require("../src/recipe-db-headers.js");
const {recipeFromRow} = require("../src/recipe-from-row.js");
const {maybeIntFrom} = require("../src/spreadsheet-helpers.js");
const {spreadsheetStream, SpreadsheetStream} = require("../src/spreadsheet-stream.js");
const {CAULDRON_SIZE_MAX} = require("../src/type/cauldron.js");
const {IngredientName} = require("../src/type/ingredient.js");
const {Inventory} = require("../src/type/inventory.js");
const {Recipe} = require("../src/type/recipe.js");

const {
	values: {
		ignoreStock,
		inventory: inventoryPath,
		maxItems: maxItemsText,
		maxMagimins: maxMagiminsText,
		recipesIn: recipesPaths,
		outPrefix: wantPrefix,
	},
} = parseArgs({
	options: {
		ignoreStock: {type: "boolean"},
		inventory: {type: "string"},
		maxItems: {default: "", type: "string"},
		maxMagimins: {default: "", type: "string"},
		outPrefix: {default: "", type: "string"},
		recipes: {multiple: true, type: "string"},
	},
	strict: true,
});

const outPrefix = undefIfEmpty(wantPrefix);
if (outPrefix == null) {
	throw new Error("--recipesOut is required");
}
const maxItems = maybeIntFrom(maxItemsText) ?? CAULDRON_SIZE_MAX;
/** @type {Inventory|undefined} */
const inventory = optional(undefIfEmpty(inventoryPath))
	.map((inventoryPath) => loadInventory(inventoryPath))
	.orElse(undefined);
const maxMagimins = maybeIntFrom(maxMagiminsText) ?? givens.MAGIMINS_MAX;

let recipesWritten = 0;
let recipesRead = 0;

const shutdown = () => {
	if (outs.length > 0) {
		outs.forEach((out) => out.close());
		outs.splice(0, outs.length);
		console.log(`Recipes: ${recipesRead.toLocaleString()} in → ${recipesWritten.toLocaleString()} out`);
	}
};

process.on("SIGINT", shutdown);
process.on("exit", shutdown);

/** @type {Map.<string, string>} */
const ingredientIds = new Map();
/** @type {function(IngredientName):string} */
const idForIngredient = (() => {
	const nextId = idGenerator(givens.ingredients.length);
	return (name) => {
		let id = ingredientIds.get(name);
		if (id == null) {
			id = nextId();
			ingredientIds[name] = id;
		}
		return id;
	};
})();
/** @type {function(IngredientName[]):string} */
const keyForIngredients = (names) => {
	return names.map((name) => idForIngredient(name))
		.join("");
};

/** @type {Map.<string, Recipe>[]} */
const logs = [];
/** @type {function(IngredientName[]):Map.<string, Recipe>} */
const logsForIngredients = (names) => {
	const ingredientCount = names.length;
	let map = logs[ingredientCount];
	if (map == null) {
		map = new Map();
		logs[ingredientCount] = map;
	}
	return map;
};

/** @type {SpreadsheetStream.<Recipe>[]} */
const outs = [];
/** @type {function(IngredientName[]):(function(Recipe):void)} */
const outStreamForIngredients = (/**IngredientName[]*/names) => {
	const ingredientCount = names.length;
	let out = outs[ingredientCount];
	if (out == null) {
		const path = `db/${outPrefix}${ingredientCount}i-recipes.tsv`;
		console.log(`Opening for write: ${path}`);
		out = spreadsheetStream(path, RECIPE_DB_HEADERS);
		outs[ingredientCount] = out;
	}
	return ((stream) => {
		return (/**Recipe*/recipe) => {
			const key = keyForIngredients(recipe.ingredientNames);
			const logs = logsForIngredients(recipe.ingredientNames);
			if (!logs.has(key)) {
				logs.set(key, recipe);
				stream.write(recipe);
			}
		};
	})(out);
};

/** @type {Predicate.<Recipe>} */
const recipeFilter = filterPipeline()
	.stepIf(inventory != null, "inventory", checkRecipeFromInventory(inventory, ignoreStock))
	.stepIf(maxItems !== CAULDRON_SIZE_MAX, `maxItems(${maxItems})`, (/**Recipe*/recipe) => recipe.ingredientCount <= maxItems)
	.stepIf(maxMagimins !== givens.MAGIMINS_MAX, `maxMagimins(${maxMagimins})`, (/**Recipe*/recipe) => recipe.magimins <= maxMagimins)
	.predicate;
for (const recipesPath of recipesPaths) {
	console.log(`Reading recipes: ${recipesPath}`);
	loadSpreadsheet(recipesPath, (/**RecipeRow*/row) => {
		const recipe = recipeFromRow(row);
		recipesRead++;
		if (!recipeFilter(recipe)) return undefined;
		const write = outStreamForIngredients(recipe.ingredientNames);
		write(recipe);
		recipesWritten++;
		return undefined;
	});
}

// TODO: generator for all combinations which add up to maxItems
