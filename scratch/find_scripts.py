import re

with open("scratch/farline_gallery.html", "r", encoding="utf-8") as f:
    html = f.read()

scripts = re.findall(r'<script[^>]*src=[\'"]([^\'"]+)[\'"]', html)
print("Scripts:")
for s in scripts:
    print(" ", s)

inline = re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', html, re.DOTALL)
print("Inline scripts count:", len(inline))
for i, s in enumerate(inline):
    if len(s) > 200:
        print(f"Inline script {i} ({len(s)} chars):", s[:200], "...")
