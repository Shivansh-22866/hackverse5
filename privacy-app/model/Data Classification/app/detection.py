import re
from app.config import patterns
import spacy
nlp = spacy.load("en_core_web_sm")
from app.masking import mask_data

compliance_rules = {
    "email": ["GDPR Article 32"],
    "phone_number": ["GDPR Article 32", "CCPA"],
    "credit_card": ["PCI DSS", "CCPA"],
    "ssn": ["HIPAA", "CCPA"],
    "ip_address": ["GDPR Article 32"],
    "date": ["GDPR Article 32"],
    "customer_id": ["CCPA"],
    "business_id": ["CCPA"]
}

sensitivity_map = {
    "email": "medium",
    "phone_number": "medium",
    "credit_card": "high",
    "ssn": "high",
    "ip_address": "low",
    "date": "low",
    "customer_id": "medium",
    "business_id": "medium",
    "tin": "high",
    "passport_number": "high",
}



def calculate_confidence(match, pattern):
    weights = {
        "email": 0.9,
        "phone_number": 0.8,
        "credit_card": 0.95,
        "ssn": 0.9,
        "ip_address": 0.85,
        "date": 0.7,
        "customer_id": 0.8,
        "business_id": 0.8,
        "tin": 0.9,
        "passport_number": 0.9,
    }
    length_score = len(match) / 20
    specificity_score = weights.get(pattern, 0.5)
    return min(1.0, length_score + specificity_score)


def detect_sensitive_data_with_scores(text,mask=False):
    results = {}
    # Regex-based detection
    for key, pattern in patterns.items():
        matches = re.findall(pattern, text)
        results[key] = [
            {
                "match": match,
                "confidence": calculate_confidence(match, key),
                "sensitivity": sensitivity_map.get(key, "unknown"),
                "associated_regulations": compliance_rules.get(key, []),
            }
            for match in matches
        ]
    return results