import re

def mask_sensitive_data(text):
    masked_text = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[EMAIL_MASKED]", text)
    masked_text = re.sub(r"\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,3}[-.\s]?\d{1,4}", "[PHONE_MASKED]", masked_text)
    masked_text = re.sub(r"\b(?:\d[ -]*?){13,16}\b", "[CREDIT_CARD_MASKED]", masked_text)
    masked_text = re.sub(r"\d{3}-\d{2}-\d{4}", "[SSN_MASKED]", masked_text)
    masked_text = re.sub(r"(\d{1,3}\.){3}\d{1,3}", "[IP_ADDRESS_MASKED]", masked_text)
    masked_text = re.sub(r"\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}", "[DATE_MASKED]", masked_text)
    return masked_text

