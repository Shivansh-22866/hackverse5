import pandas as pd
from app.detection import calculate_confidence

def scan_csv_with_scores(file_path, patterns):
    df = pd.read_csv(file_path)
    matches = {}
    for col in df.columns:
        for key, pattern in patterns.items():
            detected = df[col].astype(str).str.findall(pattern).sum()
            if detected:
                matches[key] = matches.get(key, []) + [
                    {"match": match, "confidence": calculate_confidence(match, key)} for match in detected
                ]
    return matches


def scan_json_with_scores(file_path, patterns):
    import json
    with open(file_path, 'r') as file:
        data = json.load(file)
    matches = {}
    for key, pattern in patterns.items():
        detected = re.findall(pattern, str(data))
        matches[key] = matches.get(key, []) + [
            {"match": match, "confidence": calculate_confidence(match, key)} for match in detected
        ]
    return matches

def scan_plain_text_with_scores(file_path, patterns):
    with open(file_path, 'r') as file:
        text = file.read()
    return detect_sensitive_data_with_scores(text, patterns)

from .masking import mask_sensitive_data

def process_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    masked_content = mask_sensitive_data(content)
    return masked_content

path = "/Users/keshavdadhich/Documents/Hackverse/uploads/test_data.csv"
from loguru import logger

logger.add("logs/{time}.log")
logger.info("Sensitive data detected in file: {}", path)

