const fs = require('fs');
const path = require('path');

// 1. Explicitly mapped in actual Quranic Order (1-114) using your exact filenames
const quranFiles = [
  { num: 1, file: "surah_aadiat.txt" },
  { num: 2, file: "surah_aal_e_imran.txt" },
  { num: 3, file: "surah_abasa.txt" },
  { num: 4, file: "surah_ahqaf.txt" },
  { num: 5, file: "surah_alaq.txt" },
  { num: 6, file: "surah_al_aala.txt" },
  { num: 7, file: "surah_al_ahzab.txt" },
  { num: 8, file: "surah_al_anam.txt" },
  { num: 9, file: "surah_al_anfal.txt" },
  { num: 10, file: "surah_al_Araf.txt" },
  { num: 11, file: "surah_al_insan.txt" },
  { num: 12, file: "surah_ambiya.txt" },
  { num: 13, file: "surah_ankabut.txt" },
  { num: 14, file: "surah_an_nisa.txt" },
  { num: 15, file: "surah_asr.txt" },
  { num: 16, file: "surah_balad.txt" },
  { num: 17, file: "surah_baqarah.txt" },
  { num: 18, file: "surah_bayyinah.txt" },
  { num: 19, file: "surah_burooj.txt" },
  { num: 20, file: "surah_dhukhan.txt" },
  { num: 21, file: "surah_fajr.txt" },
  { num: 22, file: "surah_falaq.txt" },
  { num: 23, file: "surah_fatha.txt" },
  { num: 24, file: "surah_fatiha.txt" },
  { num: 25, file: "surah_fatir.txt" },
  { num: 26, file: "surah_feel.txt" },
  { num: 27, file: "surah_furqan.txt" },
  { num: 28, file: "surah_fussilat.txt" },
  { num: 29, file: "surah_ghafir.txt" },
  { num: 30, file: "surah_ghashia.txt" },
  { num: 31, file: "surah_haaqah.txt" },
  { num: 32, file: "surah_hadeed.txt" },
  { num: 33, file: "surah_hajj.txt" },
  { num: 34, file: "surah_hajr.txt" },
  { num: 35, file: "surah_hashr.txt" },
  { num: 36, file: "surah_hijrat.txt" },
  { num: 37, file: "surah_hood.txt" },
  { num: 38, file: "surah_humaza.txt" },
  { num: 39, file: "surah_ibrahim.txt" },
  { num: 40, file: "surah_ikhlaas.txt" },
  { num: 41, file: "surah_infitaar.txt" },
  { num: 42, file: "surah_inshifaaq.txt" },
  { num: 43, file: "surah_israel.txt" },
  { num: 44, file: "surah_jaisia.txt" },
  { num: 45, file: "surah_jinn.txt" },
  { num: 46, file: "surah_jumah.txt" },
  { num: 47, file: "surah_kafiroon.txt" },
  { num: 48, file: "surah_kahf.txt" },
  { num: 49, file: "surah_kalam.txt" },
  { num: 50, file: "surah_kausar.txt" },
  { num: 51, file: "surah_layl.txt" },
  { num: 52, file: "surah_luqman.txt" },
  { num: 53, file: "surah_maaoon.txt" },
  { num: 54, file: "surah_maidah.txt" },
  { num: 55, file: "surah_majadilah.txt" },
  { num: 56, file: "surah_maryam.txt" },
  { num: 57, file: "surah_masad.txt" },
  { num: 58, file: "surah_miraj.txt" },
  { num: 59, file: "surah_mohammad.txt" },
  { num: 60, file: "surah_mominoon.txt" },
  { num: 61, file: "surah_mudassir.txt" },
  { num: 62, file: "surah_mulk.txt" },
  { num: 63, file: "surah_mumtahina.txt" },
  { num: 64, file: "surah_munafikoon.txt" },
  { num: 65, file: "surah_mursalat.txt" },
  { num: 66, file: "surah_mutafifeen.txt" },
  { num: 67, file: "surah_muzammil.txt" },
  { num: 68, file: "surah_naas.txt" },
  { num: 69, file: "surah_naba.txt" },
  { num: 70, file: "surah_nahl.txt" },
  { num: 71, file: "surah_najm.txt" },
  { num: 72, file: "surah_naml.txt" },
  { num: 73, file: "surah_nasr.txt" },
  { num: 74, file: "surah_naziat.txt" },
  { num: 75, file: "surah_nooh.txt" },
  { num: 76, file: "surah_noor.txt" },
  { num: 77, file: "surah_qaaf.txt" },
  { num: 78, file: "surah_qadr.txt" },
  { num: 79, file: "surah_qamr.txt" },
  { num: 80, file: "surah_qariah.txt" },
  { num: 81, file: "surah_qasas.txt" },
  { num: 82, file: "surah_qiyama.txt" },
  { num: 83, file: "surah_quraysh.txt" },
  { num: 84, file: "surah_raad.txt" },
  { num: 85, file: "surah_rahman.txt" },
  { num: 86, file: "surah_room.txt" },
  { num: 87, file: "surah_saad.txt" },
  { num: 88, file: "surah_saafaath.txt" },
  { num: 89, file: "surah_saba.txt" },
  { num: 90, file: "surah_saf.txt" },
  { num: 91, file: "surah_sajdah.txt" },
  { num: 92, file: "surah_shams.txt" },
  { num: 93, file: "surah_sharaa.txt" },
  { num: 94, file: "surah_sharha.txt" },
  { num: 95, file: "surah_shoori.txt" },
  { num: 96, file: "surah_taghabun.txt" },
  { num: 97, file: "surah_taha.txt" },
  { num: 98, file: "surah_tahreem.txt" },
  { num: 99, file: "surah_takasur.txt" },
  { num: 100, file: "surah_takweer.txt" },
  { num: 101, file: "surah_talaq.txt" },
  { num: 102, file: "surah_tariq.txt" },
  { num: 103, file: "surah_tauba.txt" },
  { num: 104, file: "surah_teen.txt" },
  { num: 105, file: "surah_toor.txt" },
  { num: 106, file: "surah_waqia.txt" },
  { num: 107, file: "surah_yaseen.txt" },
  { num: 108, file: "surah_younus.txt" },
  { num: 109, file: "surah_yousuf.txt" },
  { num: 110, file: "surah_zalzala.txt" },
  { num: 111, file: "surah_zamoor.txt" },
  { num: 112, file: "surah_zariyat.txt" },
  { num: 113, file: "surah_zuha.txt" },
  { num: 114, file: "surah_zukhraf.txt" },
];

