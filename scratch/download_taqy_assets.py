import re
import urllib.request
import os

with open(r'c:\portofolio\scratch\taqy_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# find all /_nuxt/ files
nuxt_files = set(re.findall(r'/_nuxt/[a-zA-Z0-9_\-\.]+\.(?:js|css)', html))
print('Nuxt files in HTML:')
for nf in sorted(nuxt_files):
    print(nf)

# Also download the main js file and find any referenced chunks or three.js / ogl / webgl / shaders
out_dir = r'c:\portofolio\scratch\taqy_assets'
os.makedirs(out_dir, exist_ok=True)

for nf in sorted(nuxt_files):
    url = f'https://taqy.tech{nf}'
    fname = os.path.basename(nf)
    dest = os.path.join(out_dir, fname)
    if not os.path.exists(dest):
        print('Downloading', url)
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as resp:
                content = resp.read()
            with open(dest, 'wb') as df:
                df.write(content)
        except Exception as e:
            print('Failed to download', url, e)

print('Done downloading assets.')
