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
