import os
import re

def get_abjad(input_str, ignore_hamzah=False):
    # Logic from lib.ts
    input_stripped = re.sub(
        r'[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]',
        '',
        input_str
    )
    total = 0
    i = 0
    while i < len(input_stripped):
        char = input_stripped[i]
        val = 0
        if char in ['ا', 'آ', 'أ', 'إ', 'ٱ', '\ufe8e']: val = 1
        elif char in ['ئ', 'ٮ', 'ی', 'ى', 'ي', 'ے']:
            has_floating_hamza = False
            if i + 1 < len(input_stripped):
                next_char = input_stripped[i+1]
                if next_char in ['\u0654', '\u0655', '\u0674']: has_floating_hamza = True
            is_positional = (char == 'ئ' or has_floating_hamza)
            is_last = True
            if is_positional:
                for j in range(i + 1, len(input_stripped)):
                    look_ahead_char = input_stripped[j]
                    if look_ahead_char in ['\u0654', '\u0655', '\u0674', '\u200C', '\u06E6', 'ـ']: continue
                    if look_ahead_char.isspace(): break
                    if re.match(r'[\u0621-\u06ED]', look_ahead_char):
                        is_last = False
                        break
            if char == 'ٮ' and not has_floating_hamza: val = 0
            elif is_positional: val = 10 if is_last else 1
            else: val = 10
            if has_floating_hamza: i += 1
        elif char in ['ء', '\u0674', '\u0654', '\u0655']:
            if not ignore_hamzah: val = 1
        elif char == '\u06E6': val = 10
        elif char in ['ب', 'پ']: val = 2
        elif char in ['ج', 'چ']: val = 3
        elif char == 'د': val = 4
        elif char in ['ه', 'ة', 'ۀ', 'ہ', 'ھ', 'ە', 'ﻫ', 'ﻬ', 'ﻪ', 'ﺔ']: val = 5
        elif char in ['و', 'ؤ']: val = 6
        elif char in ['ز', 'ژ']: val = 7
        elif char == 'ح': val = 8
        elif char == 'ط': val = 9
        elif char in ['ک', 'گ', 'ك', 'ڪ']: val = 20
        elif char == 'ل': val = 30
        elif char == 'م': val = 40
        elif char in ['ن', 'ں']: val = 50
        elif char == 'س': val = 60
        elif char == 'ع': val = 70
        elif char in ['ف', 'ڡ']: val = 80
        elif char == 'ص': val = 90
        elif char in ['ق', 'ٯ']: val = 100
        elif char == 'ر': val = 200
        elif char == 'ش': val = 300
        elif char == 'ت': val = 400
        elif char == 'ث': val = 500
        elif char == 'خ': val = 600
        elif char == 'ذ': val = 700
        elif char == 'ض': val = 800
        elif char == 'ظ': val = 900
        elif char == 'غ': val = 1000
        total += val
        i += 1
    return total

def audit_file(file_path):
    report = []
    discrepancies = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        for line in lines:
            line = line.strip()
            if not line: continue
            
            # Pattern 1: [Text] [VerseNum]۞[Adad]
            match1 = re.search(r'^(.*?)\s+(\d+)۞(\d+)$', line)
            # Pattern 2: [VerseNum]۞ [Text] [Adad]
            match2 = re.search(r'^(\d+)۞\s*(.*?)\s+(\d+)$', line)
            
            if match1:
                text, num, existing = match1.groups()
                clean_text = re.sub(r'[\u06D6-\u06ED]+$', '', text).strip()
                calc = get_abjad(clean_text)
                if calc != int(existing):
                    discrepancies.append(f"{num}: Existing {existing} vs Calculated {calc}")
            elif match2:
                num, text, existing = match2.groups()
                clean_text = re.sub(r'[\u06D6-\u06ED]+$', '', text).strip()
                calc = get_abjad(clean_text)
                if calc != int(existing):
                    discrepancies.append(f"{num}: Existing {existing} vs Calculated {calc}")
            else:
                # Fallback for Arabic digits
                parts = re.split(r'([١٢٣٤٥٦٧٨٩٠]+)', line)
                if len(parts) > 1:
                    arabic_to_int = {'٠':0, '١':1, '٢':2, '٣':3, '٤':4, '٥':5, '٦':6, '٧':7, '٨':8, '٩':9}
                    for i in range(0, len(parts)-1, 2):
                        text = parts[i].strip()
                        num_str = parts[i+1]
                        num = int(''.join(str(arabic_to_int[c]) for c in num_str))
                        if text:
                            clean_text = re.sub(r'[\u06D6-\u06ED]+$', '', text).strip()
                            calc = get_abjad(clean_text)
                            # We don't have an 'existing' adad in this fallback format
                            pass 

        if not discrepancies:
            return "Discrepancies: None"
        else:
            return f"Discrepancies: {', '.join(discrepancies)}"
            
    except Exception as e:
        return f"Error: {e}"

def main():
    surah_files = sorted([f for f in os.listdir('.') if f.startswith('surah_') and f.endswith('.txt')], key=lambda x: x.lower())
    
    with open('surah_audit_report.txt', 'w', encoding='utf-8') as report_file:
        report_file.write("SURAH ADAD AUDIT REPORT\n")
        report_file.write("="*30 + "\n\n")
        
        for file_name in surah_files:
            if file_name == 'surah_analysis.txt': continue
            result = audit_file(file_name)
            output = f"Surah: {file_name}\n{result}\n" + "-"*30 + "\n"
            report_file.write(output)
            print(f"Processed {file_name}")

if __name__ == "__main__":
    main()
