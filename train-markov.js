const fs = require("fs");
const unkana = require("./unkana.js");

function work(){

  const kana = JSON.parse(fs.readFileSync("./kana-database.json"));
  const markov = { };

  for(const k of kana){
    const w = "^" + k + "$";
    for(let i = 0; i < k.length; i ++){
      const sub = w.slice(i, i + 2);
      const pre = w[i + 2];
      markov[sub] = markov[sub] ?? { };
      markov[sub][pre] = (markov[sub][pre] ?? 0) + 1;
    }
  }

  fs.writeFileSync("./markov.json", JSON.stringify(markov));
}

if(require.main == module){
  work();
}

module.exports = work;
