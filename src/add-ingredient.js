import {combineSensations} from "./combine-sensations.js";
import {maybeAdd} from "./maybe-add.js";
import {scoreSensations} from "./score-sensations.js";
import {Ingredient} from "./type/ingredient.js";
import {Recipe} from "./type/recipe.js";

/**
 * @function
 * @param {Recipe} recipe
 * @param {Ingredient} ingredient
 * @returns {Recipe}
 */
export const addIngredient = (recipe, ingredient) => {
    const taste = combineSensations(recipe.taste, ingredient.taste);
    const touch = combineSensations(recipe.touch, ingredient.touch);
    const sight = combineSensations(recipe.sight, ingredient.sight);
    const smell = combineSensations(recipe.smell, ingredient.smell);
    const sound = combineSensations(recipe.sound, ingredient.sound);
    return {
        A: recipe.A + ingredient.A,
        anyBad: recipe.anyBad || ingredient.anyBad,
        B: recipe.B + ingredient.B,
        C: recipe.C + ingredient.C,
        D: recipe.D + ingredient.D,
        E: recipe.E + ingredient.E,
        ingredientCount: recipe.ingredientCount + 1,
        ingredientNames: recipe.ingredientNames.concat(ingredient.name),
        magimins: recipe.magimins + ingredient.magimins,
        price: maybeAdd(recipe.price, ingredient.price),
        priceMod: scoreSensations(taste, touch, sight, smell, sound),
        sight,
        smell,
        sound,
        taste,
        touch,
    };
};
