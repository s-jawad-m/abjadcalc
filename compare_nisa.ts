import { getAbjad } from "./ts/lib.ts";
import fs from "fs";

const content = fs.readFileSync("surah_an_nisa_sm_text.txt", "utf8");

// Regular expression to find "AyatNum ۞ Adad"
// It looks for a number, followed by optional whitespace, then ۞, then another number.
const ayatRegex = /(\d+)\s*۞\s*(\d+)/g;

let match;
let lastIndex = 0;
const results: { ayat: number; expected: number; calculated: number; text: string }[] = [];

while ((match = ayatRegex.exec(content)) !== null) {
  const ayatNum = parseInt(match[1]);
  const expectedAdad = parseInt(match[2]);
  
  // The text for this ayat is everything between the previous match and this match
  const text = content.substring(lastIndex, match.index).trim();
  
  const [calculatedAdad, unrecognized] = getAbjad(text, false, false);
  
  results.push({
    ayat: ayatNum,
    expected: expectedAdad,
    calculated: calculatedAdad,
    unrecognized: unrecognized,
    text: text
  });
  
  lastIndex = ayatRegex.lastIndex;
}

const mismatches = results.filter(r => r.expected !== r.calculated);

console.log(`Processed ${results.length} ayats.`);

if (mismatches.length === 0) {
  console.log("All ayat match perfectly!");
} else {
  console.log(`Found ${mismatches.length} mismatches:\n`);
  mismatches.forEach(m => {
    console.log(`Ayat ${m.ayat}:`);
    console.log(`  Expected:   ${m.expected}`);
    console.log(`  Calculated: ${m.calculated}`);
    console.log(`  Difference: ${m.calculated - m.expected}`);
    console.log(`  Text Length: ${m.text.length}`);
    console.log(`  Newlines: ${(m.text.match(/\n/g) || []).length}`);
    console.log(`  Unrecognized: ${m.unrecognized}`);
    // console.log(`  Text: ${m.text}`);
    console.log("--------------------");
  });
}
