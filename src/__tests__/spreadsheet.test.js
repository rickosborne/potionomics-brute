const {expect} = require("chai");
const {addIngredient} = require("../add-ingredient.js");
const {givens} = require("../givens.js");
const {ingredientFromIngredientsRow} = require("../ingredient-from-ingredients-row.js");
const {INGREDIENTS_TSV_COLUMNS} = require("../ingredients-tsv.js");
const {spreadsheetDeserializer} = require("../load-csv.js");
const {randInt} = require("../rand-int.js");
const {randomItem} = require("../random-item.js");
const {RECIPE_DB_HEADERS} = require("../recipe-db-headers.js");
const {recipeFromRow} = require("../recipe-from-row.js");
const {spreadsheetSerializer} = require("../spreadsheet-stream.js");
const {Ingredient} = require("../type/ingredient.js");
const {RARITY_NAME_BY_NUM} = require("../type/rarity.js");
const {EMPTY_RECIPE} = require("../type/recipe.js");
const {SENSATIONS} = require("../type/sense.js");

describe("spreadsheet", () => {
	it("translates recipes back and forth", () => {
		const allIngredients = givens.ingredients;
		let recipe = EMPTY_RECIPE;
		[1, 2, 3]
			.map(() => randomItem(allIngredients))
			.forEach((ingredient) => {
				recipe = addIngredient(recipe, ingredient);
			});
		recipe.potionName = "test";
		recipe.stability = randInt(0, 1000);
		recipe.stars = randInt(0, 5);
		recipe.tier = randInt(0, 5);
		const recipeSerializer = spreadsheetSerializer(RECIPE_DB_HEADERS);
		const row = recipeSerializer(recipe);
		const headerNames = RECIPE_DB_HEADERS.map((h) => h.name);
		const recipeDeserializer = spreadsheetDeserializer(headerNames, "\t", recipeFromRow);
		const deserialized = recipeDeserializer(row.trim());
		const explanation = row.trim().split("\t").map((v, index) => `${RECIPE_DB_HEADERS[index].name}=${JSON.stringify(v)}`).join("\n");
		expect(deserialized, explanation).deep.equals(recipe);
	});

	it("translates ingredients back and forth", () => {
		const A = randInt(0, 100);
		const B = randInt(0, 100);
		const C = randInt(0, 100);
		const D = randInt(0, 100);
		const E = randInt(0, 100);
		/** @type {Ingredient} */
		const ingredient = {
			A, B, C, D, E,
			earliestChapter: randInt(1, 5),
			location: randomItem(givens.locations).name,
			magimins: A + B + C + D + E,
			name: "Test",
			price: randInt(25, 255),
			rarity: RARITY_NAME_BY_NUM[randInt(1, 4)],
			sight: randomItem(SENSATIONS),
			smell: randomItem(SENSATIONS),
			sound: randomItem(SENSATIONS),
			taste: randomItem(SENSATIONS),
			touch: randomItem(SENSATIONS),
			type: randomItem(givens.ingredients).type,
		};
		const ingredientSerializer = spreadsheetSerializer(INGREDIENTS_TSV_COLUMNS);
		const row = ingredientSerializer(ingredient);
		const headerNames = INGREDIENTS_TSV_COLUMNS.map((c) => c.name);
		const recipeDeserializer = spreadsheetDeserializer(headerNames, "\t", ingredientFromIngredientsRow);
		const explanation = row.trim().split("\t").map((v, index) => `${RECIPE_DB_HEADERS[index].name}=${JSON.stringify(v)}`).join("\n");
		const deserialized = recipeDeserializer(row.trim());
		expect(deserialized, explanation).deep.equals(ingredient);
	});
});
