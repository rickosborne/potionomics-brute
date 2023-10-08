import {undefIfEmpty} from "./is-empty.js";
import {optional} from "./optional.js";
import {Cauldron, CauldronsRow} from "./type/cauldron.js";

/**
 * @param {CauldronsRow} row
 * @returns {Cauldron}
 */
export const cauldronFromCauldronsRow = (row) => ({
	description: row.Description,
	ingredientCost: undefIfEmpty(row.IngredientCost),
	maxIngredients: parseInt(row.MaxIngredients, 10),
	maxMagimins: parseInt(row.MaxMagimins, 10),
	name: row.Name,
	price: optional(undefIfEmpty(row.Price)).map((p) => parseInt(p, 10)).orElse(undefined),
	unlockDay: parseInt(row.UnlockDay, 10),
});
