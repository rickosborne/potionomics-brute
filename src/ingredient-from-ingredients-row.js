import {undefIfEmpty} from "./is-empty.js";
import {optional} from "./optional.js";
import {Ingredient, IngredientsRow} from "./type/ingredient.js";
import {BAD, GOOD, NEUTRAL} from "./type/sense.js";

const sensationsByListValue = {
    Bad: BAD,
    Good: GOOD,
};

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
        A,
        anyBad: [row.Taste, row.Touch, row.Smell, row.Sight, row.Sound].includes("Bad"),
        B, C, D, E,
        location: undefIfEmpty(row.Location),
        magimins: A + B + C + D + E,
        name: undefIfEmpty(row.Name),
        price: optional(undefIfEmpty(row.Price)).map((p) => parseInt(p, 10)).orElse(undefined),
        priceMod: optional(undefIfEmpty(row.PriceMod)).map((p) => parseInt(p, 10)).orElse(undefined),
        rarity: undefIfEmpty(row.Rarity),
        sight: sensationsByListValue[row.Sight] ?? NEUTRAL,
        smell: sensationsByListValue[row.Smell] ?? NEUTRAL,
        sound: sensationsByListValue[row.Sound] ?? NEUTRAL,
        taste: sensationsByListValue[row.Taste] ?? NEUTRAL,
        touch: sensationsByListValue[row.Touch] ?? NEUTRAL,
        type: undefIfEmpty(row.Type),
    };
};
