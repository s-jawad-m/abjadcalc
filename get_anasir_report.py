import os
import re
import unicodedata

surahs_114 = [
    (1, 'Fatiha'), (2, 'Baqarah'), (3, 'Aal-e-Imran'), (4, 'An-Nisa'), (5, 'Maidah'),
    (6, 'Al-Anam'), (7, 'Al-Araf'), (8, 'Al-Anfal'), (9, 'Tauba'), (10, 'Younus'),
    (11, 'Hood'), (12, 'Yousuf'), (13, 'Raad'), (14, 'Ibrahim'), (15, 'Hijr'),
    (16, 'Nahl'), (17, 'Israel'), (18, 'Kahf'), (19, 'Maryam'), (20, 'Taha'),
    (21, 'Ambiya'), (22, 'Hajj'), (23, 'Mominoon'), (24, 'Noor'), (25, 'Furqan'),
    (26, 'Sharaa'), (27, 'Naml'), (28, 'Qasas'), (29, 'Ankabut'), (30, 'Room'),
    (31, 'Luqman'), (32, 'Sajdah'), (33, 'Ahzab'), (34, 'Saba'), (35, 'Fatir'),
    (36, 'Yaseen'), (37, 'Saafaath'), (38, 'Sad'), (39, 'Zumar'), (40, 'Ghafir'),
    (41, 'Fussilat'), (42, 'Shura'), (43, 'Zukhraf'), (44, 'Dhukhan'), (45, 'Jathiyah'),
    (46, 'Ahqaf'), (47, 'Muhammad'), (48, 'Fath'), (49, 'Hujurat'), (50, 'Qaf'),
    (51, 'Zariyat'), (52, 'Tur'), (53, 'Najm'), (54, 'Qamar'), (55, 'Rahman'),
    (56, 'Waqia'), (57, 'Hadid'), (58, 'Mujadilah'), (59, 'Hashr'), (60, 'Mumtahina'),
    (61, 'Saff'), (62, 'Jumuah'), (63, 'Munafiqun'), (64, 'Taghabun'), (65, 'Talaq'),
    (66, 'Tahrim'), (67, 'Mulk'), (68, 'Qalam'), (69, 'Haqqah'), (70, 'Maarij'),
    (71, 'Nuh'), (72, 'Jinn'), (73, 'Muzzammil'), (74, 'Muddaththir'), (75, 'Qiyamah'),
    (76, 'Insan'), (77, 'Mursalat'), (78, 'Naba'), (79, 'Naziat'), (80, 'Abasa'),
    (81, 'Takwir'), (82, 'Infitar'), (83, 'Mutaffifin'), (84, 'Inshiqaq'), (85, 'Buruj'),
    (86, 'Tariq'), (87, 'Ala'), (88, 'Ghashiyah'), (89, 'Fajr'), (90, 'Balad'),
    (91, 'Shams'), (92, 'Layl'), (93, 'Duha'), (94, 'Sharh'), (95, 'Tin'),
    (96, 'Alaq'), (97, 'Qadr'), (98, 'Bayyinah'), (99, 'Zalzalah'), (100, 'Adiyat'),
    (101, 'Qariah'), (102, 'Takathur'), (103, 'Asr'), (104, 'Humazah'), (105, 'Fil'),
    (106, 'Quraysh'), (107, 'Maun'), (108, 'Kawthar'), (109, 'Kafirun'), (110, 'Nasr'),
    (111, 'Masad'), (112, 'Ikhlas'), (113, 'Falaq'), (114, 'Nas')
]

specials = {
    'hajr': 15, 'israel': 17, 'sharaa': 26, 'shoori': 42, 'ash_shura': 42,
    'zamoor': 39, 'hijrat': 49, 'kalam': 68, 'miraj': 70, 'jaisia': 45,
    'aal_e_imran': 3, 'al_insan': 76, 'al_aala': 87, 'al_anam': 6, 'al_araf': 7,
    'al_anfal': 8, 'al_ahzab': 33, 'shura': 42, 'ash_shura': 42, 'shoori': 42,
    'zuha': 93, 'sharha': 94, 'teen': 95, 'fatiha': 1, 'ikhlaas': 112,
    'saafaath': 37, 'saad': 38, 'qiyama': 75, 'naba': 78, 'naziat': 79,
    'takweer': 81, 'infitaar': 82, 'mutafifeen': 83, 'inshifaaq': 84,
    'burooj': 85, 'ghashia': 88, 'aadiat': 100, 'takasur': 102, 'maaoon': 107,
    'kausar': 108, 'kafiroon': 109, 'naas': 114, 'nasr': 110, 'falaq': 113,
    'baqarah': 2, 'an_nisa': 4, 'maidah': 5, 'tauba': 9, 'younus': 10,
    'hood': 11, 'yousuf': 12, 'raad': 13, 'ibrahim': 14, 'nahl': 16,
    'kahf': 18, 'maryam': 19, 'taha': 20, 'ambiya': 21, 'hajj': 22,
    'mominoon': 23, 'noor': 24, 'furqan': 25, 'naml': 27, 'qasas': 28,
    'ankabut': 29, 'room': 30, 'luqman': 31, 'sajdah': 32, 'saba': 34,
    'fatir': 35, 'yaseen': 36, 'ghafir': 40, 'fussilat': 41, 'zukhraf': 43,
    'dhukhan': 44, 'ahqaf': 46, 'mohammad': 47, 'fatha': 48, 'qaaf': 50,
    'zariyat': 51, 'toor': 52, 'najm': 53, 'qamr': 54, 'rahman': 55,
    'waqia': 56, 'hadeed': 57, 'majadilah': 58, 'hashr': 59, 'mumtahina': 60,
    'saf': 61, 'jumah': 62, 'munafikoon': 63, 'taghabun': 64, 'talaq': 65,
    'tahreem': 66, 'mulk': 67, 'haaqah': 69, 'nooh': 71, 'jinn': 72,
    'muzammil': 73, 'mudassir': 74, 'mursalat': 77, 'abasa': 80, 'tariq': 86,
    'fajr': 89, 'balad': 90, 'shams': 91, 'layl': 92, 'alaq': 96,
    'qadr': 97, 'bayyinah': 98, 'zalzala': 99, 'qariah': 101, 'asr': 103,
    'humaza': 104, 'feel': 105, 'quraysh': 106, 'masad': 111
}

