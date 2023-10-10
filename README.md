# potionomics-brute

This code is a proof-of-concept for brute-forcing potion recipe combinations for the game [Potionomics].
As it's not intended to be a useful tool, there's no "app" here, or script to give you all the answers.

[Potionomics]: https://potionomics.com/

Having said that, I do think there are a few clever bits in the code.

## Speed

As is, this code is able to burn through ~500M recipe attempts per hour with a single process on my M1 Air.
Approximately 1 in every 100,000 yields a Perfect potion.

But, as the largest cauldron accepts 14 ingredients, and there are 206 ingredients total, there's no way to try every
single one:

> 206 multichoose 14 &rarr; 4,380,486,799,548,977,500,000

A laptop running overnight can generally get you into combinations of 8 ingredients.
If you're willing to target a single potion, or limit yourself to ingredients from the first chapter or two, you'll get
even more.
That'll give you several hundred thousand Perfect recipes, at least.

## Resources

The following files in the `data/` directory have the following sources:

`cauldrons.tsv`: Assembled
from [this page on the Potionomics wiki](https://potionomics.fandom.com/wiki/Cauldrons_and_Shelves)

`ingredients.tsv`: [This Google Sheet](https://docs.google.com/spreadsheets/d/1NG-Zsd6tkG3ndUKF5jYglNJWw4qSr0IqZWlDArEDpqc/edit),
which I found via [this post on the Steam forums](https://steamcommunity.com/sharedfiles/filedetails/?id=2876744197),
and then cleaned up to match the Wikia file.

`ingredients-wikia.json`: Assembled
from [this page on the Potionomics wiki](https://potionomics.fandom.com/wiki/Ingredients).

`locations.tsv`: Assembled from [this page on the Potionomics wiki](https://potionomics.fandom.com/wiki/Adventure).

`potions.tsv`: Assembled from [this list on the Potionomics wiki](https://potionomics.fandom.com/wiki/Potions).

`quality-tiers.json`: Assembled from [this page on the Potionomics wiki](https://potionomics.fandom.com/wiki/Potions).

## Disclaimers and Legal

I am not in any way affiliated with the game, its developers, etc.
I'm just a random player.
There is no warranty for this code, and I assume no responsibility for what happens if you run it.

The code is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
The data files (in `data/`) are not covered by this license, as I did not create them.

# Usage

Check out `scripts` in `package.json` for the basics.

## `brute`

Example:

```shell
npm run brute -- \
  --potion Health \
  --chapter 1
```

This would find all the recipes for Health potions using ingredients available in Chapter 1, limiting the ingredient
count to cauldron sizes obtainable in Chapter 1.

This specific example should run pretty quickly.

You can add more `--potion` arguments to try other potions from the same ingredients.

If you add `--goal` instead, it will use the potions for the competition in that Chapter (1, here).
For Chapter 1, `--goal` is equivalent to `--potion Health --potion Mana --potion Fire`, for example.

This will output two files to the `db/` directory: `*-recipes-perfect.tsv` and `*-recipes-stable.tsv`, which are each
what they sound like.
They will have a prefix which is calculated from your other options, which you can override with `--prefix`.

You can also specify `--stable`, a stability cutoff percent, which controls how many recipes end up in
the `*-stable.tsv` file.
The default is `95`.
If you set it to `100`, then only the `perfect` file will be created, and the Ingredients list will be further reduced
to only ones which can provide exactly the correct necessary magimins.

If you're not familiar with `.tsv` files, they are just tab-delimited text spreadsheets.
You can open them in Numbers, Excel, Google Sheets, etc.
The column names are self-explanatory.

## `recipe-options`

This one requires more setup: you must create an inventory file.
It's a tab-delimited text `.tsv` file, with columns for `Ingredient` and `Stock`.

For example:

```
Ingredient	Stock
Feyberry	39
River Calamari	9
Impstool Mushroom	2
Mandrake Root	10
```

You must already have recipes in your `db/` directory, from `brute`.
You can then run something like:

```shell
npm run recipe-options -- \
  --inventory inventory/day16.tsv \
  --recipes db/health-c1-recipes-perfect.tsv \
  --maxItems 8 \
  --maxMagimins 240
```

You'll want to tailor this to match whatever cauldrons you have.

You'll get an output something like:

```
01. 96mm 2⭐️ Common + Health for 164g (+5%), Rare: 48 48 0 0 0
        4xMandrake Root + 4xSphinx Flea
02. 96mm 2⭐️ Common +- Health for 175g, Rare: 48 48 0 0 0
        1xImpstool Mushroom + 2xMandrake Root + 1xSerpent's Slippery Tongue + 4xSphinx Flea
03. 88mm 1⭐️ Common + Health for 145g (+5%), Rare: 44 44 0 0 0
        3xMandrake Root + 2xRiver-Pixie's Shell + 3xSphinx Flea
04. 88mm 1⭐️ Common +- Health for 156g, Rare: 44 44 0 0 0
        1xImpstool Mushroom + 1xMandrake Root + 2xRiver-Pixie's Shell + 1xSerpent's Slippery Tongue + 3xSphinx Flea
...
```

Here, `mm` stands for "Magimins".
The `+-~` stand for bonuses/modifiers: positive, negative, and random.

The recipe's Rarity is the maximum Rarity of all ingredients.
That is, if a recipe calls for 5x _Uncommon_ plus 1x _Epic_, then the recipe is considered _Epic_.

There's one additional option, `--count`, which defaults to `25`, and is the number of recipes to show.
The sorting algorithm prioritizes the following in this order:

- Total Magimins (high to low)
- Rarity (low to high)
- Price Mod (high to low)
- Ingredient count (high to low)
- Price (low to high)

### When no recipes match

You may also see:

```
⚠️ No recipes found which match your inventory. ⚠️
```

If so, you will then get some recommendations, like:

```
Shopping list:
  54 Shadowveil Pearl (Uncommon)
  52 Glass Ore (Common)
  28 Rotfly Cocoon (Uncommon)
  27 Sack of Hive Slime (Common)
  25 Qilin's Tri-Horn (Common)
...

Top recipes:
01. 240mm 4⭐️ Greater +~ Speed for 318g (+5%?), Uncommon: 0 0 120 120 0
        2xRaiju Droppings + 1xRotfly Cocoon + 1xSack of Composite Slime + 1xSack of Hive Slime + 2xSaltwatermelon + 1xShadowveil Pearl
02. 240mm 4⭐️ Greater + Speed for 321g (+5%), Uncommon: 0 0 120 120 0
        3xFulgurite Ore + 1xRaiju Droppings + 3xSack of Composite Slime + 1xShadowveil Pearl
03. 240mm 4⭐️ Greater ~+ Speed for 325g (+5%?), Uncommon: 0 0 120 120 0
        3xFulgurite Ore + 1xRaiju Droppings + 1xRotfly Adult + 1xSack of Composite Slime + 1xShadowveil Pearl + 1xSpriggan Antler
...
```

These lists show the top ingredients and recipes you should work toward.
The recipes will all have the same Magimin count (here, 240), and will be sorted using the same ranking as above.

The shopping list shows the most-represented ingredients from all the recipes with that Magimin count.
The number next to them is how many Top Recipes use that ingredient.
In the example above, _Shadowveil Pearl_ is used twice as often as _Sack of Hive Slime_, so if you want to maximize your
recipe options, this is a decent approximation of your purchase priority.
