import console from "node:console";
import {givens} from "../src/givens.js";
import {COLORS} from "../src/type/color.js";
import {Potion} from "../src/type/potion.js";

/** @type {{[key: Color]: number}} */
const earliestColors = Object.fromEntries(COLORS.map((color) => {
    return [
        color,
        givens.ingredients
            .filter((ingredient) => ingredient[color] > 0)
            .map((ingredient) => ingredient.earliestChapter)
            .reduce((p, c) => Math.min(p, c)),
    ];
}));
console.log(earliestColors);
/** @type {(Potion & {earliestChapter: number})[]} */
const potionsWithChapters = givens.potions.map((potion) => {
    const earliestChapter = COLORS
        .filter((color) => potion[color] > 0)
        .map((color) => earliestColors[color])
        .reduce((p, c) => Math.max(p, c));
    return {
        ...potion,
        earliestChapter,
    };
});
console.log("Category\tName\tA\tB\tC\tD\tE\tEarliestChapter\tGoalChapter");
potionsWithChapters.forEach((potion) => {
    console.log([
        potion.category,
        potion.name,
        potion.A,
        potion.B,
        potion.C,
        potion.D,
        potion.E,
        potion.earliestChapter,
        "",
    ].join("\t"));
});
