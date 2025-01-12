import fitz  # PyMuPDF
import re
import os

# Define patterns for email and phone number
patterns = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone_number": r"\+91-\d{10}|\b\d{10}\b"  # Matches Indian phone numbers with +91 and 10-digit numbers
}

# Mask sensitive data
def mask_sensitive_data(text):
    # Masking function for email
    def mask_email(match):
        username, domain = match.group().split("@")
        return f"{username[:2]}***@{domain}"  # Mask email, showing only the first 2 characters of the username

    # Masking function for phone number
    def mask_phone_number(match):
        phone_number = match.group()
        if phone_number.startswith("+91-"):  # Handle +91- format
            return f"+91-{phone_number[4:7]}-XXX-XXXX"
        else:  # Handle 10-digit numbers
            return f"{phone_number[:3]}-XXX-XXXX"

    # Apply email masking
    text = re.sub(patterns["email"], mask_email, text)

    # Apply phone number masking
    text = re.sub(patterns["phone_number"], mask_phone_number, text)

    return text

# Extract text, mask data, and save to a new PDF
def mask_pdf_sensitive_data(input_pdf):
    # Open the input PDF
    doc = fitz.open(input_pdf)

    # Create the output PDF name by appending "_masked" before the file extension
    base_name, ext = os.path.splitext(input_pdf)
    output_pdf = f"{base_name}_masked{ext}"
    
    new_pdf = fitz.open()  # Create a new PDF

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")  # Extract text from the page

        # Mask sensitive data
        masked_text = mask_sensitive_data(text)

        # Create a new page with masked content
        rect = page.rect  # Get page dimensions
        new_page = new_pdf.new_page(width=rect.width, height=rect.height)
        new_page.insert_textbox(
            rect,
            masked_text,
            fontsize=12,
            fontname="helv",
            color=(0, 0, 0),
        )

    # Save the new PDF in the same folder as the input PDF
    new_pdf.save(output_pdf)
    new_pdf.close()
    doc.close()
    print(f"Masked PDF created and saved as: {output_pdf}")


