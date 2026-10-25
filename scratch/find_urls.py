import re

with open('scratch/farline.html', 'r', encoding='utf-8') as f:
    html = f.read()

urls = set(re.findall(r'https://framerusercontent\.com/[^\s"\'<>)]+', html))
print(f'Total framerusercontent URLs: {len(urls)}')
for u in sorted(urls):
    if u.endswith('.mjs') or u.endswith('.js'):
        print('JS/MJS:', u)
