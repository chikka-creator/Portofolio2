import os, re

# Find all asset references in html, css, js
patterns = [
    r'(?:src|href|srcset|url)=["\']([^"\']+\.(?:webp|woff2|svg|png|jpg|jpeg))["\']',
    r'url\(["\']?([^)"\']+\.(?:webp|woff2|svg|png|jpg|jpeg))["\']?\)',
    r'["\'](assets/[^"\']+\.(?:webp|woff2|svg|png|jpg|jpeg))["\']'
]

referenced = set()
for root, dirs, files in os.walk('.'):
    if any(x in root for x in ['docs', '.git', 'brain', 'scratch']): continue
    for f in files:
        if f.endswith(('.html', '.css', '.js')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                for pat in patterns:
                    for m in re.findall(pat, txt):
                        # clean up relative prefixes like ../
                        clean = m.replace('../', 'assets/') if m.startswith('../') else m
                        if clean.startswith('http'): continue
                        referenced.add((p, m, clean))

missing = []
for file_from, orig, clean in referenced:
    # check from root or relative to file
    exists = os.path.exists(clean) or os.path.exists(os.path.join(os.path.dirname(file_from), orig))
    if not exists:
        missing.append((file_from, orig, clean))

if missing:
    print('Missing assets:', missing)
else:
    print(f'All {len(referenced)} referenced assets exist on disk!')
