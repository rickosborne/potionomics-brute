import console from "node:console";
import {addIngredient} from "./add-ingredient.js";
import {givens} from "./givens.js";
import {incrementOffsets} from "./increment-offsets.js";
import {assertIsArray} from "./is-array.js";
import {Ledger} from "./ledger.js";
import {qualityFromMagimins} from "./quality-from-magimins.js";
import {stabilityOfRecipe} from "./stability-of-recipe.js";
import {CAULDRON_SIZE_MAX} from "./type/cauldron.js";
import {Ingredient} from "./type/ingredient.js";
import {Potion} from "./type/potion.js";
import {EMPTY_RECIPE, Recipe} from "./type/recipe.js";

/**
 * @class
 */
export class TryEverything {
	/**
	 * @param {{[key: string]: *}} config
	 * @param {Ingredient[]} config.ingredients
	 * @param {Potion[]} config.potions
	 * @param {Ledger} config.ledger
	 * @param {number|undefined} [config.minItems]
	 * @param {number|undefined} [config.maxItems]
	 * @param {number|undefined} [config.minMagimins]
	 * @param {number|undefined} [config.maxMagimins]
	 */
	constructor({ingredients, ledger, minItems, maxItems, potions, minMagimins, maxMagimins}) {
		assertIsArray(ingredients, "ingredients");
		assertIsArray(potions, "potions");
		this.ingredients = ingredients;
		this.potions = potions;
		/** @type {number[]} */
		this.offsets = minItems == null ? [] : "*".repeat(minItems - 1).split("").map(() => ingredients.length - 1);
		/** @type {Ledger} */
		this.ledger = ledger;
		/** @type {{potion: Potion, stabilityFn: (function(Recipe): number)}[]} */
		this.potionTests = potions.map((potion) => ({
			/** @type {Potion} */
			potion,
			/** @type {function(Recipe):number} */
			stabilityFn: stabilityOfRecipe(potion),
		}));
		this.maxItems = maxItems ?? CAULDRON_SIZE_MAX;
		this.minMagimins = minMagimins ?? 1;
		this.maxMagimins = maxMagimins ?? givens.MAGIMINS_MAX;
	}

	go() {
		const offsets = incrementOffsets(this.offsets, this.ingredients.length - 1);
		if (offsets.length > this.maxItems) {
			console.log("Ran out of cauldron space");
			return false;
		}
		if (this.offsets.length < offsets.length) {
			console.log(`TryEverything now on ${offsets.length} ingredients`);
		}
		let recipe = EMPTY_RECIPE;
		offsets
			.map((index) => this.ingredients[index])
			.forEach((ingredient) => {
				recipe = addIngredient(recipe, ingredient);
			});
		if (recipe.magimins < this.minMagimins || recipe.magimins > this.maxMagimins) {
			return true;
		}
		let highestStability = 0;
		/** @type {Potion} */
		let closestPotion;
		this.potionTests.forEach(({potion, stabilityFn}) => {
			const stability = stabilityFn(recipe);
			if (stability > highestStability) {
				highestStability = stability;
				closestPotion = potion;
			}
		});
		const quality = qualityFromMagimins(recipe.magimins);
		this.ledger.recordRecipe({potion: closestPotion, quality, recipe, stability: highestStability});
		this.offsets = offsets;
		return true;
	}

	stop() {
		this.ledger.close();
	}
}
