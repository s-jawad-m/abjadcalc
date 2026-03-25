import re
import os

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
    if not os.path.exists(file_path):
        print(f"\n[!] ERROR: {file_path} not found.")
        return
    
    print(f"\n" + "="*60)
    print(f" SURAH: {file_path.upper()}")
    print("="*60)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.strip().split('\n')
    
    total_file_adad = 0
    total_calc_adad = 0
    diff_verses = []
    
    for line in lines:
        if not line.strip(): continue
        
        # Check if line is just a total sum (usually at the end)
        if line.strip().isdigit():
            total_file_adad_reported = int(line.strip())
            continue

        parts = line.split('۞')
        if len(parts) != 2: 
            # Check for cases where۞ might be missing but format is text verse adad
            match = re.search(r'^(.*?)\s+(\d+)\s+(\d+)$', line.strip())
            if match:
                verse_text = match.group(1).strip()
                verse_num = match.group(2)
                adad_val = int(match.group(3))
            else:
                continue
        else:
            adad_val = int(parts[1].strip())
            before_part = parts[0].strip()
            # Verse number is usually the last number before ۞
            match = re.search(r'(\d+)$', before_part)
            if match:
                verse_num = match.group(1)
                verse_text = before_part[:match.start()].strip()
            else:
                verse_num = "?"
                verse_text = before_part
            
        calculated_adad = get_abjad(verse_text)
        
        total_calc_adad += calculated_adad
        # In files like surah_qadr.txt, the total isn't on every line
        # but the provided adad for the verse IS on every line.
        
        status = ""
        if calculated_adad != adad_val:
            status = f" <-- DIFFERENCE! (File: {adad_val}, Calc: {calculated_adad})"
            diff_verses.append((verse_num, adad_val, calculated_adad))
            print(f"V {verse_num:<3}: {calculated_adad} (File: {adad_val}){status}")
        else:
            print(f"V {verse_num:<3}: {calculated_adad} (OK)")

    print("-" * 30)
    print(f"Calculated Surah Total: {total_calc_adad}")
    if diff_verses:
        print(f"Verses with differences: {', '.join([v[0] for v in diff_verses])}")
    else:
        print("All verses match perfectly!")

if __name__ == "__main__":
    surahs = [
        "surah_ikhlaas.txt", "surah_falaq.txt", "surah_naas.txt"
    ]
    for s in surahs:
        process_file(s)
