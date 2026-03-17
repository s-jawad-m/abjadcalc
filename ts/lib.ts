export function getAbjad(
  input: string,
  maghribiOrder: boolean,
  ignoreHamzah: boolean,
): [number, boolean] {
  // Strip diacritics/marks that don't count towards abjad
  const inputStripped = input.replace(/[\u064B-\u065F\u0670]/g, "");

  // Define a total to keep track of the abjad value
  let total = 0;

  let unrecognizedChars = false;

  // Run through the stripped input, one character at a time
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
      // Check if this is the last letter of a word.
      // A word boundary is whitespace, ZWNJ, or end of string.
      let isLast = true;
      for (let j = i + 1; j < inputStripped.length; j += 1) {
        const nextChar = inputStripped.charAt(j);
        if (/\s/.test(nextChar) || nextChar === "\u200C") {
          break;
        }
        // If we find any other character, it's not the last letter of the word
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
    } else if (
      char === "ه" ||
      char === "ة" ||
      char === "ۀ" ||
      char === "ہ" // U+06C1
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
      if (maghribiOrder) {
        total += 300;
      } else {
        total += 60;
      }
    } else if (char === "ع") {
      total += 70;
    } else if (char === "ف") {
      total += 80;
    } else if (char === "ص") {
      if (maghribiOrder) {
        total += 60;
      } else {
        total += 90;
      }
    } else if (char === "ق") {
      total += 100;
    } else if (char === "ر") {
      total += 200;
    } else if (char === "ش") {
      if (maghribiOrder) {
        total += 1000;
      } else {
        total += 300;
      }
    } else if (char === "ت") {
      total += 400;
    } else if (char === "ث") {
      total += 500;
    } else if (char === "خ") {
      total += 600;
    } else if (char === "ذ") {
      total += 700;
    } else if (char === "ض") {
      if (maghribiOrder) {
        total += 90;
      } else {
        total += 800;
      }
    } else if (char === "ظ") {
      if (maghribiOrder) {
        total += 800;
      } else {
        total += 900;
      }
    } else if (char === "غ") {
      if (maghribiOrder) {
        total += 900;
      } else {
        total += 1000;
      }
    } else if (char === "\u200C" || /\s/.test(char)) {
      continue;
    } else {
      unrecognizedChars = true;
      continue;
    }
  }

  return [total, unrecognizedChars];
}

export function getResult(
  inputField: HTMLInputElement,
  resultField: HTMLElement,
  maghribiCheckbox: HTMLInputElement,
  hamzahCheckbox: HTMLInputElement,
) {
  const input = inputField.value;
  const maghribiOrder = maghribiCheckbox.checked;
  const ignoreHamzah = hamzahCheckbox.checked;

  const [total, unrecognizedChars] = getAbjad(
    input,
    maghribiOrder,
    ignoreHamzah,
  );

  const inputForDisplay = input.replace(/\s+/g, " ").trim();

  let resultText = unrecognizedChars
    ? "At least one of the characters entered was not recognized and has been ignored.<br>That said, the computed <em>abjad</em> value of <span class='replay-input' dir='rtl' lang='ar'>«" +
      inputForDisplay +
      "»</span> is"
    : "The total <em>abjad</em> value of <span class='replay-input' dir='rtl' lang='ar'>«" +
      inputForDisplay +
      "»</span> is";

  resultText += " " + total + ".";

  resultField.innerHTML = resultText;
  inputField.blur();
}
