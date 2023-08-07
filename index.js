const fs = require("fs");

async function work(){

  if(!fs.existsSync("./markov.json")){
    console.log("Markov chains have not been trained");
    if(!fs.existsSync("./kana-database.json")){
      console.log("Database missing for training");
      const c = require("./create-database.js");
      await c(2000);
      console.log("Database downloaded");
    }
    console.log("Training chains");
    require("./train-markov.js")();
    console.log("Markov chains trained!");
  }

  const markov = JSON.parse(fs.readFileSync("./markov.json"));
  const keys = Object.keys(markov).filter(k => k[0] == "^");

  let result = keys.at(Math.random() * keys.length);
  while(result.slice(-1) != "$"){
    const ctx = result.slice(-2);
    const probs = markov[ctx];
    const pick = [];
    for(const pre in probs){
      let dis = 1;
      if(pre == "$"){
        if(result.length < 6) dis = 0;
        if(result.length > 10) dis = 4;
      }
      pick.push(
        ...[
          ...Array(Math.floor(probs[pre] * dis))
        ].map(() => pre)
      );
    }
    const next = pick.at(Math.random() * pick.length) ?? "$";
    result += next;
  }

  return result[1].toUpperCase() + result.slice(2, -1);

}

if(require.main == module){
  (async () => { console.log(await work()); })();
}

module.exports = work;
