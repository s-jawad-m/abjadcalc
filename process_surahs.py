import os
import re
from calculate_word import get_abjad

# Standard 114 surah names for missing surah identification
surahs_114 = [
    (1, 'Al-Fatiha'), (2, 'Al-Baqarah'), (3, 'Al-Imran'), (4, 'An-Nisa'), (5, 'Al-Maidah'),
    (6, 'Al-Anam'), (7, 'Al-Araf'), (8, 'Al-Anfal'), (9, 'At-Tawbah'), (10, 'Yunus'),
    (11, 'Hud'), (12, 'Yusuf'), (13, 'Ar-Ra\'d'), (14, 'Ibrahim'), (15, 'Al-Hijr'),
    (16, 'An-Nahl'), (17, 'Al-Isra'), (18, 'Al-Kahf'), (19, 'Maryam'), (20, 'Ta-Ha'),
    (21, 'Al-Anbiya'), (22, 'Al-Hajj'), (23, 'Al-Mu\'minun'), (24, 'An-Nur'), (25, 'Al-Furqan'),
    (26, 'Ash-Shu\'ara'), (27, 'An-Naml'), (28, 'Al-Qasas'), (29, 'Al-\'Ankabut'), (30, 'Ar-Rum'),
    (31, 'Luqman'), (32, 'As-Sajdah'), (33, 'Al-Ahzab'), (34, 'Saba'), (35, 'Fatir'),
    (36, 'Ya-Sin'), (37, 'As-Saffat'), (38, 'Sad'), (39, 'Az-Zumar'), (40, 'Ghafir'),
    (41, 'Fussilat'), (42, 'Ash-Shura'), (43, 'Az-Zukhruf'), (44, 'Ad-Dukhan'), (45, 'Al-Jathiyah'),
    (46, 'Al-Ahqaf'), (47, 'Muhammad'), (48, 'Al-Fath'), (49, 'Al-Hujurat'), (50, 'Qaf'),
    (51, 'Adh-Dhariyat'), (52, 'At-Tur'), (53, 'An-Najm'), (54, 'Al-Qamar'), (55, 'Ar-Rahman'),
    (56, 'Al-Waqi\'ah'), (57, 'Al-Hadid'), (58, 'Al-Mujadilah'), (59, 'Al-Hashr'), (60, 'Al-Mumtahanah'),
    (61, 'As-Saff'), (62, 'Al-Jumu\'ah'), (63, 'Al-Munafiqun'), (64, 'At-Taghabun'), (65, 'At-Talaq'),
    (66, 'At-Tahrim'), (67, 'Al-Mulk'), (68, 'Al-Qalam'), (69, 'Al-Haqqah'), (70, 'Al-Ma\'arij'),
    (71, 'Nuh'), (72, 'Al-Jinn'), (73, 'Al-Muzzammil'), (74, 'Al-Muddaththir'), (75, 'Al-Qiyamah'),
    (76, 'Al-Insan'), (77, 'Al-Mursalat'), (78, 'An-Naba'), (79, 'An-Nazi\'at'), (80, '\'Abasa'),
    (81, 'At-Takwir'), (82, 'Al-Infitar'), (83, 'Al-Mutaffifin'), (84, 'Al-Inshiqaq'), (85, 'Al-Buruj'),
    (86, 'At-Tariq'), (87, 'Al-A\'la'), (88, 'Al-Ghashiyah'), (89, 'Al-Fajr'), (90, 'Al-Balad'),
    (91, 'Ash-Shams'), (92, 'Al-Layl'), (93, 'Ad-Duha'), (94, 'Ash-Sharh'), (95, 'At-Tin'),
    (96, 'Al-\'Alaq'), (97, 'Al-Qadr'), (98, 'Al-Bayyinah'), (99, 'Az-Zalzalah'), (100, 'Al-\'Adiyat'),
    (101, 'Al-Qari\'ah'), (102, 'At-Takathur'), (103, 'Al-\'Asr'), (104, 'Al-Humazah'), (105, 'Al-Fil'),
    (106, 'Quraysh'), (107, 'Al-Ma\'un'), (108, 'Al-Kawthar'), (109, 'Al-Kafirun'), (110, 'An-Nasr'),
    (111, 'Al-Masad'), (112, 'Al-Ikhlas'), (113, 'Al-Falaq'), (114, 'An-Nas')
]

