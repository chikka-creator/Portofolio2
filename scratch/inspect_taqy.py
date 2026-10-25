import os
import re

asset_dir = r'c:\portofolio\scratch\taqy_assets'
files = [f for f in os.listdir(asset_dir) if f.endswith('.js')]

for f in files:
    path = os.path.join(asset_dir, f)
    with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
        text = fp.read()
    print(f'File: {f}, size: {len(text)}')
    
    # check for other chunks
    chunks = set(re.findall(r'/_nuxt/([a-zA-Z0-9_\-\.]+\.js)', text))
    if chunks:
        print('  Other chunks referenced:', chunks)

    # keywords
    for kw in ['three', 'ogl', 'webgl', 'spiral', 'cylinder', 'helix', 'curve', 'vertexShader', 'fragmentShader', 'audio', 'sound', 'pacome', 'pacomepertant']:
        count = len(re.findall(kw, text, re.IGNORECASE))
        if count > 0:
            print(f'  keyword "{kw}": {count}')
