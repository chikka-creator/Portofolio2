import urllib.request
import re
import os

with open(r'c:\portofolio\scratch\taqy_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

css_links = re.findall(r'href=["\'](/_nuxt/[^"\']+\.css)["\']', html)
print('CSS links:', css_links)

out_dir = r'c:\portofolio\scratch\taqy_assets'
for css in css_links:
    url = f'https://taqy.tech{css}'
    fname = os.path.basename(css)
    dest = os.path.join(out_dir, fname)
    if not os.path.exists(dest):
        print('Downloading CSS:', url)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
        with open(dest, 'wb') as cf:
            cf.write(content)

# inspect all css files in taqy_assets
for f in os.listdir(out_dir):
    if f.endswith('.css'):
        fpath = os.path.join(out_dir, f)
        print(f, 'size:', os.path.getsize(fpath))
