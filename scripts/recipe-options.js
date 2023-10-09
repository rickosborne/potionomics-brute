import console from "node:console";
import {parseArgs} from "node:util";
import {formatRecipe} from "../format-recipe.js";
import {comparatorBuilder, ComparatorBuilder} from "../src/comparator.js";
import {filterRecipesByInventory} from "../src/filter-recipes-by-inventory.js";
import {givens} from "../src/givens.js";
import {isEmpty} from "../src/is-empty.js";
import {loadInventory} from "../src/load-inventory.js";
import {priceModForRecipe} from "../src/price-mod-for-recipe.js";
import {rarityForRecipe} from "../src/rarity-for-recipe.js";
import {maybeIntFrom} from "../src/spreadsheet-helpers.js";
import {CAULDRON_SIZE_MAX} from "../src/type/cauldron.js";
import {Recipe} from "../src/type/recipe.js";
import {zeroPad} from "../src/zero-pad.js";

const {
    values: {
        inventory: inventoryPath,
        maxItems: maxItemsText,
        maxMagimins: maxMagiminsText,
        recipes: recipesPaths,
        count: wantCount,
    },
} = parseArgs({
    options: {
        count: {default: "", short: "n", type: "string"},
        inventory: {type: "string"},
        maxItems: {default: "", type: "string"},
        maxMagimins: {default: "", type: "string"},
        recipes: {multiple: true, type: "string"},
        skipRecipes: {multiple: true, type: "string"},
    },
    strict: true,
});

if (isEmpty(inventoryPath)) {
    throw new Error("Required: --inventory");
}
if (isEmpty(recipesPaths)) {
    throw new Error("Required: --recipes");
}
const count = maybeIntFrom(wantCount) ?? 25;
const maxItems = maybeIntFrom(maxItemsText) ?? CAULDRON_SIZE_MAX;
const maxMagimins = maybeIntFrom(maxMagiminsText) ?? givens.MAGIMINS_MAX;
const inventory = loadInventory(inventoryPath);
console.log({count, inventoryCount: Object.keys(inventory).length, maxItems, maxMagimins});
/** @type {Recipe[]} */
let recipes = [];
/** @type {Recipe[]|undefined} */
let topRecipes = undefined;
/** @type {{[key: string]: number} | undefined} */
let topIngredients = undefined;
for (let recipesPath of recipesPaths) {
    console.log(`Scanning ${recipesPath} for matching recipes ...`);
    const filtered = filterRecipesByInventory(recipesPath, inventory, maxItems, maxMagimins);
    recipes = filtered.recipes;
    topRecipes ??= filtered.topRecipes;
    topIngredients ??= filtered.topIngredients;
    if (recipes.length > 0) {
        break;
    }
}
/** @type {ComparatorBuilder.<Recipe>} */
const builder = comparatorBuilder();
const comparator = builder
    .numbers((recipe) => recipe.magimins).reversed()
    .numbers((recipe) => rarityForRecipe(recipe).rarity)
    .numbers((recipe) => priceModForRecipe(recipe).mod).reversed()
    .numbers((recipe) => recipe.ingredientNames.length).reversed()
    .numbers((recipe) => recipe.price)
    .build();

if (recipes.length === 0) {
    if (topRecipes == null || topIngredients == null) {
        throw new Error(`No recipes found, nor any suggestions available.  Brute more recipes.`);
    }
    console.log("⚠️ No recipes found which match your inventory. ⚠️\nShopping list:");
    const shopping = Object.entries(topIngredients)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count);
    const maxCountLen = shopping.map((e) => e[1]).reduce((p, c) => Math.max(p, c)).toLocaleString().length;
    shopping.forEach(([name, count]) => {
        const countText = count.toLocaleString();
        const left = " ".repeat(maxCountLen - countText.length);
        const ingredient = givens.ingredients.find((ingredient) => ingredient.name === name);
        console.log(["  ", left, countText, " ", name, " (", ingredient.rarity, ")"].join(""));
    });
    console.log("\nTop recipes:");
    topRecipes.sort(comparator).slice(0, count * 2).forEach((recipe) => {
        recipes.push(recipe);
    });
}

const zeroes = Math.ceil(Math.log10(count + 1));

recipes.sort(comparator).slice(0, count).forEach((recipe, index) => {
    console.log(`${zeroPad(index + 1, zeroes)}. ${formatRecipe(recipe)}`);
});
