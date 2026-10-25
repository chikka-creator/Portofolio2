import re

with open("scratch/farline_gallery_chunk.mjs", "r", encoding="utf-8") as f:
    code = f.read()

imports = re.findall(r'import\s+.*?from\s+[\'"]([^\'"]+)[\'"]', code)
print("Imports in gallery chunk:")
for imp in set(imports):
    print(" ", imp)

# Search for component names or functions
matches = re.findall(r'displayName\s*=\s*[\'"]([^\'"]+)[\'"]', code)
print("Display names:", matches)
