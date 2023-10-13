import {Chapter} from "./chapter.js";
import {IngredientName} from "./ingredient.js";
import {PotionName} from "./potion.js";
import {Stars, Tier} from "./quality.js";
import {NEUTRAL, Sensation} from "./sense.js";

/**
 * @typedef Recipe
 * @type {object}
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 * @property {number} ingredientCount
 * @property {IngredientName[]} ingredientNames
 * @property {number} magimins
 * @property {number} price
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {Sensation} smell
 * @property {Sensation} sight
 * @property {Sensation} sound
 * @property {Chapter} earliestChapter
 * @property {PotionName} [potionName]
 * @property {Tier} [tier]
 * @property {Stars} [stars]
 * @property {number} [stability]
 */

/**
 * @type {Recipe}
 */
export let Recipe;

/**
 * @type {Recipe}
 */
export const EMPTY_RECIPE = Object.freeze({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    earliestChapter: 1,
    ingredientCount: 0,
    ingredientNames: [],
    magimins: 0,
    price: 0,
    sight: NEUTRAL,
    smell: NEUTRAL,
    sound: NEUTRAL,
    taste: NEUTRAL,
    touch: NEUTRAL,
});

/**
 * @typedef WideRecipe
 * @type {object}
 * @property {string} Potion
 * @property {number} Tier
 * @property {number} Stars
 * @property {number} MM
 * @property {number} Cost
 * @property {Sensation} Taste
 * @property {Sensation} Touch
 * @property {Sensation} Smell
 * @property {Sensation} Sight
 * @property {Sensation} Sound
 * @property {number} Count
 * @property {IngredientName} I1
 * @property {number} C1
 * @property {IngredientName} I2
 * @property {number} C2
 * @property {IngredientName} I3
 * @property {number} C3
 * @property {IngredientName} I4
 * @property {number} C4
 * @property {IngredientName} I5
 * @property {number} C5
 * @property {IngredientName} I6
 * @property {number} C6
 * @property {IngredientName} I7
 * @property {number} C7
 * @property {IngredientName} I8
 * @property {number} C8
 * @property {IngredientName} I9
 * @property {number} C9
 * @property {IngredientName} I10
 * @property {number} C10
 * @property {IngredientName} I11
 * @property {number} C11
 * @property {IngredientName} I12
 * @property {number} C12
 * @property {IngredientName} I13
 * @property {number} C13
 * @property {IngredientName} I14
 * @property {number} C14
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 * @property {string} InStock
 */

/** @type {WideRecipe} */
export let WideRecipe;
