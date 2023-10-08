import {expect} from "chai";
import {givens} from "../givens.js";
import {readJsonSync} from "../read-json-sync.js";
import {LocationName} from "../type/location.js";
import {RARITY_NAME_BY_NUM} from "../type/rarity.js";
import {BAD, GOOD, NEUTRAL, RANDOM, Sensation} from "../type/sense.js";

/**
 * @typedef WikiaIngredient
 * @type {object}
 * @property {number} A
 * @property {number} B
 * @property {number} C
 * @property {number} D
 * @property {number} E
 * @property {string} description
 * @property {number} icon
 * @property {LocationName} location
 * @property {number} magimins
 * @property {string} name
 * @property {number} price
 * @property {number} rarity
 * @property {Sensation} sight
 * @property {Sensation} smell
 * @property {Sensation} sound
 * @property {Sensation} taste
 * @property {Sensation} touch
 * @property {string} type
 */

/** @type {WikiaIngredient[]|undefined} */
let wikiaIngredients;

/** @returns {WikiaIngredient[]} */
const getWikiaIngredients = () => {
    wikiaIngredients ??= Object.freeze(readJsonSync("data/ingredients-wikia.json"));
    return wikiaIngredients;
};

const fixName = (name) => name.replace(/-/, " ").replace(/[^a-zA-Z0-9 ]+/g, "");

const getAllNames = () => {
    /** @type {Set.<string>} */
    const names = new Set();
    getWikiaIngredients().forEach((wi) => names.add(fixName(wi.name)));
    givens.ingredients.forEach((i) => names.add(fixName(i.name)));
    return Array.from(names);
};

describe("ingredients-wikia", () => {
    // eslint-disable-next-line mocha/no-setup-in-describe
    getAllNames().forEach((name) => {
        it(name, () => {
            const wikia = getWikiaIngredients().find((wi) => fixName(wi.name) === name);
            const primary = givens.ingredients.find((i) => fixName(i.name) === name);
            expect(wikia, "Wikia").to.be.an("object");
            expect(primary, "Primary").to.be.an("object");
            expect(wikia.location, "location").eq(primary.location);
            expect(wikia.price, "price").eq(primary.price);
            expect(RARITY_NAME_BY_NUM[wikia.rarity], "rarity").eq(primary.rarity);
            expect(wikia.magimins, "magimins").eq(primary.magimins);
            expect(wikia.A, "A").eq(primary.A);
            expect(wikia.B, "B").eq(primary.B);
            expect(wikia.C, "C").eq(primary.C);
            expect(wikia.D, "D").eq(primary.D);
            expect(wikia.E, "E").eq(primary.E);
            const translateSense = (sense) => ({
                bad: BAD,
                good: GOOD,
                neutral: NEUTRAL,
                random: RANDOM,
            })[sense];
            expect(translateSense(wikia.sight), "sight").eq(primary.sight);
            expect(translateSense(wikia.smell), "smell").eq(primary.smell);
            expect(translateSense(wikia.sound), "sound").eq(primary.sound);
            expect(translateSense(wikia.taste), "taste").eq(primary.taste);
            expect(translateSense(wikia.touch), "touch").eq(primary.touch);
        });
    });
});
