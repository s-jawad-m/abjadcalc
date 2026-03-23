import fs from 'fs';

function getAbjadDetailed(input, maghribiOrder, ignoreHamzah) {
  const inputStripped = input.replace(/[\u0640\u064B-\u0653\u0656-\u065F\u0670\u06D6-\u06ED]/g, "");
  let total = 0;
  const breakdown = [];

  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);
    let val = 0;
    let desc = char;

    if (char === "ا" || char === "آ" || char === "أ" || char === "إ" || char === "ٱ") {
      val = 1;
    } else if (char === "ئ" || char === "ٮ") {
      let hasFloatingHamza = false;
      if (i + 1 < inputStripped.length) {
        const nextChar = inputStripped.charAt(i + 1);
        if (nextChar === "\u0654" || nextChar === "\u0655") {
          hasFloatingHamza = true;
        }
      }

      let isLast = true;
      for (let j = i + 1; j < inputStripped.length; j += 1) {
        const lookAheadChar = inputStripped.charAt(j);
        if (lookAheadChar === "\u0654" || lookAheadChar === "\u0655" || lookAheadChar === "\u200C") continue;
        if (/\s/.test(lookAheadChar)) break;
        if (/[\u0621-\u06ED]/.test(lookAheadChar)) { isLast = false; break; }
      }

      if (char === "ٮ" && !hasFloatingHamza) {
        val = 0;
      } else {
        val = isLast ? 10 : 1;
      }
      if (hasFloatingHamza) {
        desc += inputStripped.charAt(i+1);
        i += 1;
      }
    } else if (char === "ء" || char === "\u0654" || char === "\u0655") {
      val = ignoreHamzah ? 0 : 1;
    } else if (char === "ب" || char === "پ") {
      val = 2;
    } else if (char === "ج" || char === "چ") {
      val = 3;
    } else if (char === "د") {
      val = 4;
    } else if ("ةۀہھەﻫﻬﻪﺔ".includes(char) || char === "ه") {
      val = 5;
    } else if (char === "و" || char === "ؤ") {
      val = 6;
    } else if (char === "ز" || char === "ژ") {
      val = 7;
    } else if (char === "ح") {
      val = 8;
    } else if (char === "ط") {
      val = 9;
    } else if ("یىيے".includes(char)) {
      val = 10;
    } else if ("کگكڪ".includes(char)) {
      val = 20;
    } else if (char === "ل") {
      val = 30;
    } else if (char === "م") {
      val = 40;
    } else if (char === "ن" || char === "ں") {
      val = 50;
    } else if (char === "س") {
      val = maghribiOrder ? 300 : 60;
    } else if (char === "ع") {
      val = 70;
    } else if (char === "ف" || char === "ڡ") {
      val = 80;
    } else if (char === "ص") {
      val = maghribiOrder ? 60 : 90;
    } else if (char === "ق" || char === "ٯ") {
      val = 100;
    } else if (char === "ر") {
      val = 200;
    } else if (char === "ش") {
      val = maghribiOrder ? 1000 : 300;
    } else if (char === "ت") {
      val = 400;
    } else if (char === "ث") {
      val = 500;
    } else if (char === "خ") {
      val = 600;
    } else if (char === "ذ") {
      val = 700;
    } else if (char === "ض") {
      val = maghribiOrder ? 90 : 800;
    } else if (char === "ظ") {
      val = maghribiOrder ? 800 : 900;
    } else if (char === "غ") {
      val = maghribiOrder ? 900 : 1000;
    } else if (char === "\u200C" || /\s/.test(char)) {
      continue;
    } else {
      val = 0;
      desc = `[UNK:${char.charCodeAt(0).toString(16)}]`;
    }
    
    total += val;
    if (val > 0) breakdown.push({ char: desc, val });
  }

  return { total, breakdown };
}

const text = "قَالَ اخۡرُجۡ مِنۡهَا مَذۡءُوۡمًا مَّدۡحُوۡرًا ‌ؕ لَمَنۡ تَبِعَكَ مِنۡهُمۡ لَاَمۡلَــٴَــنَّ جَهَنَّمَ مِنۡكُمۡ اَجۡمَعِيۡنَ";
const result = getAbjadDetailed(text, false, false);

console.log(`Text: ${text}`);
console.log(`Detailed Breakdown:`);
result.breakdown.forEach(item => {
  console.log(`${item.char}: ${item.val}`);
});
console.log(`Total Calculated: ${result.total}`);
console.log(`Expected in File: 3399`);
console.log(`Difference: ${3399 - result.total}`);
