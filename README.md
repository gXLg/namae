# namae
Fake Japanese Names Generator

# Usage
The repo is ready to use when
being downloaded, except you want to
apply some fine-tuning.

Install dependencies with `npm install`.

Generate names directly by running `node index.js` or `node .`.

Or you can use the repo as a package and use it like this:
```js
const namae = require("./namae");

(async () => {

  console.log(await namae());

})();
```

# Motivation
Created for fun to generate names for
my Android Easter Egg cats.

Btw, I named them
> Mukeido, Ujikana, Uku, Shuujou,
> Ishosei, Betsu, Ichi, Zenru,
> Gozuru and Hitotokiro

# Repo
This repository contains:

* `kana-database.json` -
Database of 2000 frequently used japanese
words written in romaji.

* `create-database.js` -
Code for creating the database. Use it directly
to download the 2000 capped database
or `require()` it and call with `enough` as first
parameter, telling how long the database should be
(15000 is maximum because of source size,
but will never get this big, because words with only
one mora (syllable) or which are katakana get discarded).
`logger` is the second parameter, which is optional and
can be an EventEmitter, which could be helpful
for logging progress.

* `markov.json` -
Markov Chains trained on the database, uses `^` as
beginning token and `$` as finishing token.

* `train-markov.js` -
Creates and trains the model. Assumes existence
of `kana-database.json`. This process usually is quick.
As well, it can be used directly or from `require()`

* `unkana.js` -
Code which is also internally used to transcribe hiragana
into rōmaji using Wāpuro style which means,
long vowels are not included.

* `index.js` -
Main file. Can be used directly, which
will check for the model and database and
create those if needed. But it can be used from
`require()` too. It is tuned to produce output between
5 and 10 characters long, but can sometimes produce extremely
short or long results.

# Disclaimer
The generated text is purely stochasticly random.
In case the text makes any sense in Japanese - it
happened just by chance. You may use the tool how
you wish, however I am not responsible for how
the tool is being used.

# Resources
* The database is being fetched from 
[Corpus Leeds](http://corpus.leeds.ac.uk/frqc/internet-jp.num).
* Kanji results are being turned into Kana using
[Jisho](https://jisho.org/)'s undocumented API
