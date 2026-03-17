from pypdf import PdfReader, PdfWriter

def split_pdf(input_pdf, output_pdf, start_page, end_page):
    reader = PdfReader(input_pdf)
    writer = PdfWriter()

    # The PDF may have fewer pages than 50, let's check
    total_pages = len(reader.pages)
    end_page = min(end_page, total_pages)

    for i in range(start_page, end_page):
        writer.add_page(reader.pages[i])

    with open(output_pdf, "wb") as f:
        writer.write(f)
    print(f"Extracted pages {start_page} to {end_page-1} into {output_pdf}")

if __name__ == "__main__":
    split_pdf("surah fatiha to yaseen.pdf", "surah_baqarah_extract.pdf", 0, 50)
