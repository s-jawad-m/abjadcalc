import { getAbjad } from "./ts/lib.ts";

const verse =
  "هُوَ الَّذِىۡ خَلَقَ لَـكُمۡ مَّا فِى الۡاَرۡضِ جَمِيۡعًا ثُمَّ اسۡتَوٰۤى اِلَى السَّمَآءِ فَسَوّٰٮهُنَّ سَبۡعَ سَمٰوٰتٍ‌ؕ وَهُوَ بِكُلِّ شَىۡءٍ عَلِيۡمٌ";
const [total, unrecognized] = getAbjad(verse, false, false);

console.log(`Verse: ${verse}`);
console.log(`Abjad Value: ${total}`);
console.log(`Unrecognized Chars: ${unrecognized}`);
