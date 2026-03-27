import re
import os
import glob

def get_abjad(input_str, maghribi_order=False, ignore_hamzah=False):
    input_stripped = re.sub(
        r'[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]',
        "",
        input_str
    )
    total = 0
    i = 0
    while i < len(input_stripped):
        char = input_stripped[i]
        if char in ["ا", "آ", "أ", "إ", "ٱ"]:
            total += 1
        elif char in ["ئ", "ٮ", "ی", "ى", "ي", "ے"]:
            has_floating_hamza = False
            if i + 1 < len(input_stripped):
                next_char = input_stripped[i+1]
                if next_char == "\u0654" or next_char == "\u0655" or next_char == "\u0674":
                    has_floating_hamza = True
            is_positional = (char == "ئ" or has_floating_hamza)
            is_last = True
            if is_positional:
                for j in range(i + 1, len(input_stripped)):
                    look_ahead_char = input_stripped[j]
                    if look_ahead_char in ["\u0654", "\u0655", "\u0674", "\u200C", "\u06E6", "ـ"]:
                        continue
                    if look_ahead_char.isspace():
                        break
                    if re.match(r'[\u0621-\u06ED]', look_ahead_char):
                        is_last = False
                        break
            if char == "ٮ" and not has_floating_hamza:
                total += 0
            elif is_positional:
                total += 10 if is_last else 1
            else:
                total += 10
            if has_floating_hamza:
                i += 1
        elif char in ["ء", "\u0674", "\u0654", "\u0655"]:
            if not ignore_hamzah:
                total += 1
        elif char == "\u06E6":
            total += 10
        elif char in ["ب", "پ"]:
            total += 2
        elif char in ["ج", "چ"]:
            total += 3
        elif char == "د":
            total += 4
        elif char in ["ه", "ة", "ۀ", "ہ", "ھ", "ە", "ﻫ", "ﻬ", "ﻪ", "ﺔ"]:
            total += 5
        elif char in ["و", "ؤ"]:
            total += 6
        elif char in ["ز", "ژ"]:
            total += 7
        elif char == "ح":
            total += 8
        elif char == "ط":
            total += 9
        elif char in ["ک", "گ", "ك", "ڪ"]:
            total += 20
        elif char == "ل":
            total += 30
        elif char == "م":
            total += 40
        elif char in ["ن", "ں"]:
            total += 50
        elif char == "س":
            total += 300 if maghribi_order else 60
        elif char == "ع":
            total += 70
        elif char in ["ف", "ڡ"]:
            total += 80
        elif char == "ص":
            total += 60 if maghribi_order else 90
        elif char in ["ق", "ٯ"]:
            total += 100
        elif char == "ر":
            total += 200
        elif char == "ش":
            total += 1000 if maghribi_order else 300
        elif char == "ت":
            total += 400
        elif char == "ث":
            total += 500
        elif char == "خ":
            total += 600
        elif char == "ذ":
            total += 700
        elif char in ["ض"]:
            total += 90 if maghribi_order else 800
        elif char in ["ظ"]:
            total += 800 if maghribi_order else 900
        elif char in ["غ"]:
            total += 900 if maghribi_order else 1000
        elif char == "\u200C" or char == "ـ" or char.isspace():
            pass
        i += 1
    return total

def process_all_surahs():
    files = sorted(glob.glob('surah_*.txt'))
    
    surah_totals = []
    
    for file_path in files:
        surah_name = os.path.basename(file_path)
        print(f"\nProcessing {surah_name}...")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex to find VerseNumber۞AdadValue
        matches = list(re.finditer(r'(\d+)\s*۞\s*(\d+)', content))
        
        total_calc_adad = 0
        differences = []
        
        last_pos = 0
        for match in matches:
            verse_num = match.group(1)
            file_adad = int(match.group(2))
            
            # Text is between last_pos and the start of verse_num in this match
            verse_text_raw = content[last_pos:match.start(1)]
            # Remove things like '=' or previous total numbers if any
            verse_text = verse_text_raw.strip()
            verse_text = re.sub(r'^[\s\n=]+', '', verse_text)
            
            calc_adad = get_abjad(verse_text)
            total_calc_adad += calc_adad
            
            print(f"Verse {verse_num:<3} | File Adad: {file_adad:<6} | Calc Adad: {calc_adad:<6}")
            
            if calc_adad != file_adad:
                differences.append((verse_num, file_adad, calc_adad))
                
            last_pos = match.end(2)
        
        if differences:
            print(f"\nDIFFERENCES in {surah_name}:")
            for v_num, f_adad, c_adad in differences:
                print(f"  Verse {v_num}: File={f_adad}, Calc={c_adad}")
        else:
            print(f"\nNo differences found in {surah_name}.")
            
        surah_totals.append((surah_name, total_calc_adad))
        print("-" * 40)
        
    print("\n" + "="*50)
    print("SUMMARY OF SURAHS AND TOTAL CALCULATED ADAD")
    print("="*50)
    for name, total in surah_totals:
        print(f"{name:<25}: {total}")

if __name__ == "__main__":
    process_all_surahs()
