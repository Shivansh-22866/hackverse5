import os
import re
import random
import string
import json
from datetime import datetime
from cryptography.fernet import Fernet
from PyPDF2 import PdfReader
from docx import Document
from pytesseract import image_to_string
from PIL import Image
import textract
from loguru import logger
import pandas as pd
from email import policy
from email.parser import BytesParser
from app.config import patterns
from app.masking import mask_data
from app.masking import tag_sensitivity
from app.detection import detect_sensitive_data_with_scores, calculate_confidence
from app.compliance import assign_compliance_metadata

# Logger setup
logger.add("logs/{time}.log")

# Constants
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
key = Fernet.generate_key()  # Encryption key
cipher_suite = Fernet(key)

sensitive_fields = ["email", "phone_number", "credit_card", "ssn", "ip_address", "customer_id"]

# Utility Functions
def generate_random_pseudonym(length=10):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def pseudonymize_data(data, sensitive_fields):
    return {key: generate_random_pseudonym() if key in sensitive_fields else value for key, value in data.items()}

def encrypt_data(data):
    return cipher_suite.encrypt(data.encode())

def decrypt_data(encrypted_data):
    return cipher_suite.decrypt(encrypted_data).decode()

def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)
        return "".join(page.extract_text() for page in reader.pages)
    except Exception as e:
        return f"Error extracting PDF: {e}"

def extract_text_from_word(file_path):
    try:
        doc = Document(file_path)
        return "\n".join(paragraph.text for paragraph in doc.paragraphs)
    except Exception as e:
        return f"Error extracting Word document: {e}"

def extract_text_from_image(file_path):
    try:
        image = Image.open(file_path)
        return image_to_string(image)
    except Exception as e:
        return f"Error extracting image text: {e}"

def extract_text_from_other(file_path):
    try:
        return textract.process(file_path).decode('utf-8')
    except Exception as e:
        return f"Error extracting text: {e}"

def extract_text_from_email(file_path):
    try:
        with open(file_path, 'rb') as file:
            msg = BytesParser(policy=policy.default).parse(file)
        if msg.is_multipart():
            return "".join(part.get_content() for part in msg.iter_parts() if part.get_content_type() == "text/plain").strip()
        return msg.get_content().strip()
    except Exception as e:
        return f"Error extracting email content: {e}"

def apply_pipeline(matches, file_path):
    for key, data in matches.items():
        for match in data:
            if isinstance(match, dict):
                # Mask sensitive data
                match["masked_value"] = mask_data(match.get("match", ""), key)
                # Assign compliance metadata
                match["associated_regulations"] = assign_compliance_metadata(match, key)
    return matches

# File Scanning Functions
def scan_csv_with_scores(file_path):
    df = pd.read_csv(file_path)
    matches = {}
    for col in df.columns:
        for key, pattern in patterns.items():
            detected = df[col].astype(str).str.findall(pattern).sum()
            if detected:
                matches[key] = matches.get(key, []) + [{"match": match, "confidence": calculate_confidence(match, key)} for match in detected]
    return matches

def scan_json_with_scores(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    matches = {}
    for key, pattern in patterns.items():
        detected = re.findall(pattern, str(data))
        matches[key] = matches.get(key, []) + [{"match": match, "confidence": calculate_confidence(match, key)} for match in detected]
    return matches

# Master Processing Function
def process_file(file_path):
    try:
        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"File {file_path} not found.")
        
        if file_path.endswith(".csv"):
            matches = scan_csv_with_scores(file_path)
            counts = count_masks(matches)
        elif file_path.endswith(".json"):
            matches = scan_json_with_scores(file_path)
            counts = count_masks(matches)
        elif file_path.endswith(".txt"):
            with open(file_path, "r") as f:
                text = f.read()
            matches = detect_sensitive_data_with_scores(text)
            counts = count_masks(matches)
        elif file_path.endswith(".pdf"):
            text = extract_text_from_pdf(file_path)
            matches = detect_sensitive_data_with_scores(text)
            counts = count_masks(matches)
        elif file_path.endswith(".docx"):
            text = extract_text_from_word(file_path)
            matches = detect_sensitive_data_with_scores(text)
            counts = count_masks(matches)
        elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
            text = extract_text_from_image(file_path)
            matches = detect_sensitive_data_with_scores(text)
            counts = count_masks(matches)
        elif file_path.endswith(".eml"):
            text = extract_text_from_email(file_path)
            matches = detect_sensitive_data_with_scores(text)
            counts = count_masks(matches)
        else:
            return {"error": "Unsupported file type"}

        matches = apply_pipeline(matches, file_path)
        logger.info("Sensitive data detected in file: {}", file_path)
        return matches

    except Exception as e:
        logger.error(f"Error processing file {file_path}: {e}")
        return {"error": str(e)}
    

def count_masks(matches):
    counts = {
        "email": 0,
        "phone_number": 0,
        "credit_card": 0,
        "ssn": 0,
        "ip_address": 0,
        "customer_id": 0
    }
    for key, match_list in matches.items():
        counts[key] = len(match_list)
    return counts

