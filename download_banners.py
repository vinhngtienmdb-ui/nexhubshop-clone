import os
import urllib.request
from pathlib import Path

project_dir = Path(r"C:\Users\VINHNT\.gemini\antigravity\scratch\nexhubshop-clone")
banners_dir = project_dir / "public" / "images" / "banners"
banners_dir.mkdir(parents=True, exist_ok=True)

banners = [
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/slide_1_img.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/img_item_four_banner_home_1.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/img_item_four_banner_home_2.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/img_item_four_banner_home_3.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/img_item_four_banner_home_4.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/home_banner_bottom_dk.jpg?v=499",
    "https://cdn.hstatic.net/themes/200001108779/1001433049/14/logo.png?v=499" # download logo as well
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for url in banners:
    try:
        # Get filename without query
        filename = url.split('/')[-1].split('?')[0]
        dest_path = banners_dir / filename
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded banner: {filename}")
    except Exception as e:
        print(f"Failed to download banner {url}: {e}")

print("SUCCESS")
