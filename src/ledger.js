import console from "node:console";
import {mkdirSync} from "node:fs";
import {existsSync} from "./exists-sync.js";
import {RECIPE_DB_HEADERS} from "./recipe-db-headers.js";
import {spreadsheetStream} from "./spreadsheet-stream.js";
import {Potion} from "./type/potion.js";
import {Quality} from "./type/quality.js";
import {Recipe} from "./type/recipe.js";

// /**
//  * @param {Recipe} recipe
//  * @returns {string}
//  */
// const recipeDescription = (recipe) => `${recipe.stability === 1 ? "Perfect" : recipe.stability >= 0.9 ? "Stable" : `Unstable ${Math.floor(recipe.stability * 100)}`} recipe: ${TIER_NAMES[recipe.tier]} ${recipe.stars}⭐️ ${recipe.potionName} from ${recipe.ingredientCount} ingredients costing ${recipe.price}`;

/**
 * @typedef LedgerKey
 * @type {string}
 */

export class Ledger {
	/**
	 * @param {{[key: string]:*}} config
	 * @param {string|undefined} [config.prefix]
	 * @param {number|undefined} [config.stableCutoff]
	 * @param {(function(Recipe):void)|undefined} [config.onRecipe]
	 */
	constructor({prefix: prefixMaybe, stableCutoff, onRecipe}) {
		const prefix = prefixMaybe ?? "";
		// const allFilePath = `db/${prefix}recipes-all.tsv`;
		// this.allOut = spreadsheetStream(allFilePath, RECIPE_DB_HEADERS);
		if (!existsSync("db")) {
			mkdirSync("db");
		}
		this.perfectFileName = `db/${prefix}recipes-perfect.tsv`;
		this.perfectOut = spreadsheetStream(this.perfectFileName, RECIPE_DB_HEADERS);
		this.stableOut = stableCutoff < 1 ? spreadsheetStream(`db/${prefix}recipes-stable.tsv`, RECIPE_DB_HEADERS) : undefined;
		this.stableCutoff = stableCutoff ?? 0.95;
		this.perfectCount = 0;
		this.stableCount = 0;
		this.totalCount = 0;
		this.onRecipe = onRecipe ?? (() => {
		});
	}

	close() {
		console.log("Ledger closing.");
		// if (this.allOut != null) {
		//     this.allOut.close();
		//     this.allOut = undefined;
		// }
		if (this.perfectOut != null) {
			this.perfectOut.close();
			this.perfectOut = undefined;
		}
		if (this.stableOut != null) {
			this.stableOut.close();
			this.stableOut = undefined;
		}
	}

	/**
	 * @param {object} mixture
	 * @param {Potion} mixture.potion
	 * @param {Quality} mixture.quality
	 * @param {Recipe} mixture.recipe
	 * @param {number} mixture.stability
	 * @returns {void}
	 */
	recordRecipe({recipe, potion, quality, stability}) {
		const combinedRecipe = {
			...recipe,
			potionName: potion?.name,
			stability,
			stars: quality.stars,
			tier: quality.tier,
		};
		/** @type {Recipe} */
		if (combinedRecipe.ingredientCount > 1) {
			if (stability === 1) {
				// console.log(recipeDescription(combinedRecipe));
				this.perfectCount++;
				this.perfectOut.write(combinedRecipe);
			} else if (stability >= this.stableCutoff) {
				// console.log(recipeDescription(combinedRecipe));
				this.stableOut.write(combinedRecipe);
				this.stableCount++;
			}
		}
		this.totalCount++;
		this.onRecipe(combinedRecipe);
		// this.allOut.write(combinedRecipe);
	}
}
