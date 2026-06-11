import os
import re
import json
import urllib.request
import urllib.parse
from pathlib import Path

# Paths
base_dir = Path(r"C:\Users\VINHNT\AppData\Local\Temp").parent # fallback just in case, but let's use explicit path
project_dir = Path(r"C:\Users\VINHNT\.gemini\antigravity\scratch\nexhubshop-clone")
input_json_path = Path(r"C:\Users\VINHNT\.gemini\antigravity\scratch\extracted_products.json")
output_json_dir = project_dir / "src" / "data"
output_json_path = output_json_dir / "extracted_products.json"

public_dir = project_dir / "public"
products_img_dir = public_dir / "images" / "products"
categories_img_dir = public_dir / "images" / "categories"

# Ensure directories exist
products_img_dir.mkdir(parents=True, exist_ok=True)
categories_img_dir.mkdir(parents=True, exist_ok=True)
output_json_dir.mkdir(parents=True, exist_ok=True)

# Load data
with open(input_json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

def download_image(url, dest_dir):
    if not url:
        return ""
    
    if url.startswith('//'):
        url = 'https:' + url
        
    try:
        # Extract filename
        parsed_url = urllib.parse.urlparse(url)
        filename = os.path.basename(parsed_url.path)
        if not filename:
            filename = "img_" + str(abs(hash(url))) + ".png"
            
        # Clean filename from weird query params or characters
        filename = re.sub(r'[?#].*$', '', filename)
        filename = re.sub(r'[^\w\-.]', '_', filename)
        
        dest_path = dest_dir / filename
        
        # Download if it doesn't exist already
        if not dest_path.exists():
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response, open(dest_path, 'wb') as out_file:
                out_file.write(response.read())
            print(f"Downloaded: {filename}")
        else:
            print(f"Already exists: {filename}")
            
        # Return path relative to public folder
        rel_path = f"/images/{dest_dir.name}/{filename}"
        return rel_path
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return url # fallback to remote URL on failure

print("--- Downloading Product Images ---")
for idx, p in enumerate(data["products"]):
    url = p.get("image")
    if url:
        local_path = download_image(url, products_img_dir)
        p["image"] = local_path
    print(f"Product {idx+1}/{len(data['products'])} processed")

print("\n--- Downloading Category Images ---")
for idx, c in enumerate(data["categories"]):
    url = c.get("image")
    if url:
        local_path = download_image(url, categories_img_dir)
        c["image"] = local_path
    print(f"Category {idx+1}/{len(data['categories'])} processed")

# Save updated JSON
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nSUCCESS: Assets downloaded and updated JSON saved to {output_json_path}")
