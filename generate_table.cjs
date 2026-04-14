const fs = require('fs');
const path = require('path');

// 1. The complete list of 114 Surahs in standard order
const surahNames = [
  "Al-Fatihah", "Al-Baqarah", "Al 'Imran", "An-Nisa'", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra'", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya'", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara'", "An-Naml", "Al-Qasas", "Al-'Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba'", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Ad-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba'", "An-Nazi'at", "'Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-'Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-'Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-'Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

// 2. Your exact counting logic translated to pure JS
function getAbjad(input, ignoreHamzah, shamsiOrder = false) {
  const inputStripped = input.replace(
    /[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]/g,
    ""
  );

  let total = 0;
  let unrecognizedChars = false;
  let aatishi = 0; 
  let baadi = 0;   
  let aabi = 0;    
  let khaki = 0;   

  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);

    if (
      char === "ا" || char === "آ" || char === "أ" ||
      char === "إ" || char === "ٱ" || char === "\ufe8e"
    ) {
      total += 1;
      aatishi++;
    } else if (
      char === "ئ" || char === "ٮ" || char === "ی" ||
      char === "ى" || char === "ي" || char === "ے"
    ) {
      let hasFloatingHamza = false;
      if (i + 1 < inputStripped.length) {
        const nextChar = inputStripped.charAt(i + 1);
        if (nextChar === "\u0654" || nextChar === "\u0655" || nextChar === "\u0674") {
          hasFloatingHamza = true;
        }
      }

      const isPositional = (char === "ئ" || hasFloatingHamza);
      let isLast = true;

      if (isPositional) {
        for (let j = i + 1; j < inputStripped.length; j += 1) {
          const lookAheadChar = inputStripped.charAt(j);
          if (
            lookAheadChar === "\u0654" || lookAheadChar === "\u0655" ||
            lookAheadChar === "\u0674" || lookAheadChar === "\u200C" ||
            lookAheadChar === "\u06E6" || lookAheadChar === "ـ"
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

      if (char === "ٮ" && !hasFloatingHamza) {
        total += 0;
      } else if (isPositional) {
        const endValue = shamsiOrder ? 1000 : 10;
        total += isLast ? endValue : 1;
      } else {
        total += shamsiOrder ? 1000 : 10;
      }
      baadi++;

      if (hasFloatingHamza) {
        i += 1;
      }
    } else if (char === "ء" || char === "\u0674"  || char === "\u0654" || char === "\u0655") {                    
      if (ignoreHamzah) {
        continue;
      } else {
        total += 1;
        aatishi++;
      }
    } else if (char === "\u06E6") {
      total += shamsiOrder ? 1000 : 10;
      baadi++;
    } else if (char === "ب" || char === "پ") {
      total += 2;
      baadi++;
    } else if (char === "ج" || char === "چ") {
      total += shamsiOrder ? 5 : 3;
      aabi++;
    } else if (char === "د") {
      total += shamsiOrder ? 8 : 4;
      khaki++;
    } else if (
      char === "ه" || char === "ة" || char === "ۀ" ||
      char === "ہ" || char === "ھ" || char === "ە" ||
      char === "ﻫ" || char === "ﻬ" || char === "ﻪ" || char === "ﺔ"
    ) {
      total += shamsiOrder ? 900 : 5;
      aatishi++;
    } else if (char === "و" || char === "ؤ") {
      total += shamsiOrder ? 800 : 6;
      baadi++;
    } else if (char === "ز" || char === "ژ") {
      total += shamsiOrder ? 20 : 7;
      aabi++;
    } else if (char === "ح") {
      total += shamsiOrder ? 6 : 8;
      khaki++;
    } else if (char === "ط") {
      total += shamsiOrder ? 70 : 9;
      aatishi++;
    } else if (char === "ک" || char === "گ" || char === "ك" || char === "ڪ") {
      total += shamsiOrder ? 400 : 20;
      aabi++;
    } else if (char === "ل") {
      total += shamsiOrder ? 500 : 30;
      khaki++;
    } else if (char === "م") {
      total += shamsiOrder ? 600 : 40;
      aatishi++;
    } else if (char === "ن" || char === "ں") {
      total += shamsiOrder ? 700 : 50;
      baadi++;
    } else if (char === "س") {
      total += shamsiOrder ? 30 : 60;
      aabi++;
    } else if (char === "ع") {
      total += shamsiOrder ? 90 : 70;
      khaki++;
    } else if (char === "ف" || char === "ڡ") {
      total += shamsiOrder ? 200 : 80;
      aatishi++;
    } else if (char === "ص") {
      total += shamsiOrder ? 50 : 90;
      baadi++;
    } else if (char === "ق" || char === "ٯ") {
      total += shamsiOrder ? 300 : 100;
      aabi++;
    } else if (char === "ر") {
      total += shamsiOrder ? 10 : 200;
      khaki++;
    } else if (char === "ش") {
      total += shamsiOrder ? 40 : 300;
      aatishi++;
    } else if (char === "ت") {
      total += shamsiOrder ? 3 : 400;
      baadi++;
    } else if (char === "ث") {
      total += shamsiOrder ? 4 : 500;
      aabi++;
    } else if (char === "خ") {
      total += shamsiOrder ? 7 : 600;
      khaki++;
    } else if (char === "ذ") {
      total += shamsiOrder ? 9 : 700;
      aatishi++;
    } else if (char === "ض") {
      total += shamsiOrder ? 60 : 800;
      baadi++;
    } else if (char === "ظ") {
      total += shamsiOrder ? 80 : 900;
      aabi++;
    } else if (char === "غ") {
      total += shamsiOrder ? 100 : 1000;
      khaki++;
    } else if (char === "\u200C" || char === "ـ" || /\s/.test(char)) {
      continue;
    } else {
      unrecognizedChars = true;
      continue;
    }
  }

  return { aatishi, baadi, aabi, khaki };
}

// 3. Smart Normalizer to match filenames to standard names
function normalizeName(str) {
  return str.toLowerCase()
    .replace(/^surah_/, '')           // Remove surah_ prefix
    .replace(/\.txt$/, '')            // Remove .txt extension
    .replace(/^(al_|an_|ar_|as_|at_|az_|ad_|ash_)/, '') // Remove Arabic articles
    .replace(/[^a-z]/g, '');          // Strip spaces, dashes, underscores, apostrophes
}

// 4. Execution logic
const folderPath = path.join(__dirname, 'all_quran_surahs_114');

console.log("| Number | Surah Name | 🔥 Atashi (Fire) | 💨 Baadi (Air) | 💧 Aabi (Water) | 🌍 Khaki (Earth) |");
console.log("| :--- | :--- | :--- | :--- | :--- | :--- |");

try {
  if (!fs.existsSync(folderPath)) {
    console.error("Error: The directory 'all_quran_surahs_114' was not found.");
    process.exit(1);
  }

  // Get all files
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.txt'));

  // Iterate through the standard 114 list in order
  surahNames.forEach((standardName, index) => {
    const surahNumber = index + 1;
    const normalizedStandard = normalizeName(standardName);
    
    // Find the file that best matches the current standard Surah name
    const matchedFile = files.find(file => {
        // Handle specific spelling quirks from your system if normalization isn't enough
        if (normalizedStandard === 'imran' && file.includes('aal_e_imran')) return true;
        if (normalizedStandard === 'taha' && file.includes('taahaa')) return true;
        
        return normalizeName(file) === normalizedStandard;
    });

    if (matchedFile) {
      const filePath = path.join(folderPath, matchedFile);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const elements = getAbjad(content, false);
      
      console.log(`| ${surahNumber} | ${standardName} | ${elements.aatishi} | ${elements.baadi} | ${elements.aabi} | ${elements.khaki} |`);
    } else {
      // If the normalizer fails to find a file, it will flag it so you can correct the spelling manually
      console.log(`| ${surahNumber} | ${standardName} | MISSING FILE | - | - | - |`);
    }
  });

} catch (err) {
  console.error("An error occurred while processing the files:", err);
}