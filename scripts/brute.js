import console from "node:console";
import process from "node:process";
import {parseArgs} from "node:util";
import {multiChooseCount} from "../src/combinations.js";
import {countdownTimer} from "../src/countdown-timer.js";
import {givens} from "../src/givens.js";
import {lastSeenRecipe} from "../src/last-seen-recipe.js";
import {Ledger} from "../src/ledger.js";
import {TryEverything} from "../src/try-everything.js";
import {COLORS} from "../src/type/color.js";

const {
    values: {
        chapter: wantChapters,
        maxItems: wantMax,
        potion: wantPotions,
        prefix,
        location: wantLocations,
    },
} = parseArgs({
    options: {
        chapter: {
            default: [],
            multiple: true,
            type: "string",
        },
        location: {
            default: [],
            multiple: true,
            type: "string",
        },
        maxItems: {
            default: "14",
            type: "string",
        },
        potion: {
            default: [],
            multiple: true,
            type: "string",
        },
        prefix: {
            default: "",
            type: "string",
        },
    },
    strict: true,
});
wantChapters.map((c) => parseInt(c, 10)).forEach((chapter) => {
    givens.locations
        .filter((l) => l.chapter === chapter)
        .forEach((location) => wantLocations.push(location.name));
});
const maxItems = parseInt(wantMax, 10);
const potions = givens.potions.filter((p) => wantPotions.length === 0 || wantPotions.includes(p.name));
const needColors = {
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
};
potions.forEach((potion) => {
    COLORS.forEach((color) => {
        if (potion[color] > 0) {
            needColors[color] = true;
        }
    });
});
const colorsWanted = COLORS.filter((color) => needColors[color]);
console.log(`Loaded ${potions.length} potions`);
const rawIngredients = givens.ingredients;
const ingredientsAfterLocations = rawIngredients
    .filter((i) => wantLocations.length === 0 || wantLocations.includes(i.location))
    .filter((i) => wantChapters.length === 0 || wantChapters.includes(String(i.earliestChapter)));
const ingredients = ingredientsAfterLocations
    .filter((i) => colorsWanted.some((color) => i[color] > 0));
console.log(`Loaded ${rawIngredients.length} => ${ingredientsAfterLocations.length} => ${ingredients.length} ingredients`);
if (ingredients.length === 0) {
    console.error({colorsWanted, needColors, prefix, wantChapters, wantLocations, wantPotions});
    throw new Error(`Loaded no ingredients!`);
}
const ledger = new Ledger({prefix});
const tryEverything = new TryEverything({
    ingredients,
    ledger,
    maxItems,
    potions,
});
let itemCount = 0;
let countdown = countdownTimer(ingredients.length);
const lastRecipe = lastSeenRecipe(prefix);
if (lastRecipe != null) {
    const offsets = lastRecipe.ingredientNames.map((name) => {
        const index = ingredients.findIndex((i) => i.name === name);
        if (index < 0) {
            throw new Error(`Ingredient not found: ${name}`);
        }
        return index;
    });
    console.log(`Last offsets: `, offsets);
    tryEverything.offsets = offsets;
    itemCount = offsets.length;
    countdown = countdownTimer(multiChooseCount(ingredients.length, itemCount));
}
let shouldContinue = true;
let timeUntilNextLog = 1000;
let timer;
const keepGoing = () => {
    if (!shouldContinue) {
        return;
    }
    if (timeUntilNextLog === 0) {
        timeUntilNextLog = 1000;
        console.log(`Remaining: ${countdown.toString()} @ ${itemCount} items: ${ledger.perfectCount.toLocaleString()} / ${ledger.stableCount.toLocaleString()} / ${ledger.totalCount.toLocaleString()}`);
    }
    timeUntilNextLog -= 1;
    // eslint-disable-next-line no-undef
    timer = setTimeout(() => {
        let okay = true;
        for (let i = 0; okay && i < 1000; i++) {
            okay = tryEverything.go();
            countdown.tick();
            if (tryEverything.offsets.length > itemCount) {
                itemCount = tryEverything.offsets.length;
                countdown = countdownTimer(multiChooseCount(ingredients.length, itemCount));
            }
        }
        if (!okay) {
            shutdown();
        } else {
            keepGoing();
        }
    }, 1);
};

const shutdown = () => {
    if (timer != null) {
        console.log("Shutting down");
        // eslint-disable-next-line no-undef
        clearTimeout(timer);
        timer = undefined;
        shouldContinue = false;
        tryEverything.stop();
    }
};

process.on("exit", shutdown);
process.on("SIGINT", shutdown);

keepGoing();
