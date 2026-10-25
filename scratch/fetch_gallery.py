import urllib.request
import re

url = "https://farline.framer.website/gallery"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')

with open("scratch/farline_gallery.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved HTML, length:", len(html))
chunks = re.findall(r'https://framerusercontent\.com/modules/[^\s"\'()<>]+\.mjs', html)
print("Chunks found:", len(chunks))
for c in set(chunks):
    print("Chunk:", c)
