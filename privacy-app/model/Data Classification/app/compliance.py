from datetime import datetime
import sqlite3




def assign_compliance_metadata(match, category):
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
    return compliance_rules.get(category, "General")



