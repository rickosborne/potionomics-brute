import console from "node:console";
import process from "node:process";
import {parseArgs} from "node:util";
import {chapterFromDay} from "../src/chapter-from-day.js";
import {multiChooseCount} from "../src/combinations.js";
import {countdownTimer} from "../src/countdown-timer.js";
import {duration, DURATION_PARTS} from "../src/duration.js";
import {givens} from "../src/givens.js";
import {lastSeenRecipe} from "../src/last-seen-recipe.js";
import {Ledger} from "../src/ledger.js";
import {intFrom, maybeIntFrom} from "../src/spreadsheet-helpers.js";
import {TryEverything} from "../src/try-everything.js";
import {COLORS} from "../src/type/color.js";

const {
    values: {
        chapter: wantChapters,
        goal,
        location: wantLocations,
        maxItems: wantMax,
        potion: wantPotions,
        prefix: wantPrefix,
        stable: wantStable,
    },
} = parseArgs({
    options: {
        chapter: {
            default: [],
            multiple: true,
            type: "string",
        },
        goal: {
            default: false,
            multiple: false,
            type: "boolean",
        },
        location: {
            default: [],
            multiple: true,
            type: "string",
        },
        maxItems: {
            default: "",
            type: "string",
        },
        potion: {
            default: [],
            multiple: true,
            type: "string",
        },
        prefix: {
            default: "*",
            type: "string",
        },
        stable: {
            default: "",
            type: "string",
        },
    },
    strict: true,
});
let maxItems = maybeIntFrom(wantMax);
const chapters = wantChapters.map((c) => intFrom(c));
if (wantChapters.length > 0) {
    chapters.forEach((chapter) => {
        givens.locations
            .filter((l) => l.chapter === chapter)
            .forEach((location) => wantLocations.push(location.name));
    });
    maxItems ??= givens.cauldrons
        .filter((cauldron) => chapters.includes(chapterFromDay(cauldron.unlockDay)))
        .map((cauldron) => cauldron.maxIngredients)
        .reduce((p, c) => Math.max(p, c));
    console.log(`MaxItems: ${maxItems}`);
}
maxItems ??= 14;
const potions = givens.potions
    .filter((p) => wantPotions.length === 0 || wantPotions.includes(p.name))
    .filter((p) => chapters.length === 0 || chapters.includes(p.earliestChapter))
    .filter((p) => !goal || (chapters.length === 0 && p.goalChapter != null) || (chapters.length > 0 && chapters.includes(p.goalChapter)));
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
    console.error({colorsWanted, needColors, wantChapters, wantLocations, wantPotions, wantPrefix});
    throw new Error(`Loaded no ingredients!`);
}
let prefix = wantPrefix;
if (prefix === "*") {
    const prefixParts = [];
    if (potions.length <= 5) {
        prefixParts.push(...potions.map((p) => p.name.toLowerCase()));
    }
    if (chapters.length > 0) {
        prefixParts.push(`c${chapters.reduce((p, c) => Math.max(p, c))}`);
    }
    prefixParts.push(`x${maxItems}`);
    prefixParts.push("");
    prefix = prefixParts.join("-");
    console.log(`Prefix: ${prefix}`);
}
let stableCutoff = maybeIntFrom(wantStable);
if (stableCutoff != null) {
    if (stableCutoff > 1) {
        stableCutoff /= 100;
    }
    console.log(`Stable cutoff: ${stableCutoff.toPrecision(4)}`);
}
const ledger = new Ledger({prefix, stableCutoff});
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
const startMs = Date.now();
const keepGoing = () => {
    if (!shouldContinue) {
        return;
    }
    if (timeUntilNextLog === 0) {
        timeUntilNextLog = 1000;
        const elapsedMs = Date.now() - startMs;
        console.log(`${duration(elapsedMs)}: ${countdown.toString()} @ ${itemCount}/${ingredients.length} items: ${ledger.perfectCount.toLocaleString()} / ${ledger.stableCount.toLocaleString()} / ${ledger.totalCount.toLocaleString()}`);
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
        const {totalCount} = ledger;
        if (totalCount > 0) {
            const totalMs = Date.now() - startMs;
            console.log(`Total: ${totalCount.toLocaleString()} in ${duration(totalMs)}`);
            let units = totalMs;
            DURATION_PARTS.forEach(([divisor, , , unitName]) => {
                if (units === 0) {
                    return;
                }
                const attemptsPer = totalCount / units;
                if (attemptsPer > 1) {
                    console.log(`Recipes/${unitName}: ${Math.round(attemptsPer).toLocaleString()}`);
                } else {
                    console.log(`${unitName}/recipe: ${Math.round(1 / attemptsPer).toLocaleString()}`);
                }
                units = Math.floor(units / divisor);
            });
        }
    }
};

process.on("exit", shutdown);
process.on("SIGINT", shutdown);

keepGoing();
