const fs = require('fs');

const getAbjad = (input, maghribiOrder = false, ignoreHamzah = false) => {
  const inputStripped = input.replace(/[\u064B-\u065F\u0670]/g, "");
  let total = 0;
  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);

    if (char === "ا" || char === "آ" || char === "أ" || char === "إ" || char === "ٱ") {
      total += 1;
    } else if (char === "ئ") {
      let isLast = true;
      for (let j = i + 1; j < inputStripped.length; j += 1) {
        const nextChar = inputStripped.charAt(j);
        if (/\s/.test(nextChar) || nextChar === "\u200C") break;
        isLast = false;
        break;
      }
      total += isLast ? 10 : 1;
    } else if (char === "ء") {
      if (!ignoreHamzah) total += 1;
    } else if (char === "ب" || char === "پ") {
      total += 2;
    } else if (char === "ج" || char === "چ") {
      total += 3;
    } else if (char === "د") {
      total += 4;
    } else if (char === "ه" || char === "ة" || char === "ۀ" || char === "ہ") {
      total += 5;
    } else if (char === "و" || char === "ؤ") {
      total += 6;
    } else if (char === "ز" || char === "ژ") {
      total += 7;
    } else if (char === "ح") {
      total += 8;
    } else if (char === "ط") {
      total += 9;
    } else if (char === "ی" || char === "ى" || char === "ي") {
      total += 10;
    } else if (char === "ک" || char === "گ" || char === "ك") {
      total += 20;
    } else if (char === "ل") {
      total += 30;
    } else if (char === "م") {
      total += 40;
    } else if (char === "ن") {
      total += 50;
    } else if (char === "س") {
      total += maghribiOrder ? 300 : 60;
    } else if (char === "ع") {
      total += 70;
    } else if (char === "ف") {
      total += 80;
    } else if (char === "ص") {
      total += maghribiOrder ? 60 : 90;
    } else if (char === "ق") {
      total += 100;
    } else if (char === "ر") {
      total += 200;
    } else if (char === "ش") {
      total += maghribiOrder ? 1000 : 300;
    } else if (char === "ت") {
      total += 400;
    } else if (char === "ث") {
      total += 500;
    } else if (char === "خ") {
      total += 600;
    } else if (char === "ذ") {
      total += 700;
    } else if (char === "ض") {
      total += maghribiOrder ? 90 : 800;
    } else if (char === "ظ") {
      total += maghribiOrder ? 800 : 900;
    } else if (char === "غ") {
      total += maghribiOrder ? 900 : 1000;
    }
  }
  return total;
};

const text = fs.readFileSync('surah_baqarah_full.txt', 'utf8');

// Regex to capture everything up to an Eastern Arabic Number (which represents the end of an ayah)
const regex = /(.*?)([١٢٣٤٥٦٧٨٩٠]+)/g;
let match;

const convertNum = (str) => {
  const map = {'٠':0,'١':1,'٢':2,'٣':3,'٤':4,'٥':5,'٦':6,'٧':7,'٨':8,'٩':9};
  return parseInt(str.split('').map(c => map[c]).join(''), 10);
};

const results = [];
while ((match = regex.exec(text)) !== null) {
  let ayatText = match[1].trim();
  let num = convertNum(match[2]);
  
  // Clean up punctuation that usually isn't counted in Abjad (they are skipped by the function anyway, but good to be safe)
  ayatText = ayatText.replace(/[ۖۗۚۛ۞ۙۘۜ۩]/g, "");

  let total = getAbjad(ayatText);
  results.push(`Ayat ${num}: ${total}`);
}

fs.writeFileSync('abjad_results_baqarah.txt', results.join('\n'));
console.log(results.join('\n'));
