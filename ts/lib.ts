export function getAbjad(
  input: string,
  maghribiOrder: boolean,
  ignoreHamzah: boolean,
): [number, boolean] {
  // Split the final range to explicitly preserve \u06E6 (Arabic Small Yeh)
  const inputStripped = input.replace(
    /[\u0640\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]/g,
    "",
  );

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
    } else if (
      char === "ئ" || 
      char === "ٮ" || 
      char === "ی" || 
      char === "ى" || 
      char === "ي" || 
      char === "ے"
    ) {
      // 1. Check for a floating Hamza immediately following
      let hasFloatingHamza = false;
      if (i + 1 < inputStripped.length) {
        const nextChar = inputStripped.charAt(i + 1);
        if (nextChar === "\u0654" || nextChar === "\u0655") {
          hasFloatingHamza = true;
        }
      }

      // 2. Determine if positional math is required
      const isPositional = (char === "ئ" || char === "ی" || hasFloatingHamza);
      let isLast = true;

      // 3. Only run the deep look-ahead if the character needs it
      if (isPositional) {
        for (let j = i + 1; j < inputStripped.length; j += 1) {
          const lookAheadChar = inputStripped.charAt(j);
          
          if (
            lookAheadChar === "\u0654" ||
            lookAheadChar === "\u0655" ||
            lookAheadChar === "\u200C"
          ) {
            continue;
          }
          
          if (/\s/.test(lookAheadChar)) break;
          
          if (/[\u0621-\u06ED]/.test(lookAheadChar)) {
            isLast = false;
            break;
          }
        }
      }

      // 4. APPLY RULES
      if (char === "ٮ" && !hasFloatingHamza) {
        total += 0;
      } else if (isPositional) {
        total += isLast ? 10 : 1;
      } else {
        total += 10;
      }

      // 5. Fast-forward the loop past the floating Hamza
      if (hasFloatingHamza) {
        i += 1;
      }
    } else if (char === "ء" || char === "\u0674"  || char === "\u0654" || char === "\u0655") {                    
      if (ignoreHamzah) {
        continue;
      } else {
        total += 1;
      }
    } else if (char === "\u06E6") {
      // Arabic Small Yeh (ۦ)
      total += 10;
    } else if (char === "ب" || char === "پ") {
      total += 2;
    } else if (char === "ج" || char === "چ") {
      total += 3;
    } else if (char === "د") {
      total += 4;
    } else if (
      char === "ه" || // U+0647: Arabic Letter Heh
      char === "ة" || // U+0629: Teh Marbuta
      char === "ۀ" || // U+06C0: Heh with Yeh Above
      char === "ہ" || // U+06C1: Heh Goal
      char === "ھ" || // U+06BE: Heh Doachashmee
      char === "ە" || // U+06D5: Arabic Letter Ae
      char === "ﻫ" || // U+FEEB: Isolated Form
      char === "ﻬ" || // U+FEEC: Initial Form
      char === "ﻪ" || // U+FEEA: Terminal Form
      char === "ﺔ" // U+FE94: Teh Marbuta Terminal
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
    } else if (char === "ک" || char === "گ" || char === "ك" || char === "ڪ") {
      total += 20;
    } else if (char === "ل") {
      total += 30;
    } else if (char === "م") {
      total += 40;
    } else if (char === "ن" || char === "ں") {
      total += 50;
    } else if (char === "س") {
      if (maghribiOrder) {
        total += 300;
      } else {
        total += 60;
      }
    } else if (char === "ع") {
      total += 70;
    } else if (char === "ف" || char === "ڡ") {
      total += 80;
    } else if (char === "ص") {
      if (maghribiOrder) {
        total += 60;
      } else {
        total += 90;
      }
    } else if (char === "ق" || char === "ٯ") {
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
