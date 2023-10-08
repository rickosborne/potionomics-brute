import {simpleColumn} from "./spreadsheet-helpers.js";
import {Recipe} from "./type/recipe.js";
import {SpreadsheetValueSerializer} from "./type/spreadsheet.js";

/**
 * @type {{name: string, toString:SpreadsheetValueSerializer.<Recipe, keyof Recipe>}[]}
 */
export const RECIPE_DB_HEADERS = [
    {name: "key", toString: (key, _name, recipe) => key ?? recipe.ingredientNames.slice().sort().join("+")},
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
