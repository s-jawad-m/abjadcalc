import os

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

files = [f for f in os.listdir('.') if f.startswith('surah_') and f.endswith('.txt')]
file_names = [f[6:-4].lower() for f in files]

def normalize(name):
    return name.lower().replace('-', '_').replace(' ', '_').replace("'", "").replace('`', '')

# More manual mapping
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

found = set()
for fn in file_names:
    norm_fn = normalize(fn)
    if norm_fn in specials:
        found.add(specials[norm_fn])
    else:
        for num, name in surahs_114:
            norm_name = normalize(name)
            if norm_fn == norm_name or norm_fn == 'al_' + norm_name or norm_fn == 'an_' + norm_name:
                found.add(num)
                break

print("Missing Surahs:")
for num, name in surahs_114:
    if num not in found:
        print(f"{num}: {name}")

print(f"\nTotal found: {len(found)}")
