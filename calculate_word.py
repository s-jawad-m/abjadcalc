import re

def get_abjad(input_str, maghribi_order=False, ignore_hamzah=False):
    input_stripped = re.sub(
        r'[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]',
        "",
        input_str
    )

    total = 0
    i = 0
    details = []
    while i < len(input_stripped):
        char = input_stripped[i]
        val = 0
        info = ""

        if char in ["ا", "آ", "أ", "إ", "ٱ"]:
            val = 1
            info = f"U+{ord(char):04X}"
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
                val = 0
            elif is_positional:
                val = 10 if is_last else 1
            else:
                val = 10
            
            info = f"U+{ord(char):04X} (Positional: {is_positional}, Last: {is_last})"
            if has_floating_hamza:
                info += f" + Consumed Hamza U+{ord(input_stripped[i+1]):04X}"
                i += 1
        elif char in ["ء", "\u0674", "\u0654", "\u0655"]:
            if not ignore_hamzah:
                val = 1
            info = f"U+{ord(char):04X}"
        elif char == "\u06E6":
            val = 10
            info = f"U+{ord(char):04X}"
        elif char in ["ب", "پ"]:
            val = 2
            info = f"U+{ord(char):04X}"
        elif char in ["ج", "چ"]:
            val = 3
            info = f"U+{ord(char):04X}"
        elif char == "د":
            val = 4
            info = f"U+{ord(char):04X}"
        elif char in ["ه", "ة", "ۀ", "ہ", "ھ", "ە", "ﻫ", "ﻬ", "ﻪ", "ﺔ"]:
            val = 5
            info = f"U+{ord(char):04X}"
        elif char in ["و", "ؤ"]:
            val = 6
            info = f"U+{ord(char):04X}"
        elif char in ["ز", "ژ"]:
            val = 7
            info = f"U+{ord(char):04X}"
        elif char == "ح":
            val = 8
            info = f"U+{ord(char):04X}"
        elif char == "ط":
            val = 9
            info = f"U+{ord(char):04X}"
        elif char in ["ک", "گ", "ك", "ڪ"]:
            val = 20
            info = f"U+0643"
        elif char == "ل":
            val = 30
            info = f"U+{ord(char):04X}"
        elif char == "م":
            val = 40
            info = f"U+{ord(char):04X}"
        elif char in ["ن", "ں"]:
            val = 50
            info = f"U+{ord(char):04X}"
        elif char == "س":
            val = 300 if maghribi_order else 60
            info = f"U+{ord(char):04X}"
        elif char == "ع":
            val = 70
            info = f"U+{ord(char):04X}"
        elif char in ["ف", "ڡ"]:
            val = 80
            info = f"U+{ord(char):04X}"
        elif char == "ص":
            val = 60 if maghribi_order else 90
            info = f"U+{ord(char):04X}"
        elif char in ["ق", "ٯ"]:
            val = 100
            info = f"U+{ord(char):04X}"
        elif char == "ر":
            val = 200
            info = f"U+{ord(char):04X}"
        elif char == "ش":
            val = 1000 if maghribi_order else 300
            info = f"U+{ord(char):04X}"
        elif char == "ت":
            val = 400
            info = f"U+{ord(char):04X}"
        elif char == "ث":
            val = 500
            info = f"U+{ord(char):04X}"
        elif char == "خ":
            val = 600
            info = f"U+{ord(char):04X}"
        elif char == "ذ":
            val = 700
            info = f"U+{ord(char):04X}"
        elif char in ["ض"]:
            val = 90 if maghribi_order else 800
            info = f"U+{ord(char):04X}"
        elif char in ["ظ"]:
            val = 800 if maghribi_order else 900
            info = f"U+{ord(char):04X}"
        elif char in ["غ"]:
            val = 900 if maghribi_order else 1000
            info = f"U+{ord(char):04X}"
        
        details.append((char, val, info))
        total += val
        i += 1
        
    return total, details

word = "وَجِآىْ َٔ"
print(f"\nWord: {word}")
total, details = get_abjad(word)
for char, val, info in details:
    if val > 0:
        print(f"  {char}: {val} ({info})")
    else:
        print(f"  {char}: 0 ({info})")
print(f"Total: {total}")
