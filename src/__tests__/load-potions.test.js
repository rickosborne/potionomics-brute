import {expect} from "chai";
import {loadPotions} from "../load-potions.js";
import {Potion} from "../type/potion.js";

describe(loadPotions.name, () => {
    it("seems to work", () => {
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
        const potions = loadPotions();
        expect(potions).to.be.an.instanceOf(Array);
        expect(potions.length).eq(20);
        const fireTonic = potions.find((p) => p.name === "Fire");
        expect(fireTonic).to.deep.equal(expectedFire);
    });
});
