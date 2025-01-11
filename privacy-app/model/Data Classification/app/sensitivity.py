def assign_sensitivity(match, category):
    sensitivity_levels = {
        "email": "Medium",
        "phone_number": "Medium",
        "credit_card": "High",
        "ssn": "High",
        "ip_address": "Low",
        "date": "Low",
    }
    return sensitivity_levels.get(category, "Low")
