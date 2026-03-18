import fs from "fs";

const calcContent = fs.readFileSync("baqarah_adad_results.txt", "utf8");
const existContent = fs.readFileSync("baqarah_existing_values.txt", "utf8");

const parseList = (content: string) => {
  const map = new Map<string, string>();
  content.split("\n").forEach((line) => {
    const [num, val] = line.split(":").map((s) => s.trim());
    if (num && val) map.set(num, val);
  });
  return map;
};

const calcMap = parseList(calcContent);
const existMap = parseList(existContent);

let mismatches = "";
let mismatchCount = 0;

calcMap.forEach((calcVal, num) => {
  const existVal = existMap.get(num);
  if (existVal && calcVal !== existVal) {
    mismatches += `Ayat ${num}: Existing=${existVal}, Calculated=${calcVal}\n`;
    mismatchCount++;
  }
});

if (mismatchCount === 0) {
  console.log("All values match perfectly!");
} else {
  console.log(`Found ${mismatchCount} mismatches:\n`);
  console.log(mismatches);
}
