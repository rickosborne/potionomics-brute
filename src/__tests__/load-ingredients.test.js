import {expect} from "chai";
import {loadIngredients} from "../load-ingredients";

describe(loadIngredients.name, () => {
    let ingredients;

    it("gets something reasonable-looking", () => {
        ingredients ??= loadIngredients();
        expect(ingredients).is.an.instanceOf(Array);
        expect(ingredients.length).is.greaterThanOrEqual(100);
    });

    it("formats ingredients reasonably", () => {
        ingredients ??= loadIngredients();
        const ingredient = ingredients.find((i) => i.name === "Abominable Tarantula");
        expect(ingredient).not.to.be.undefined;
        expect(ingredient.name).eq("Abominable Tarantula");
        expect(ingredient.A).eq(0);
        expect(ingredient.B).eq(0);
        expect(ingredient.C).eq(0);
        expect(ingredient.D).eq(0);
        expect(ingredient.E).eq(66);
        expect(ingredient.price).eq(105);
        expect(ingredient.priceMod).eq(0);
        expect(ingredient.anyBad).eq(true);
        expect(ingredient.type).eq("Bug");
        expect(ingredient.rarity).eq("Uncommon");
        expect(ingredient.location).eq("Past day 30");
    });
});
