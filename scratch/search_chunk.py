with open("scratch/farline_gallery_chunk.mjs", "r", encoding="utf-8") as f:
    code = f.read()

import re

keywords = ["drag", "table", "lift", "closer", "frames", "zoom", "rotate", "transform", "Light"]
for kw in keywords:
    count = len(re.findall(kw, code, re.IGNORECASE))
    print(f"Keyword '{kw}': {count}")

# Print first 2000 chars
print("\nFirst 1500 chars:")
print(code[:1500])
