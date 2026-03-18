const getAbjad = (input, maghribiOrder = false, ignoreHamzah = false) => {
  // Strip diacritics/marks that don't count towards abjad
  const inputStripped = input.replace(/[\u064B-\u065F\u0670]/g, "");

  let total = 0;
  let unrecognizedChars = false;

  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);

    if (
      char === "ا" ||
      char === "آ" ||
      char === "أ" ||
      char === "إ" ||
      char === "ٱ"
    ) {
      total += 1;
    } else if (char === "ئ") {
      let isLast = true;
      for (let j = i + 1; j < inputStripped.length; j += 1) {
        const nextChar = inputStripped.charAt(j);
        if (/\s/.test(nextChar) || nextChar === "\u200C") {
          break;
        }
        isLast = false;
        break;
      }
      if (isLast) {
        total += 10;
      } else {
        total += 1;
      }
    } else if (char === "ء") {
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
    } else if (char === "\u200C" || /\s/.test(char)) {
      continue;
    } else {
      unrecognizedChars = true;
      continue;
    }
  }

  return [total, unrecognizedChars];
};

const tests = [
  {
    ayat: 1,
    text: "الم",
    expected: 71,
  },
  {
    ayat: 2,
    text: "ذلك الكتب لا ريب فيه هدى للمتقين", // Used "الكتب" as in some Mushafs, let's see
    expected: 2220,
  },
  {
    ayat: 3,
    text: "الذين يؤمنون بالغيب ويقيمون الصلوة ومما رزقنهم ينفقون",
    expected: 3167,
  },
  {
    ayat: 4,
    text: "والذين يؤمنون بما انزل اليك وما انزل من قبلك وبالاخرة هم يوقنون",
    expected: 2640,
  },
];

console.log("Starting Abjad Comparison...\n");

tests.forEach((test) => {
  const [calculated, unrecognized] = getAbjad(test.text, false, false);
  const status = calculated === test.expected ? "✅ MATCH" : "❌ MISMATCH";
  console.log(`Ayat ${test.ayat}:`);
  console.log(`  Text: ${test.text}`);
  console.log(`  Expected: ${test.expected}`);
  console.log(`  Calculated: ${calculated}`);
  console.log(`  Status: ${status}`);
  if (unrecognized) console.log("  ⚠️ Warning: Unrecognized characters found.");
  console.log("-----------------------------------");
});
