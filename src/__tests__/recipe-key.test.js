const {expect} = require("chai");
const {recipeKey} = require("../recipe-key");
const {EMPTY_RECIPE, Recipe} = require("../type/recipe");
const {givens} = require("../givens");
const {range} = require("../range");

describe("recipeKey", () => {
	it("returns empty string for empty recipe", () => {
		expect(recipeKey(EMPTY_RECIPE)).eq("");
	});

	it("accepts ingredient names", () => {
		expect(recipeKey([
			"Fire Flower",
			"Mud Shrimp",
			"Fire Flower",
		])).eq("ff2mj1");
	});

	it("accepts a recipe without an existing key", () => {
		// noinspection JSValidateTypes
		/** @type {Recipe} */
		const recipe = {
			ingredientNames: [
				"Nether Ore",
				"Phoenix Tear",
			],
		};
		expect(recipeKey(recipe)).eq("no1ph1");
	});

	it("accepts a recipe with an existing key", () => {
		// noinspection JSValidateTypes
		/** @type {Recipe} */
		const recipe = {
			ingredientNames: [],
			key: "existing",
		};
		expect(recipeKey(recipe)).eq("existing");
	});

	it("accepts full ingredients", () => {
		expect(recipeKey([
			givens.ingredientsByName["Yeti Antler"],
			givens.ingredientsByName["Witchbramble Vine"],
			givens.ingredientsByName["Eye of Newt"],
			givens.ingredientsByName["Yeti Antler"],
		])).eq("en1wv1ya2");
	});

	it("counts using single characters", () => {
		expect(recipeKey(range(1, 9).map(() => "Ectoplasm"))).eq("ep9");
		expect(recipeKey(range(1, 10).map(() => "Ectoplasm"))).eq("ep0");
		expect(recipeKey(range(1, 11).map(() => "Ectoplasm"))).eq("ep!");
		expect(recipeKey(range(1, 12).map(() => "Ectoplasm"))).eq("ep@");
		expect(recipeKey(range(1, 13).map(() => "Ectoplasm"))).eq("ep#");
		expect(recipeKey(range(1, 14).map(() => "Ectoplasm"))).eq("ep$");
	});
});
