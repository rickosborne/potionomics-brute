import {Ingredient, IngredientsRow} from "./type/ingredient.js";

/**
 * @param {IngredientsRow} row
 * @returns {Ingredient}
 */
export const ingredientFromIngredientsRow = (row) => {
    const A = parseInt(row.A, 10);
    const B = parseInt(row.B, 10);
    const C = parseInt(row.C, 10);
    const D = parseInt(row.D, 10);
    const E = parseInt(row.E, 10);
    return {
        A, B, C, D, E,
        earliestChapter: parseInt(row.earliestChapter, 10),
        location: row.location,
        magimins: A + B + C + D + E,
        name: row.name,
        price: parseInt(row.price, 10),
        rarity: row.rarity,
        sight: row.sight,
        smell: row.smell,
        sound: row.sound,
        taste: row.taste,
        touch: row.touch,
        type: row.type,
    };
};
