import {Comparator, comparatorBuilder, ComparatorBuilder} from "../src/comparator.js";
import {givens} from "../src/givens.js";
import {INGREDIENTS_TSV_COLUMNS} from "../src/ingredients-tsv.js";
import {spreadsheetStream} from "../src/spreadsheet-stream.js";
import {Ingredient} from "../src/type/ingredient.js";

const locations = givens.locations;
const locationOrder = Object.fromEntries(locations.map((l, order) => [l.name, order]));
/** @type {ComparatorBuilder.<Ingredient>} */
const builder = comparatorBuilder();
/** @type {Comparator.<Ingredient>} */
const comparator = builder
    .numbers((i) => locationOrder[i.location])
    .numbers((i) => i.magimins)
    .strings((i) => i.name)
    .build();
const ingredients = givens.ingredients.slice().sort(comparator);
const sorted = spreadsheetStream(`data/ingredients.tsv`, INGREDIENTS_TSV_COLUMNS);
ingredients.forEach((ingredient) => {
    sorted.write(ingredient);
});
