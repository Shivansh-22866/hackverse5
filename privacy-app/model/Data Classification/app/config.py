patterns = {
    "email": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
    "phone_number": r"(\+?\d{1,4}[\s-])?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}",
    "credit_card": r"\b(?:\d{4}[- ]?){3}\d{4}\b",
    "ssn": r"\b\d{3}-\d{2}-\d{4}\b",
    "ip_address": r"\b(?:\d{1,3}\.){3}\d{1,3}\b",
    "customer_id": r"CUST-\d{4,10}",
}
