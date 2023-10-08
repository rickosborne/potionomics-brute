import {simpleColumn} from "./spreadsheet-helpers.js";
import {Recipe} from "./type/recipe.js";
import {SpreadsheetValueSerializer} from "./type/spreadsheet.js";

/**
 * @type {{name: string, toString:SpreadsheetValueSerializer.<Recipe, keyof Recipe>}[]}
 */
export const RECIPE_DB_HEADERS = [
    {name: "ingredient01", toString: (_undef, _name, recipe) => recipe.ingredientNames[0] ?? ""},
    {name: "ingredient02", toString: (_undef, _name, recipe) => recipe.ingredientNames[1] ?? ""},
    {name: "ingredient03", toString: (_undef, _name, recipe) => recipe.ingredientNames[2] ?? ""},
    {name: "ingredient04", toString: (_undef, _name, recipe) => recipe.ingredientNames[3] ?? ""},
    {name: "ingredient05", toString: (_undef, _name, recipe) => recipe.ingredientNames[4] ?? ""},
    {name: "ingredient06", toString: (_undef, _name, recipe) => recipe.ingredientNames[5] ?? ""},
    {name: "ingredient07", toString: (_undef, _name, recipe) => recipe.ingredientNames[6] ?? ""},
    {name: "ingredient08", toString: (_undef, _name, recipe) => recipe.ingredientNames[7] ?? ""},
    {name: "ingredient09", toString: (_undef, _name, recipe) => recipe.ingredientNames[8] ?? ""},
    {name: "ingredient10", toString: (_undef, _name, recipe) => recipe.ingredientNames[9] ?? ""},
    {name: "ingredient11", toString: (_undef, _name, recipe) => recipe.ingredientNames[10] ?? ""},
    {name: "ingredient12", toString: (_undef, _name, recipe) => recipe.ingredientNames[11] ?? ""},
    {name: "ingredient13", toString: (_undef, _name, recipe) => recipe.ingredientNames[12] ?? ""},
    {name: "ingredient14", toString: (_undef, _name, recipe) => recipe.ingredientNames[13] ?? ""},
    simpleColumn("A"),
    simpleColumn("B"),
    simpleColumn("C"),
    simpleColumn("D"),
    simpleColumn("E"),
    simpleColumn("ingredientCount"),
    simpleColumn("magimins"),
    simpleColumn("price"),
    simpleColumn("taste"),
    simpleColumn("touch"),
    simpleColumn("smell"),
    simpleColumn("sight"),
    simpleColumn("sound"),
    simpleColumn("earliestChapter"),
    simpleColumn("potionName"),
    simpleColumn("tier"),
    simpleColumn("stars"),
    {name: "stability", toString: (s) => Math.round(s * 1000).toString()},
];
