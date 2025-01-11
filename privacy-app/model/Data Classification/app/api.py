from fastapi import FastAPI, UploadFile, File
import os
import shutil
from app.file_parser import (
    scan_csv_with_scores as scan_csv,
    scan_json_with_scores as scan_json,
    scan_plain_text_with_scores as scan_plain_text,
)
from app.config import patterns  # Import the patterns dictionary

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Sensitive Data Detection API!"}

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Save the uploaded file to the uploads directory
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Scan the file after saving
    if file.filename.endswith(".csv"):
        matches = scan_csv(file_path, patterns)  # Pass patterns here
    elif file.filename.endswith(".json"):
        matches = scan_json(file_path, patterns)  # Pass patterns here
    elif file.filename.endswith(".txt"):
        matches = scan_plain_text(file_path, patterns)  # Pass patterns here
    else:
        return {"error": "Unsupported file type"}

    # Return the results
    return {"filename": file.filename, "matches": matches}
