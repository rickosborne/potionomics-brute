import {undefIfEmpty} from "./is-empty.js";
import {intFrom, maybeIntFrom} from "./spreadsheet-helpers.js";
import {Cauldron, CauldronsRow} from "./type/cauldron.js";

/**
 * @param {CauldronsRow} row
 * @returns {Cauldron}
 */
export const cauldronFromCauldronsRow = (row) => ({
    description: row.Description,
    ingredientCost: undefIfEmpty(row.IngredientCost),
    maxIngredients: intFrom(row.MaxIngredients),
    maxMagimins: intFrom(row.MaxMagimins),
    name: row.Name,
    price: maybeIntFrom(row.Price),
    unlockDay: intFrom(row.UnlockDay),
});
