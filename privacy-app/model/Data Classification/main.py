from app.api import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from concurrent.futures import ThreadPoolExecutor
from app.file_parser import process_file

def process_multiple_files(file_list):
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = list(executor.map(process_file, file_list))
    return results
