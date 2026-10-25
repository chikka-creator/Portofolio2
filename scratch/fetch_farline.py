import urllib.request, re

req = urllib.request.Request('https://farline.framer.website', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8')

with open('scratch/farline.html', 'r', encoding='utf-8') as f:
    text = f.read()

for m in re.finditer(r'<script[^>]*>(.*?)</script>', text, re.DOTALL):
    print('SCRIPT:', m.group(0)[:200])

for m in re.finditer(r'href=["\']([^"\']+\.mjs)["\']', text):
    print('MJS:', m.group(1))

for m in re.finditer(r'<canvas[^>]*>', text):
    print('CANVAS:', m.group(0))