# Mapping to standard numbers (approximate)
specials = {
    'fatiha': 1, 'baqarah': 2, 'aal_e_imran': 3, 'an_nisa': 4, 'maidah': 5,
    'al_anam': 6, 'al_araf': 7, 'al_anfal': 8, 'tauba': 9, 'younus': 10,
    'hood': 11, 'yousuf': 12, 'raad': 13, 'ibrahim': 14, 'hajr': 15,
    'nahl': 16, 'israel': 17, 'kahf': 18, 'maryam': 19, 'taha': 20,
    'ambiya': 21, 'hajj': 22, 'mominoon': 23, 'noor': 24, 'furqan': 25,
    'sharaa': 26, 'naml': 27, 'qasas': 28, 'ankabut': 29, 'room': 30,
    'luqman': 31, 'sajdah': 32, 'al_ahzab': 33, 'saba': 34, 'fatir': 35,
    'yaseen': 36, 'saafaath': 37, 'saad': 38, 'zamoor': 39, 'ghafir': 40,
    'fussilat': 41, 'shoori': 42, 'ash_shura': 42, 'zukhraf': 43, 'dhukhan': 44,
    'jaisia': 45, 'ahqaf': 46, 'mohammad': 47, 'fatha': 48, 'hijrat': 49,
    'qaaf': 50, 'zariyat': 51, 'toor': 52, 'najm': 53, 'qamr': 54,
    'rahman': 55, 'waqia': 56, 'hadeed': 57, 'majadilah': 58, 'hashr': 59,
    'mumtahina': 60, 'saf': 61, 'jumah': 62, 'munafikoon': 63, 'taghabun': 64,
    'talaq': 65, 'tahreem': 66, 'mulk': 67, 'kalam': 68, 'haaqah': 69,
    'miraj': 70, 'nooh': 71, 'jinn': 72, 'muzammil': 73, 'mudassir': 74,
    'qiyama': 75, 'al_insan': 76, 'mursalat': 77, 'naba': 78, 'naziat': 79,
    'abasa': 80, 'takweer': 81, 'infitaar': 82, 'mutafifeen': 83, 'inshifaaq': 84,
    'burooj': 85, 'tariq': 86, 'al_aala': 87, 'ghashia': 88, 'fajr': 89,
    'balad': 90, 'shams': 91, 'layl': 92, 'zuha': 93, 'sharha': 94,
    'teen': 95, 'alaq': 96, 'qadr': 97, 'bayyinah': 98, 'zalzala': 99,
    'aadiat': 100, 'qariah': 101, 'takasur': 102, 'asr': 103, 'humaza': 104,
    'feel': 105, 'quraysh': 106, 'maaoon': 107, 'kausar': 108, 'kafiroon': 109,
    'nasr': 110, 'masad': 111, 'ikhlaas': 112, 'falaq': 113, 'naas': 114
}

def process_surah(file_path):
    discrepancies = []
    total_calculated_adad = 0
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Pattern: [Arabic Text] [Verse Number] ۞ [Original Adad]
            # Handle multiple variations of ۞ or spaces
            match = re.search(r'^(.*?)\s+(\d+)\s*[۞\u06DE\s]+\s*(\d+)$', line)
            
            if match:
                arabic_text = match.group(1).strip()
                verse_num = match.group(2)
                original_adad = int(match.group(3))
                
                # Calculate adad
                calculated_adad, _ = get_abjad(arabic_text)
                
                total_calculated_adad += calculated_adad
                
                if calculated_adad != original_adad:
                    discrepancies.append({
                        'verse': verse_num,
                        'original': original_adad,
                        'calculated': calculated_adad,
                        'text': arabic_text
                    })
            else:
                # Debugging print for unmatched lines
                # print(f"DEBUG: Unmatched line in {file_path}: {line}")
                pass
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        
    return discrepancies, total_calculated_adad

def main():
    files = [f for f in os.listdir('.') if f.startswith('surah_') and f.endswith('.txt')]
    
    found_nums = set()
    results = []
    
    for file_name in files:
        base_name = file_name[6:-4].lower()
        if base_name in specials:
            found_nums.add(specials[base_name])
            
        discrepancies, total_adad = process_surah(file_name)
        results.append({
            'file': file_name,
            'total_adad': total_adad,
            'discrepancies': discrepancies
        })
        
    # Identification of missing surahs
    missing = [f"{num}: {name}" for num, name in surahs_114 if num not in found_nums]
    
    print("-" * 50)
    print("MISSING SURAHS IN THIS DIRECTORY (Standard 114 List)")
    if missing:
        for m in missing:
            print(m)
    else:
        print("None (All 114 unique surahs are accounted for)")
    print("-" * 50)
    
    print("-" * 50)
    print("SURAH PROCESSING RESULTS")
    print("-" * 50)
    
    for res in results:
        print(f"Surah: {res['file']} | Total Calculated Adad: {res['total_adad']}")
        if res['discrepancies']:
            print("  Discrepancies found:")
            for disc in res['discrepancies']:
                print(f"    Verse {disc['verse']}: Original={disc['original']}, Calculated={disc['calculated']}")
        # We don't need a separator for every surah if there are many, but requested "list each surah"
        # Print only if discrepancy? No, the prompt asks to "list all the surah's which are having discrepancy ... ALSO, list each surah in the order its present in the folder along with the total calculated adad value"
        # I'll combine these.
        print("-" * 30)

if __name__ == "__main__":
    main()
