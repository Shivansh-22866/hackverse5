from app.api import process_file

if __name__ == "__main__":
    # Set your file path and output path here
    file_path = "/Users/keshavdadhich/Documents/Hackverse/uploads/test_data.csv"  # Replace with the actual file path

    # Process the file
    results = process_file(file_path)

    def print_masked_output(masked_data):
        for attribute, entries in masked_data.items():
            print(f"--- {attribute.upper()} ---")  # Print section header
            for entry in entries:
                print(
                    f"Match: {entry['match']}, Masked: {entry['masked_value']}, "
                    f"Confidence: {entry['confidence']}, Regulations: {', '.join(entry['associated_regulations'])}"
                )
        print()

    def print_masked_counts(masked_data):
        print("--- Masked Entries Count ---")
        total_masked = 0
        for attribute, entries in masked_data.items():
            masked_count = sum(
            1 for entry in entries if entry['masked_value'] != entry['match']
            )
            total_masked += masked_count
            print(f"{attribute.capitalize()}: {masked_count} masked entries")

        print(f"Total Masked Entries: {total_masked}")

    # Handle results
    if "error" in results:
        print(f"Error: {results['error']}")
    else:
        print_masked_counts(results)
        print_masked_output(results)
