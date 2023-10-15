const console = require("node:console");
const {givens} = require("../src/givens.js");
const {qualityFromMagimins} = require("../src/quality-from-magimins.js");

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
