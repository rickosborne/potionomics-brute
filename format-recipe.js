import {givens} from "./src/givens.js";
import {groupIngredientNames} from "./src/group-ingredients.js";
import {priceModForRecipe} from "./src/price-mod-for-recipe.js";
import {rarityForRecipe} from "./src/rarity-for-recipe.js";
import {COLORS} from "./src/type/color.js";
import {Recipe} from "./src/type/recipe.js";

/**
 * @param {Recipe} recipe
 * @returns {string}
 */
export const formatRecipe = (recipe) => {
    const needs = Object.entries(groupIngredientNames(recipe.ingredientNames))
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => `${count}x${name}`)
        .join(" + ");
    const tier = givens.tierNames[recipe.tier];
    const priceMod = priceModForRecipe(recipe);
    const rarity = rarityForRecipe(recipe);
    const stats = COLORS.map((color) => recipe[color]).join(" ");
    return `${recipe.magimins}mm ${recipe.stars}⭐️ ${tier} ${priceMod.mods} ${recipe.potionName} for ${priceMod.price}, ${rarity.rarityName}: ${stats}\n\t${needs}`;
};
