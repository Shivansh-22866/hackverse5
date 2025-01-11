import re
from app.config import patterns

def calculate_confidence(match, pattern):
    weights = {
        "email": 0.9,
        "phone_number": 0.8,
        "credit_card": 0.95,
        "ssn": 0.9,
        "ip_address": 0.85,
        "date": 0.7,
    }
    length_score = len(match) / 20
    specificity_score = weights.get(pattern, 0.5)
    return min(1.0, length_score + specificity_score)

def detect_sensitive_data_with_scores(text):
    results = {}
    for key, pattern in patterns.items():
        matches = re.findall(pattern, text)
        results[key] = [{"match": match, "confidence": calculate_confidence(match, key)} for match in matches]
    return results

from .sensitivity import assign_sensitivity

def detect_sensitive_data(text):
    results = {}
    for category, pattern in patterns.items():
        matches = re.findall(pattern, text)
        if matches:
            for match in matches:
                sensitivity = assign_sensitivity(match, category)
                results.setdefault(category, []).append({
                    "match": match,
                    "sensitivity": sensitivity
                })
    return results

from .compliance import assign_compliance_metadata

def detect_sensitive_data(text):
    results = {}
    for category, pattern in patterns.items():
        matches = re.findall(pattern, text)
        if matches:
            for match in matches:
                sensitivity = assign_sensitivity(match, category)
                compliance = assign_compliance_metadata(match, category)
                results.setdefault(category, []).append({
                    "match": match,
                    "sensitivity": sensitivity,
                    "compliance": compliance
                })
    return results

