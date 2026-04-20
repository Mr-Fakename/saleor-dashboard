import json
import os
import math


def split_json_file(input_path, chunk_size=500):
    """
    Splits a JSON object into smaller JSON files based on top-level key count.
    """

    # Check if file exists
    if not os.path.exists(input_path):
        print(f"Error: The file '{input_path}' was not found.")
        return

    try:
        print(f"--- Reading {input_path} ---")
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Ensure the root is a dictionary
        if not isinstance(data, dict):
            print("Error: The JSON root must be an object (dictionary), not a list.")
            return

        keys = list(data.keys())
        total_keys = len(keys)
        print(f"Total top-level keys found: {total_keys}")

        # Calculate number of parts
        num_parts = math.ceil(total_keys / chunk_size)
        print(f"Splitting into approximately {num_parts} files of {chunk_size} keys each.\n")

        # Create a subfolder for the output to keep things clean
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_dir = f"{base_name}_chunks"
        os.makedirs(output_dir, exist_ok=True)

        verification_count = 0

        # Loop through keys in chunks
        for i in range(0, total_keys, chunk_size):
            # Slice the keys for this batch
            current_keys = keys[i: i + chunk_size]

            # Construct the new dictionary for this chunk
            chunk_data = {k: data[k] for k in current_keys}

            # Generate filename (e.g., filename_part_001.json)
            part_num = (i // chunk_size) + 1
            output_filename = f"{base_name}_part_{part_num:03d}.json"
            output_path = os.path.join(output_dir, output_filename)

            # Write to file
            with open(output_path, 'w', encoding='utf-8') as out_f:
                # ensure_ascii=False ensures special characters are not escaped (readable text)
                json.dump(chunk_data, out_f, indent=2, ensure_ascii=False)

            keys_in_chunk = len(chunk_data)
            verification_count += keys_in_chunk
            print(f"Saved: {output_filename} ({keys_in_chunk} keys)")

        print("-" * 30)
        print("VERIFICATION REPORT")
        print("-" * 30)
        print(f"Original Key Count: {total_keys}")
        print(f"Exported Key Count: {verification_count}")

        if total_keys == verification_count:
            print(f"✅ SUCCESS: All keys accounted for. Files are in folder: '{output_dir}'")
        else:
            print(f"❌ ERROR: Mismatch detected. {total_keys - verification_count} keys missing.")

    except json.JSONDecodeError:
        print("Error: Failed to decode JSON. Please check if the input file is valid JSON.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


# --- CONFIGURATION ---
# Replace 'your_translation_file.json' with your actual file name
input_json_file = 'source.json'

# Run the function
if __name__ == "__main__":
    # You can change the filename below or pass it as an argument
    import sys

    if len(sys.argv) > 1:
        split_json_file(sys.argv[1])
    else:
        # Fallback if no command line argument provided
        # Create a dummy file for testing if source.json doesn't exist
        if not os.path.exists(input_json_file):
            print(f"'{input_json_file}' not found. Please create it or run: python split_json.py <filename>")
        else:
            split_json_file(input_json_file)