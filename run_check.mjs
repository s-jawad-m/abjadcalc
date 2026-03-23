import fs from 'fs';

// from ts/lib.ts, manually stripped of TS types
function getAbjad(input, maghribiOrder, ignoreHamzah) {
  const inputStripped = input.replace(/[\u0640\u064B-\u0653\u0656-\u065F\u0670\u06D6-\u06ED]/g, "");
  let total = 0;
  let unrecognizedChars = false;

  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);

    if (char === "ا" || char === "آ" || char === "أ" || char === "إ" || char === "ٱ") {
      total += 1;
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
        if (lookAheadChar === "\u0654" || lookAheadChar === "\u0655" || lookAheadChar === "\u200C") {
          continue;
        }
        if (/\s/.test(lookAheadChar)) {
          break;
        }
        if (/[\u0621-\u06ED]/.test(lookAheadChar)) {
          isLast = false;
        }
        break;
      }

      if (char === "ٮ" && !hasFloatingHamza) {
        total += 0;
      } else {
        if (isLast) {
          total += 10;
        } else {
          total += 1;
        }
      }

      if (hasFloatingHamza) {
        i += 1;
      }
    } else if (char === "ء" || char === "\u0654" || char === "\u0655") {
      if (ignoreHamzah) {
        continue;
      } else {
        total += 1;
      }
    } else if (char === "ب" || char === "پ") {
      total += 2;
    } else if (char === "ج" || char === "چ") {
      total += 3;
    } else if (char === "د") {
      total += 4;
    } else if (
      char === "ه" || char === "ة" || char === "ۀ" || char === "ہ" ||
      char === "ھ" || char === "ە" || char === "ﻫ" || char === "ﻬ" ||
      char === "ﻪ" || char === "ﺔ"
    ) {
      total += 5;
    } else if (char === "و" || char === "ؤ") {
      total += 6;
    } else if (char === "ز" || char === "ژ") {
      total += 7;
    } else if (char === "ح") {
      total += 8;
    } else if (char === "ط") {
      total += 9;
    } else if (char === "ی" || char === "ى" || char === "ي" || char === "ے") {
      total += 10;
    } else if (char === "ک" || char === "گ" || char === "ك" || char === "ڪ") {
      total += 20;
    } else if (char === "ل") {
      total += 30;
    } else if (char === "م") {
      total += 40;
    } else if (char === "ن" || char === "ں") {
      total += 50;
    } else if (char === "س") {
      if (maghribiOrder) total += 300; else total += 60;
    } else if (char === "ع") {
      total += 70;
    } else if (char === "ف" || char === "ڡ") {
      total += 80;
    } else if (char === "ص") {
      if (maghribiOrder) total += 60; else total += 90;
    } else if (char === "ق" || char === "ٯ") {
      total += 100;
    } else if (char === "ر") {
      total += 200;
    } else if (char === "ش") {
      if (maghribiOrder) total += 1000; else total += 300;
    } else if (char === "ت") {
      total += 400;
    } else if (char === "ث") {
      total += 500;
    } else if (char === "خ") {
      total += 600;
    } else if (char === "ذ") {
      total += 700;
    } else if (char === "ض") {
      if (maghribiOrder) total += 90; else total += 800;
    } else if (char === "ظ") {
      if (maghribiOrder) total += 800; else total += 900;
    } else if (char === "غ") {
      if (maghribiOrder) total += 900; else total += 1000;
    } else if (char === "\u200C" || /\s/.test(char)) {
      continue;
    } else {
      unrecognizedChars = true;
      continue;
    }
  }

  return [total, unrecognizedChars];
}

const content = fs.readFileSync('surah_al_Araf.txt', 'utf8');
const lines = content.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed) continue;

  // Format is typically: text <verseNumber>۞<adadValue>
  // e.g., الۤمّۤصۤ 1۞161
  const match = trimmed.match(/^(.*?)\s+(\d+)\s*۞\s*(\d+)$/);
  if (match) {
    const text = match[1];
    const verseNo = match[2];
    const expectedAdad = parseInt(match[3], 10);
    
    // Using default options: maghribiOrder = false, ignoreHamzah = false
    const [calculatedAdad, unrecog] = getAbjad(text, false, false);
    
    if (calculatedAdad !== expectedAdad) {
      console.log(`Verse ${verseNo}: calculated ${calculatedAdad}, expected ${expectedAdad}`);
    } else {
      console.log(`Verse ${verseNo}: Adad matches (${expectedAdad})`);
    }
  } else {
    // maybe check if the line has ۞ symbol without space before number?
    const match2 = trimmed.match(/^(.*?)\s*(\d+)۞(\d+)$/);
    if (match2) {
      const text = match2[1];
      const verseNo = match2[2];
      const expectedAdad = parseInt(match2[3], 10);
      const [calculatedAdad, unrecog] = getAbjad(text, false, false);
      if (calculatedAdad !== expectedAdad) {
        console.log(`Verse ${verseNo}: calculated ${calculatedAdad}, expected ${expectedAdad}`);
      } else {
        console.log(`Verse ${verseNo}: Adad matches (${expectedAdad})`);
      }
    } else {
      console.log(`Skipping invalid line: ${trimmed.slice(0, 30)}...`);
    }
  }
}
