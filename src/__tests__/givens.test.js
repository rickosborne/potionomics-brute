import {expect} from "chai";
import {givens} from "../givens.js";
import {Cauldron} from "../type/cauldron.js";
import {Ingredient} from "../type/ingredient.js";
import {Location} from "../type/location.js";
import {Potion} from "../type/potion.js";
import {BAD, GOOD, NEUTRAL} from "../type/sense.js";

describe("givens", () => {
    describe("cauldrons", () => {
        it("seems reasonable", () => {
            const {cauldrons} = givens;
            expect(cauldrons).is.an.instanceOf(Array);
            expect(cauldrons.length).eq(38);
            /** @type {Cauldron} */
            const expected = {
                description: "Graceful details belie this industrial-strength cauldron's resilience to wear and tear.",
                ingredientCost: undefined,
                maxIngredients: 8,
                maxMagimins: 420,
                name: "Steel Cauldron",
                price: 770,
                unlockDay: 21,
            };
            const steel = cauldrons.find((c) => c.name === expected.name);
            expect(steel).deep.equals(expected);
        });

        it("only has ingredient costs which are in `ingredients`", () => {
            givens.cauldrons.forEach((cauldron) => {
                const {ingredientCost} = cauldron;
                if (ingredientCost != null) {
                    const ingredient = givens.ingredients.find((i) => i.name === ingredientCost);
                    expect(ingredient, ingredientCost).to.exist;
                }
            });
        });
    });

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
                B: 0,
                C: 0,
                D: 0,
                E: 66,
                earliestChapter: 4,
                location: "Arctic",
                magimins: 66,
                name: "Abominable Tarantula",
                price: 105,
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

        it("all have known locations", () => {
            const {ingredients, locations} = givens;
            ingredients.forEach((ingredient) => {
                expect(ingredient.type).is.a("string");
                expect(ingredient.price).is.a("number");
                expect(ingredient.rarity).is.a("string");
                expect(ingredient.location).is.a("string");
                const location = locations.find((l) => l.name === ingredient.location);
                expect(location, ingredient.location).not.to.be.undefined;
            });
        });
    });

    describe("locations", () => {
        it("seems to work", () => {
            const {locations} = givens;
            expect(locations).is.an.instanceOf(Array);
            expect(locations.length).eq(13);
            /** @type {Location} */
            const expectedLocation = {
                chapter: 4,
                name: "Arctic",
            };
            const arctic = locations.find((l) => l.name === expectedLocation.name);
            expect(arctic).deep.equals(expectedLocation);
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
                earliestChapter: 1,
                goalChapter: 1,
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
