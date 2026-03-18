
import { getAbjad } from './ts/lib.ts';
import fs from 'fs';

const content = fs.readFileSync('surah_baqarah_sm_text.txt', 'utf8');
const lines = content.split('\n').filter(line => line.trim().length > 0);

let output = "";

lines.forEach((line) => {
    // Regex matches text followed by "Number ۞ Value"
    const match = line.match(/(.*?)(\d+)\s*۞\s*(\d+)/);
    if (match) {
        const text = match[1].trim();
        const ayatNum = match[2];
        const [total] = getAbjad(text, false, false);
        output += `${ayatNum} : ${total}\n`;
    } else {
        // Fallback for lines that might not match the pattern perfectly but have a number
        const parts = line.split('۞');
        if (parts.length > 1) {
            const text = parts[0].replace(/\d+$/, '').trim();
            const ayatNumMatch = parts[0].match(/(\d+)$/);
            const ayatNum = ayatNumMatch ? ayatNumMatch[1] : 'Unknown';
            const [total] = getAbjad(text, false, false);
            output += `${ayatNum} : ${total}\n`;
        }
    }
});

fs.writeFileSync('baqarah_adad_results.txt', output);
console.log("Results written to baqarah_adad_results.txt");
