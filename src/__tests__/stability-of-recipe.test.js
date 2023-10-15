const {expect} = require("chai");
const {stabilityOfRecipe} = require("../stability-of-recipe.js");
const {Potion} = require("../type/potion.js");
const {EMPTY_RECIPE} = require("../type/recipe.js");

describe(stabilityOfRecipe.name, () => {
	const /** @type {function():Potion} */ getPotion = () => ({
		A: 1,
		B: 2,
		C: 0,
		category: "Test",
		D: 1,
		E: 0,
		name: "Test",
	});
	it("yields 0 for empty recipe", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability(EMPTY_RECIPE)).eq(0);
	});
	it("yields 1 for a perfect match recipe", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability({A: 1, B: 2, C: 0, D: 1, E: 0, ingredientNames: [], magimins: 4})).eq(1);
	});
	it("yields 0 for a missing magimin", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability({A: 0, B: 2, C: 0, D: 1, E: 0, ingredientNames: [], magimins: 4})).to.be.below(0.9);
	});
	it("yields 1 for a perfect recipe", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability({A: 10, B: 20, C: 0, D: 10, E: 0, ingredientNames: [], magimins: 40})).eq(1);
	});
	it("yields something close to 1 for a very stable recipe", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability({A: 10, B: 22, C: 0, D: 10, E: 0, ingredientNames: [], magimins: 40})).to.be.above(0.9);
	});
	it("yields something close to 1 for a very stable recipe with a few extras", () => {
		const potion = getPotion();
		const stability = stabilityOfRecipe(potion);
		expect(stability({A: 10, B: 20, C: 2, D: 10, E: 1, ingredientNames: [], magimins: 40})).to.be.above(0.9);
	});
});