def normalize(name):
    return name.lower().replace('-', '_').replace(' ', '_').replace("'", "").replace('`', '')

def get_anasir_counts(input_str):

    normalized_str = unicodedata.normalize('NFC', input_str)
    # Strip characters as per lib.ts
    input_stripped = re.sub(
        r'[\u064B-\u0653\u0656-\u065F\u06D6-\u06E5\u06E7-\u06ED]',
        "",
        normalized_str
    )

    aatishi = 0 # Fire
    baadi = 0   # Air
    aabi = 0    # Water
    khaki = 0   # Earth

    i = 0
    while i < len(input_stripped):
        char = input_stripped[i]

        if char in ["ا", "آ", "أ", "إ", "ٱ", "\ufe8e"]:
            aatishi += 1
        elif char in ["ئ", "ٮ", "ی", "ى", "ي", "ے"]:
            # 1. Check for a floating Hamza immediately following
            has_floating_hamza = False
            if i + 1 < len(input_stripped):
                next_char = input_stripped[i+1]
                if next_char in ["\u0654", "\u0655", "\u0674"]:
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
                pass # skip
            elif is_positional:
                if is_last:
                    baadi += 1
                else:
                    aatishi += 1
            else:
                baadi += 1
            
            if has_floating_hamza:
                i += 1
        elif char in ["ء", "\u0674", "\u0654", "\u0655"]:
            aatishi += 1
        elif char == "\u06E6":
            baadi += 1
        elif char in ["ب", "پ"]:
            baadi += 1
        elif char in ["ج", "چ"]:
            aabi += 1
        elif char == "د":
            khaki += 1
        elif char in ["ه", "ة", "ۃ", "ۀ", "ہ", "ھ", "ە", "ﻫ", "ﻬ", "ﻪ", "ﺔ"]:
            aatishi += 1
        elif char in ["و", "ؤ"]:
            baadi += 1
        elif char in ["ز", "ژ"]:
            aabi += 1
        elif char == "ح":
            khaki += 1
        elif char == "ط":
            aatishi += 1
        elif char in ["ک", "گ", "ك", "ڪ"]:
            aabi += 1
        elif char == "ل":
            khaki += 1
        elif char == "م":
            aatishi += 1
        elif char in ["ن", "ں"]:
            baadi += 1
        elif char == "س":
            aabi += 1
        elif char == "ع":
            khaki += 1
        elif char in ["ف", "ڡ"]:
            aatishi += 1
        elif char == "ص":
            baadi += 1
        elif char in ["ق", "ٯ"]:
            aabi += 1
        elif char == "ر":
            khaki += 1
        elif char == "ش":
            aatishi += 1
        elif char == "ت":
            baadi += 1
        elif char == "ث":
            aabi += 1
        elif char == "خ":
            khaki += 1
        elif char == "ذ":
            aatishi += 1
        elif char == "ض":
            baadi += 1
        elif char == "ظ":
            aabi += 1
        elif char == "غ":
            khaki += 1
        
        i += 1
    return aatishi, baadi, aabi, khaki

# Map numbers to filenames
num_to_file = {}
surah_dir = 'all_quran_surahs_114'
all_files = os.listdir(surah_dir)

# Helper to find file
def find_file_for_surah(num, name):
    norm_name = normalize(name)
    possible_names = [
        norm_name,
        'al_' + norm_name,
        'an_' + norm_name,
        'ash_' + norm_name,
        'at_' + norm_name,
        'az_' + norm_name,
        'ad_' + norm_name,
        'as_' + norm_name,
        'ar_' + norm_name
    ]
    # Check specials first
    for k, v in specials.items():
        if v == num:
            possible_names.append(k)
    
    for fn in all_files:
        if not fn.endswith('.txt'): continue
        base = fn[6:-4].lower()
        norm_fn = normalize(base)
        if norm_fn in possible_names:
            return fn
    
    # Fuzzy search as last resort
    for fn in all_files:
        if not fn.endswith('.txt'): continue
        if norm_name in fn.lower().replace('-', '_'):
            return fn
    return None

for num, name in surahs_114:
    fn = find_file_for_surah(num, name)
    if fn:
        num_to_file[num] = fn

output_lines = ["No.\tSurah Name\tNaar (Fire)\tBaad (Air)\tMa (Water)\tKhak (Earth)"]
for num, name in surahs_114:
    if num in num_to_file:
        filepath = os.path.join(surah_dir, num_to_file[num])
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            counts = get_anasir_counts(content)
            output_lines.append(f"{num}\t{name}\t{counts[0]}\t{counts[1]}\t{counts[2]}\t{counts[3]}")
    else:
        output_lines.append(f"{num}\t{name}\tN/A\tN/A\tN/A\tN/A")

with open('anasir_report.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output_lines))

print("Report generated in anasir_report.txt")
