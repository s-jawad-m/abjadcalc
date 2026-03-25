export function getAbjad(
  input: string,
  ignoreHamzah: boolean,
  shamsiOrder: boolean = false
): [number, boolean] {
  // Removed \u0640 to preserve the Tatweel (ـ) as an invisible buffer
  const inputStripped = input.replace(
    /[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]/g,
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
        // Included \u0674 (High Hamza)
        if (nextChar === "\u0654" || nextChar === "\u0655" || nextChar === "\u0674") {
          hasFloatingHamza = true;
        }
      }

      // 2. Determine if positional math is required
      // Removed `char === "ی"` so all plain Yas get 10 points
      const isPositional = (char === "ئ" || hasFloatingHamza);
      let isLast = true;

      if (isPositional) {
        for (let j = i + 1; j < inputStripped.length; j += 1) {
          const lookAheadChar = inputStripped.charAt(j);
          
          // Added the Tatweel (ـ) so the loop looks past it
          if (
            lookAheadChar === "\u0654" ||
            lookAheadChar === "\u0655" ||
            lookAheadChar === "\u0674" || 
            lookAheadChar === "\u200C" ||
            lookAheadChar === "\u06E6" ||
            lookAheadChar === "ـ" 
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
        // Only triggers if it's ئ, the specific character ی, or has a floating Hamza
        const endValue = shamsiOrder ? 1000 : 10;
        total += isLast ? endValue : 1;
      } else {
        // ALL other plain Yas (ي, ى, ے) bypass the loop and get 10 regardless of position
        total += shamsiOrder ? 1000 : 10;
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
      total += shamsiOrder ? 1000 : 10;
    } else if (char === "ب" || char === "پ") {
      total += 2;
    } else if (char === "ج" || char === "چ") {
      total += shamsiOrder ? 5 : 3;
    } else if (char === "د") {
      total += shamsiOrder ? 8 : 4;
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
      total += shamsiOrder ? 900 : 5;
    } else if (char === "و" || char === "ؤ") {
      total += shamsiOrder ? 800 : 6;
    } else if (char === "ز" || char === "ژ") {
      total += shamsiOrder ? 20 : 7;
    } else if (char === "ح") {
      total += shamsiOrder ? 6 : 8;
    } else if (char === "ط") {
      total += shamsiOrder ? 70 : 9;
    } else if (char === "ک" || char === "گ" || char === "ك" || char === "ڪ") {
      total += shamsiOrder ? 400 : 20;
    } else if (char === "ل") {
      total += shamsiOrder ? 500 : 30;
    } else if (char === "م") {
      total += shamsiOrder ? 600 : 40;
    } else if (char === "ن" || char === "ں") {
      total += shamsiOrder ? 700 : 50;
    } else if (char === "س") {
      total += shamsiOrder ? 30 : 60;
    } else if (char === "ع") {
      total += shamsiOrder ? 90 : 70;
    } else if (char === "ف" || char === "ڡ") {
      total += shamsiOrder ? 200 : 80;
    } else if (char === "ص") {
      total += shamsiOrder ? 50 : 90;
    } else if (char === "ق" || char === "ٯ") {
      total += shamsiOrder ? 300 : 100;
    } else if (char === "ر") {
      total += shamsiOrder ? 10 : 200;
    } else if (char === "ش") {
      total += shamsiOrder ? 40 : 300;
    } else if (char === "ت") {
      total += shamsiOrder ? 3 : 400;
    } else if (char === "ث") {
      total += shamsiOrder ? 4 : 500;
    } else if (char === "خ") {
      total += shamsiOrder ? 7 : 600;
    } else if (char === "ذ") {
      total += shamsiOrder ? 9 : 700;
    } else if (char === "ض") {
      total += shamsiOrder ? 60 : 800;
    } else if (char === "ظ") {
      total += shamsiOrder ? 80 : 900;
    } else if (char === "غ") {
      total += shamsiOrder ? 100 : 1000;
    } else if (char === "\u200C" || char === "ـ" || /\s/.test(char)) {
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
  hamzahCheckbox: HTMLInputElement,
  shamsiCheckbox: HTMLInputElement
) {
  const input = inputField.value;
  const ignoreHamzah = hamzahCheckbox.checked;
  const shamsiOrder = shamsiCheckbox ? shamsiCheckbox.checked : false;

  const [total, unrecognizedChars] = getAbjad(
    input,
    ignoreHamzah,
    shamsiOrder,
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