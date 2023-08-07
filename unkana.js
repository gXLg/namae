const table = {
  "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
  "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
  "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
  "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
  "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
  "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
  "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
  "や": "ya", "ゆ": "yu", "よ": "yo",
  "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
  "わ": "wa", "を": "o", "ん": "n",
  "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
  "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
  "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do",
  "ば": "ba", "び": "bi", "ぶ": "bu", "べ": "be", "ぼ": "bo",
  "ぱ": "pa", "ぴ": "pi", "ぷ": "pu", "ぺ": "pe", "ぽ": "po",
  "ゔ": "vu", "わ゙": "va", "ゎ": "ka", "っ": "'"
}

const vowels = "aiueo";
const lowv = "ぁぃぅぇぉ";
const yu = "ゃ_ゅ_ょ";

function work(kana){

  let result = "";
  let last = "";

  for(const k of kana){
    let t;
    if(lowv.includes(k)){
      const vow = vowels[lowv.indexOf(k)];
      if(["fu", "vu", "shi", "ji", "chi", "tsu"].includes(last)){
        t = last.slice(0, -1) + vow;
        last = "";
      } else if(
        vow == "i" &&
        ["su", "zu", "te", "de", "to", "do"].includes(last)
      ){
        t = last.slice(0, -1) + "i";
        last = "";
      } else if(last.slice(-1) == vow){
        t = vow;
      } else if(last.slice(-1) == "i"){
        t = last.slice(0, -1) + "w" + vow;
        last = "";
      } else if(last.slice(-1) == "u"){
        t = last.slice(0, -1) + "y" + vow;
        last = "";
      } else return null;
    } else if(yu.includes(k)){
      const vow = vowels[yu.indexOf(k)];
      if(last.slice(-1) == "i"){
        t =
          last.slice(0, -1) +
          (["shi", "chi", "ji"].includes(last) ? "" : "y") +
          vow;
        last = "";
      } else return null;
    } else if(k == "ー"){
      const l = last.slice(-1);
      if(!vowels.includes(l)) return null;
      t = last + l;
      last = "";
    } else {
      t = table[k];
    }
    if(last == "n" && (vowels + "y").includes(t[0])){
      last += "'";
    } else if(last == "'" && !vowels.includes(t[0])){
      t = t[0] + t;
      last = "";
    }

    if(t == null) return null;
    result += last;
    last = t;
  }
  result += last;

  return result;

}

module.exports = work;
