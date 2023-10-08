import {intFrom} from "./spreadsheet-helpers.js";
import {Ingredient, IngredientsRow} from "./type/ingredient.js";

/**
 * @param {IngredientsRow} row
 * @returns {Ingredient}
 */
export const ingredientFromIngredientsRow = (row) => {
    const A = intFrom(row.A);
    const B = intFrom(row.B);
    const C = intFrom(row.C);
    const D = intFrom(row.D);
    const E = intFrom(row.E);
    return {
        A, B, C, D, E,
        earliestChapter: intFrom(row.earliestChapter),
        location: row.location,
        magimins: A + B + C + D + E,
        name: row.name,
        price: intFrom(row.price),
        rarity: row.rarity,
        sight: row.sight,
        smell: row.smell,
        sound: row.sound,
        taste: row.taste,
        touch: row.touch,
        type: row.type,
    };
};
