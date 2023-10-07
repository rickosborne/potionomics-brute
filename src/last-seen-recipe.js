import childProcess from "node:child_process";
import {existsSync} from "./exists-sync.js";
import {RECIPE_DB_HEADERS} from "./recipe-db-headers.js";
import {recipeFromRow, RecipeRow} from "./recipe-from-row.js";
import {Recipe} from "./type/recipe.js";

/**
 * @param {string} filePath
 * @returns {undefined|Recipe}
 */
const lastRecipeInFile = (filePath) => {
    const doesExist = existsSync(filePath, (s) => s.isFile());
    if (!doesExist) {
        return undefined;
    }
    const line = childProcess.execSync(`tail -n 1 ${filePath}`, {encoding: "utf8"}).trim().split("\t");
    /** @type {RecipeRow} */
    const row = {};
    RECIPE_DB_HEADERS.forEach(({name}, index) => {
        row[name] = line[index];
    });
    return recipeFromRow(row);
};

/**
 * @param {string} prefix
 * @returns {Recipe|undefined}
 */
export const lastSeenRecipe = (prefix) => {
    const filePaths = [
        `db/${prefix}recipes-all.tsv`,
        `db/${prefix}recipes-stable.tsv`,
        `db/${prefix}recipes-perfect.tsv`,
    ];
    for (const filePath of filePaths) {
        const recipe = lastRecipeInFile(filePath);
        if (recipe != null) {
            return recipe;
        }
    }
    return undefined;
};
