import { getAbjad } from "./ts/lib.ts";
import fs from "fs";

const content = fs.readFileSync("surah_baqarah_sm_text.txt", "utf8");

// We need to strip the numbers and ۞ symbols to get just the Quranic text
// as the user likely pasted the whole thing which would be processed as one string
// but getAbjad would ignore unrecognized numbers and symbols anyway.
// Let's run it exactly as the web app would: on the whole content.

const [total, unrecognized] = getAbjad(content, false, false);

console.log(`Total Abjad of entire file: ${total}`);
console.log(`Unrecognized Chars: ${unrecognized}`);
