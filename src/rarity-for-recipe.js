import {givens} from "./givens.js";
import {RARITY_NAME_BY_NUM, RARITY_NUM_BY_NAME, RarityName} from "./type/rarity.js";
import {Recipe} from "./type/recipe.js";

/**
 *
 * @param {Recipe} recipe
 * @returns {{rarity: number, rarityName: RarityName}}
 */
export const rarityForRecipe = (recipe) => {
    const rarity = recipe.ingredientNames.map((name) => givens.ingredients.find((i) => i.name === name).rarity)
        .map((rarity) => RARITY_NUM_BY_NAME[rarity])
        .reduce((p, c) => Math.max(p, c));
    const rarityName = RARITY_NAME_BY_NUM[rarity];
    return {rarity, rarityName};
};
