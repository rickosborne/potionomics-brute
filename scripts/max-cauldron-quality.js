import console from "node:console";
import {givens} from "../src/givens.js";
import {qualityFromMagimins} from "../src/quality-from-magimins.js";

const tiers = givens.qualityTiers;
givens.cauldrons.forEach((cauldron) => {
    const quality = qualityFromMagimins(cauldron.maxMagimins);
    console.log([
        cauldron.name,
        " ".repeat(40 - cauldron.name.length),
        tiers[quality.tier].name,
        quality.stars,
    ].join(" "));
});
