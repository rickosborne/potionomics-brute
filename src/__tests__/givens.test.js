import {expect} from "chai";
import {givens} from "../givens.js";
import {Ingredient} from "../type/ingredient.js";
import {Potion} from "../type/potion.js";
import {BAD, GOOD, NEUTRAL} from "../type/sense.js";

describe("givens", () => {
    describe("ingredients", () => {
        it("gets something reasonable-looking", () => {
            const {ingredients} = givens;
            expect(ingredients).is.an.instanceOf(Array);
            expect(ingredients.length).is.greaterThanOrEqual(100);
        });

        it("formats ingredients reasonably", () => {
            const {ingredients} = givens;
            expect(ingredients).to.be.an.instanceOf(Array);
            /** @type {Ingredient} */
            const expectedIngredient = {
                A: 0,
                anyBad: true,
                B: 0,
                C: 0,
                D: 0,
                E: 66,
                location: "Past day 30",
                magimins: 66,
                name: "Abominable Tarantula",
                price: 105,
                priceMod: 0,
                rarity: "Uncommon",
                sight: BAD,
                smell: NEUTRAL,
                sound: GOOD,
                taste: NEUTRAL,
                touch: NEUTRAL,
                type: "Bug",
            };
            const found = ingredients.find((i) => i.name === expectedIngredient.name);
            expect(found).to.deep.eq(expectedIngredient);
        });
    });

    describe("potions", () => {
        it("seems to work", () => {
            const {potions} = givens;
            expect(potions).to.be.an.instanceOf(Array);
            expect(potions.length).eq(20);
            /**
             * @type {Potion}
             */
            const expectedFire = {
                A: 1,
                B: 0,
                C: 1,
                category: "Tonic",
                D: 0,
                E: 0,
                name: "Fire",
            };
            const fireTonic = potions.find((p) => p.name === "Fire");
            expect(fireTonic).to.deep.equal(expectedFire);
        });
    });

    describe("tierNames", () => {
        it("loads correctly", () => {
            expect(givens.tierNames).to.deep.eq([
                "Minor",
                "Common",
                "Greater",
                "Grand",
                "Superior",
                "Masterwork",
            ]);
        });
    });
});
