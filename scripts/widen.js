import console from "node:console";
import {parseArgs} from "node:util";
import {existsSync} from "../src/exists-sync.js";
import {Predicate} from "../src/filter-pipeline.js";
import {givens} from "../src/givens.js";
import {isEmpty} from "../src/is-empty.js";
import {loadSpreadsheet} from "../src/load-csv.js";
import {recipeFromRow} from "../src/recipe-from-row.js";
import {maybeIntFrom, simpleColumn} from "../src/spreadsheet-helpers.js";
import {spreadsheetStream, SpreadsheetStream} from "../src/spreadsheet-stream.js";
import {CAULDRON_SIZE_MAX} from "../src/type/cauldron.js";
import {IngredientName} from "../src/type/ingredient.js";
import {PotionName} from "../src/type/potion.js";
import {Sensation} from "../src/type/sense.js";

const {
    values: {
        maxItems: wantItemsMax,
        minItems: wantItemsMin,
        maxMagimins: wantMagiminsMax,
        minMagimins: wantMagiminsMin,
        potion: wantPotions,
        recipes: recipesPaths,
    },
} = parseArgs({
    options: {
        maxItems: {type: "string"},
        maxMagimins: {type: "string"},
        minItems: {type: "string"},
        minMagimins: {type: "string"},
        potion: {default: [], multiple: true, type: "string"},
        recipes: {multiple: true, type: "string"},
    },
    strict: true,
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
 * @property {string} OOS
 */

/** @type {WideRecipe} */
export let WideRecipe;

const minItems = maybeIntFrom(wantItemsMin) ?? 2;
const maxItems = maybeIntFrom(wantItemsMax) ?? CAULDRON_SIZE_MAX;
const minMagimins = maybeIntFrom(wantMagiminsMin) ?? 1;
const maxMagimins = maybeIntFrom(wantMagiminsMax) ?? givens.MAGIMINS_MAX;
/** @type {number[]} */
const indexes = "*".repeat(maxItems).split("").map((_v, index) => index + 1);
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const colNames = [...letters, ...letters.map((l) => `A${l}`), ...letters.map((l) => `B${l}`)];
const I1Index = 11;
// Left + (2 * Count) + ABCDE + OOS
const S1Index = I1Index + (2 * maxItems) + 6;
const SNIndex = S1Index + maxItems - 1;

/** @type {({name: string, toString:(function(*,string,WideRecipe):string)})[]} */
const WIDE_COLUMNS = [
    simpleColumn("Potion"),
    simpleColumn("Tier"),
    simpleColumn("Stars"),
    simpleColumn("MM"),
    simpleColumn("Cost"),
    simpleColumn("Taste"),
    simpleColumn("Touch"),
    simpleColumn("Smell"),
    simpleColumn("Sight"),
    simpleColumn("Sound"),
    simpleColumn("Count"),
    ...(indexes.flatMap((index) => [
        simpleColumn(`I${index}`),
        {name: `#${index}`, toString: (_v, _n, r) => r[`C${index}`]},
    ])),
    simpleColumn("A"),
    simpleColumn("B"),
    simpleColumn("C"),
    simpleColumn("D"),
    simpleColumn("E"),
    {name: "Out of Stock", toString: (_v, _n, r) => r.OOS},
    ...(indexes.map((index) => ({name: `Stock ${index}`, toString: (_v, _n, r) => r[`S${index}`]}))),
];
/** @type {Predicate.<PotionName>} */
let potionFilter;
if (wantPotions.length > 0 && wantPotions.every((name) => name.startsWith("!"))) {
    const notNames = wantPotions.map((name) => name.replace(/^!/, ""));
    const unknown = notNames.filter((name) => givens.potions.find((potion) => potion.name === name) == null);
    if (unknown.length > 0) {
        throw new Error(`Unknown --potion: ${unknown.join(", ")}`);
    }
    console.log(`Potions: exclude ${notNames.join(", ")}`);
    potionFilter = (/**PotionName*/potionName) => notNames.every((name) => name !== potionName);
} else if (wantPotions.length > 0) {
    const unknown = wantPotions.filter((name) => givens.potions.find((potion) => potion.name === name) == null);
    if (unknown.length > 0) {
        throw new Error(`Unknown --potion: ${unknown.join(", ")}`);
    }
    potionFilter = (/**PotionName*/potionName) => wantPotions.some((name) => name === potionName);
} else {
    potionFilter = () => true;
}

let writeCount = 0;
let readCount = 0;
let magiminMin = givens.MAGIMINS_MAX;
let magiminMax = 0;
if (isEmpty(recipesPaths)) {
    throw new Error("Required: --recipes");
}
recipesPaths.map((recipesPath) => {
    if (!existsSync(recipesPath, (s) => s.isFile())) {
        throw new Error(`Does not exist: ${recipesPath}`);
    }
    const outPath = recipesPath.replace(/(\.[^.]+)$/, "-wide$1");
    console.log(`Output: ${outPath}`);
    if (existsSync(outPath)) {
        throw new Error(`Already exists: ${outPath}`);
    }
    return [recipesPath, outPath];
}).forEach(([recipesPath, outPath]) => {
    /** @type {SpreadsheetStream.<WideRecipe>} */
    const out = spreadsheetStream(outPath, WIDE_COLUMNS);
    let rowNum = 1;
    loadSpreadsheet(recipesPath, (/**RecipeRow*/row) => {
        readCount++;
        const recipe = recipeFromRow(row);
        if (recipe.ingredientCount < minItems) return undefined;
        if (recipe.ingredientCount > maxItems) return undefined;
        if (!potionFilter(recipe.potionName)) return undefined;
        if (recipe.magimins < minMagimins || recipe.magimins > maxMagimins) return undefined;
        rowNum++;
        const ref = (index) => `$${colNames[index]}${rowNum}`;
        /** @type {WideRecipe} */
        const wide = {
            A: recipe.A,
            B: recipe.B,
            C: recipe.C,
            Cost: recipe.price,
            Count: recipe.ingredientCount,
            D: recipe.D,
            E: recipe.E,
            MM: recipe.magimins,
            OOS: `=COUNTIF(${ref(S1Index)}:${ref(SNIndex)},FALSE)`,
            Potion: recipe.potionName,
            Sight: recipe.sight,
            Smell: recipe.smell,
            Sound: recipe.sound,
            Stars: recipe.stars,
            Taste: recipe.taste,
            Tier: recipe.tier,
            Touch: recipe.touch,
        };
        if (recipe.magimins > magiminMax) {
            magiminMax = recipe.magimins;
        } else if (recipe.magimins < magiminMin) {
            magiminMin = recipe.magimins;
        }
        /** @type {IngredientName[]} */
        const uniqueIngredients = [];
        let lastIndex = 0;
        recipe.ingredientNames.forEach((raw) => {
            const name = raw.replace("Qilin", "Quilin");
            if (!uniqueIngredients.includes(name)) {
                lastIndex++;
                uniqueIngredients.push(name);
                wide[`I${lastIndex}`] = name;
                const IIndex = I1Index + ((lastIndex - 1) * 2);
                const CIndex = IIndex + 1;
                wide[`S${lastIndex}`] = `=IF(${ref(CIndex)}="","",VLOOKUP(${ref(IIndex)},Ingredients!$A:$C,3,FALSE)>=${ref(CIndex)})`;
            }
            wide[`C${lastIndex}`] = (wide[`C${lastIndex}`] ?? 0) + 1;
        });
        out.write(wide);
        writeCount++;
        return undefined;
    });
    out.close();
});

console.log(`Recipes: ${readCount.toLocaleString()} read; ${writeCount.toLocaleString()} written`);
console.log(`Magimins: ${magiminMin.toLocaleString()} to ${magiminMax.toLocaleString()}`);
