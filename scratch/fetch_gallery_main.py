import urllib.request
import re

url = "https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/script_main.JCISeFMH.mjs"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
code = urllib.request.urlopen(req).read().decode('utf-8')
with open("scratch/gallery_main.mjs", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved gallery_main.mjs, len:", len(code))
imports = re.findall(r'import\s+.*?from\s+[\'"]([^\'"]+)[\'"]', code)
print("Imports:", imports)
for imp in imports:
    print(" ", imp)
