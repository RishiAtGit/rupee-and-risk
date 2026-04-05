import io
from pypdf import PdfReader

def extract_text_from_pdf(file_bytes: bytes) -> str:
    # 1. Open the PDF from memory
    pdf_reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    # 2. Extract text page by page
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"
    return text