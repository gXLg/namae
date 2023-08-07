const axios = require("axios");
const fs = require("fs");
const Emitter = require("events");
const unkana = require("./unkana.js");

async function work(enough, logger){

  const req = await axios.get(
    "http://corpus.leeds.ac.uk/frqc/internet-jp.num"
  );
  const data = req.data.trim().split("\n").slice(4);
  const words = data.map(d => d.split(" ")[2]);

  let requests = 0;

  const kana = [];
  for(const w of words){

    const un = unkana(w);
    if(un != null){
      if(w.length > 1){
        kana.push(un);
        logger?.emit(
          "log", w, "added as", un,
          "len:", kana.length
        );
      } else logger?.emit("log", w, "not added");
      continue;
    }


    const search = new URLSearchParams({ "keyword": w });

    let req;
    while(true){
      try {
        // rate limiting
        await new Promise(resolve => {
          const i = setInterval(() => {
            if(requests < 10){
              clearInterval(i);
              resolve();
            }
          }, 100);
        });

        requests ++;
        setTimeout(() => { requests --; }, 15000);
        req = await axios.get(
          "https://jisho.org/api/v1/search/words?" + search,
          {
            "headers": {
              "User-Agent": "Mozilla/5.0"
            }
          }
        );
        break;

      } catch(err){
        if(err.response.status == 500) break;
        continue;
      }
    }
    if(req == null) continue;

    let found = false;
    for(const d of req.data.data){
      for(const j of d.japanese){
        if(
          (j.word && j.word == w && j.reading) ||
          (j.reading == w)
        ){
          const reading = j.reading;
          if(reading.length > 1){
            const un = unkana(reading);
            if(un == null) continue;
            kana.push(un);
            logger?.emit(
              "log", w, "added as", un,
              "len:", kana.length
            );
            found = true;
            break;
          }
        }
      }
      if(found) break;
    }
    if(kana.length == enough) break;
    if(!found) logger?.emit("log", w, "not added");
  }
  logger?.emit("log", "reached the goal of", enough, "entries");
  fs.writeFileSync("./kana-database.json", JSON.stringify(kana));
}

if(require.main == module){
  (async () => {
    const logger = new Emitter();
    logger.on("log", console.log);
    await work(2000, logger);
  })();
}

module.exports = work;
