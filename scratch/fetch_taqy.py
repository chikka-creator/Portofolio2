import urllib.request
import re
import json
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
req = urllib.request.Request('https://taqy.tech/', headers=headers)
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
    print('HTML length:', len(html))
    with open(r'c:\portofolio\scratch\taqy_index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
    print('Scripts found:')
    for s in scripts:
        print(' -', s)
    
    # Also find any inline script or next/vite chunks
    chunks = re.findall(r'/_next/static/[a-zA-Z0-9_\-\./]+', html)
    print(f'Next.js chunks found ({len(chunks)}):')
    for c in set(chunks):
        print(' -', c)

except Exception as e:
    print('Error:', e)
