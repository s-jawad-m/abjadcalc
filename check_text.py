from pypdf import PdfReader

def check_text(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        for i in range(min(5, len(reader.pages))):
            page = reader.pages[i]
            text = page.extract_text()
            print(f"--- Page {i} Text ---")
            print(text.strip() if text.strip() else "[NO TEXT FOUND ON PAGE]")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_text("surah_baqarah_extract.pdf")
