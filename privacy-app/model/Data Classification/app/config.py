# Define regex patterns for sensitive data categories
patterns = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone_number": r"\+?[0-9]{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,3}[-.\s]?\d{1,4}$",
    "credit_card": r"\b(?:\d[ -]*?){13,16}\b",
    "ssn": r"\d{3}-\d{2}-\d{4}",
    "ip_address": r"(\d{1,3}\.){3}\d{1,3}",
    "date": r"\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}",
}
