import os, re

with open('assets/js/i18n.js', 'r', encoding='utf-8') as f:
    content = f.read()

id_block = content.split('id: {')[1].split('en: {')[0]
en_block = content.split('en: {')[1].split('let currentLang')[0]

id_keys = set(re.findall(r'(\w+)\s*:', id_block))
en_keys = set(re.findall(r'(\w+)\s*:', en_block))

print(f'Total id keys: {len(id_keys)}, en keys: {len(en_keys)}')
diff = id_keys.symmetric_difference(en_keys)
if diff:
    print('Key mismatch between id and en:', diff)
else:
    print('id and en dictionaries are perfectly symmetric!')

missing = []
for html in ['index.html', 'work.html', 'gallery.html', 'about.html', 'contact.html']:
    with open(html, 'r', encoding='utf-8') as f:
        html_content = f.read()
    keys = re.findall(r'data-i18n(?:-html|-ph)?=["\']([^"\']+)["\']', html_content)
    for k in keys:
        if k not in id_keys:
            missing.append((html, k))

if missing:
    print('Missing keys in dictionary:', missing)
else:
    print('All data-i18n attributes in all HTML files have matching keys in BOTH languages!')
