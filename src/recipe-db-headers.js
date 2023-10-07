/**
 * @function
 * @param {*} v
 * @returns {string}
 */
const simpleToString = (v) => v == null ? "" : v.toString();

/**
 * @function
 * @param {string} name
 * @returns {{name: string, toString: (function(*): string)}}
 */
const simpleColumn = (name) => ({name, toString: simpleToString});

/**
 * @type {[{name: string, toString:(function(*,string): string)}]}
 */
export const RECIPE_DB_HEADERS = [
    simpleColumn("key"),
    simpleColumn("A"),
    simpleColumn("B"),
    simpleColumn("C"),
    simpleColumn("D"),
    simpleColumn("E"),
    simpleColumn("ingredientCount"),
    simpleColumn("magimins"),
    simpleColumn("price"),
    simpleColumn("priceMod"),
    simpleColumn("anyBad"),
    simpleColumn("taste"),
    simpleColumn("touch"),
    simpleColumn("smell"),
    simpleColumn("sight"),
    simpleColumn("sound"),
    simpleColumn("potionName"),
    simpleColumn("tier"),
    simpleColumn("stars"),
    {name: "stability", toString: (s) => Math.round(s * 1000).toString()},
];
