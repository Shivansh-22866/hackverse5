import re

def tag_sensitivity(results):
    sensitivity_map = {
    "email": "Low",
    "phone_number": "Medium",
    "credit_card": "High",
    "ssn": "High",
    "ip_address": "Medium",
    "date": "Low",
    "customer_id": "Medium",
    "business_id": "Medium"
    }
    for key, matches in results.items():
        for match in matches:
            match["sensitivity"] = sensitivity_map.get(key, "Low")
    return results

# masking.py
def mask_data(match, data_type):
    if data_type == "ssn":
        return f"{match[:3]}-XX-XXXX"
    elif data_type == "credit_card":
        return f"{match[:4]} XXXX XXXX {match[-4:]}"
    elif data_type == "email":
        username, domain = match.split("@")
        return f"{username[:2]}***@{domain}"
    elif data_type == "phone_number":
        return f"{match[:3]}-XXX-XXXX"
    else:
        return match
