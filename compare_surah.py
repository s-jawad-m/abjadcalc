import re
import sys

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

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Improved splitting to handle fused verse numbers
    lines = content.strip().split('\n')
    
    total_file_adad = 0
    total_calc_adad = 0
    
    for line in lines:
        if not line.strip(): continue
        parts = line.split('۞')
        if len(parts) != 2: continue
        
        adad_val = int(parts[1].strip())
        
        # Extract verse number and text more robustly
        # Find the last number in the first part
        before_part = parts[0].strip()
        match = re.search(r'(\d+)$', before_part)
        if match:
            verse_num = match.group(1)
            verse_text = before_part[:match.start()].strip()
        else:
            verse_num = "?"
            verse_text = before_part
            
        calculated_adad = get_abjad(verse_text)
        
        total_file_adad += adad_val
        total_calc_adad += calculated_adad
        
        if calculated_adad != adad_val:
            print(f"DIFF: Verse {verse_num:<3} | File: {adad_val:<10} | Calc: {calculated_adad:<10}")
        else:
            print(f"OK:   Verse {verse_num:<3} | Val: {adad_val:<10}")

    print("-" * 50)
    print(f"Total File Adad: {total_file_adad}")
    print(f"Total Calc Adad: {total_calc_adad}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_file(sys.argv[1])
    else:
        process_file('surah_zamoor.txt')
