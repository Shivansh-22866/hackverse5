def assign_compliance_metadata(match, category):
    compliance_requirements = {
        "email": "GDPR",
        "phone_number": "GDPR, CCPA",
        "credit_card": "PCI-DSS",
        "ssn": "HIPAA, GDPR",
        "ip_address": "GDPR",
        "date": "General"
    }
    return compliance_requirements.get(category, "General")
