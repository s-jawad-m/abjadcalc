from calculate_word import get_abjad
import re

word = "مَّرِیۡٓـــٴًﺎ"
print(f"Word: {word}")
total, details = get_abjad(word)
for char, val, info in details:
    print(f"  {char} (U+{ord(char):04X}): {val} ({info})")
print(f"Total: {total}")
