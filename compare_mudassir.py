import re
from calculate_word import get_abjad

def compare_mudassir():
    try:
        with open('surah_mudassir.txt', 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print("Error: surah_mudassir.txt not found.")
        return

    results = []
    total_calculated_adad = 0
    total_file_adad = 0

    print(f"{'Verse':<8} | {'Text Preview':<50} | {'File Adad':<10} | {'Calc Adad':<10} | {'Status'}")
    print("-" * 100)

    for line in lines:
        line = line.strip()
        if not line or line.startswith("TOTAL"):
            if line.startswith("TOTAL"):
                total_file_adad = int(re.search(r'\d+', line).group())
            continue
        
        # Split by ۞
        parts = line.split('۞')
        if len(parts) != 2:
            continue
            
        text_and_number = parts[0].strip()
        file_adad = int(parts[1].strip())
        
        # Extract verse number (it's at the end of text_and_number)
        match = re.search(r'(\d+)$', text_and_number)
        if match:
            verse_num = match.group(1)
            verse_text = text_and_number[:match.start()].strip()
        else:
            verse_num = "?"
            verse_text = text_and_number
            
        # Calculate Adad for verse_text
        calc_adad, _ = get_abjad(verse_text)
        total_calculated_adad += calc_adad
        
        status = "Match" if calc_adad == file_adad else "DIFFERENCE"
        results.append({
            'verse': verse_num,
            'file_adad': file_adad,
            'calc_adad': calc_adad,
            'status': status
        })
        
        preview = verse_text[:47] + "..." if len(verse_text) > 50 else verse_text
        print(f"{verse_num:<8} | {preview:<50} | {file_adad:<10} | {calc_adad:<10} | {status}")

    print("-" * 100)
    print(f"Total calculated Adad: {total_calculated_adad}")
    print(f"Total Adad in file: {total_file_adad}")
    
    diffs = [r for r in results if r['status'] == "DIFFERENCE"]
    if diffs:
        print(f"\nFound {len(diffs)} differences:")
        for d in diffs:
            print(f"Verse {d['verse']}: File={d['file_adad']}, Calculated={d['calc_adad']}")
    else:
        print("\nAll verses match!")

if __name__ == "__main__":
    compare_mudassir()