// 2. Your exact counting logic (unchanged)
function getAbjad(input, ignoreHamzah, shamsiOrder = false) {
  const inputStripped = input.replace(/[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]/g, "");
  let aatishi = 0; let baadi = 0; let aabi = 0; let khaki = 0;   

  for (let i = 0; i < inputStripped.length; i += 1) {
    const char = inputStripped.charAt(i);
    if (["ا", "آ", "أ", "إ", "ٱ", "\ufe8e"].includes(char)) { aatishi++; } 
    else if (["ئ", "ٮ", "ی", "ى", "ي", "ے"].includes(char)) {
      let hasFloatingHamza = (i + 1 < inputStripped.length && ["\u0654", "\u0655", "\u0674"].includes(inputStripped.charAt(i + 1)));
      baadi++; if (hasFloatingHamza) i++;
    } 
    else if (["ء", "\u0674", "\u0654", "\u0655"].includes(char)) { if (!ignoreHamzah) aatishi++; } 
    else if (char === "\u06E6") { baadi++; } 
    else if (char === "ب" || char === "پ") { baadi++; } 
    else if (char === "ج" || char === "چ") { aabi++; } 
    else if (char === "د") { khaki++; } 
    else if (["ه","ة","ۀ","ہ","ھ","ە","ﻫ","ﻬ","ﻪ","ﺔ"].includes(char)) { aatishi++; } 
    else if (char === "و" || char === "ؤ") { baadi++; } 
    else if (char === "ز" || char === "ژ") { aabi++; } 
    else if (char === "ح") { khaki++; } 
    else if (char === "ط") { aatishi++; } 
    else if (["ک","گ","ك","ڪ"].includes(char)) { aabi++; } 
    else if (char === "ل") { khaki++; } 
    else if (char === "م") { aatishi++; } 
    else if (char === "ن" || char === "ں") { baadi++; } 
    else if (char === "س") { aabi++; } 
    else if (char === "ع") { khaki++; } 
    else if (char === "ف" || char === "ڡ") { aatishi++; } 
    else if (char === "ص") { baadi++; } 
    else if (char === "ق" || char === "ٯ") { aabi++; } 
    else if (char === "ر") { khaki++; } 
    else if (char === "ش") { aatishi++; } 
    else if (char === "ت") { baadi++; } 
    else if (char === "ث") { aabi++; } 
    else if (char === "خ") { khaki++; } 
    else if (char === "ذ") { aatishi++; } 
    else if (char === "ض") { baadi++; } 
    else if (char === "ظ") { aabi++; } 
    else if (char === "غ") { khaki++; }
  }
  return { aatishi, baadi, aabi, khaki };
}

// 3. Execution logic
const folderPath = path.join(__dirname, 'all_quran_surahs_114');

console.log("| Number | Surah Name | 🔥 Atashi (Fire) | 💨 Baadi (Air) | 💧 Aabi (Water) | 🌍 Khaki (Earth) |");
console.log("| :--- | :--- | :--- | :--- | :--- | :--- |");

try {
  if (!fs.existsSync(folderPath)) {
    console.error("Error: Folder not found.");
    process.exit(1);
  }

  quranFiles.forEach((surah) => {
    const filePath = path.join(folderPath, surah.file);
    
    // Check if the file mapped in the array actually exists
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const elements = getAbjad(content, false);
      console.log(`| ${surah.num} | ${surah.name} | ${elements.aatishi} | ${elements.baadi} | ${elements.aabi} | ${elements.khaki} |`);
    } else {
      console.log(`| ${surah.num} | ${surah.name} | MISSING FILE | - | - | - |`);
    }
  });

} catch (err) {
  console.error("An error occurred:", err);
}