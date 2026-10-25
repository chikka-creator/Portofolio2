import os
import re

path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find vertex shaders and fragment shaders
shaders = re.findall(r'(?:vertexShader|fragmentShader)\s*:\s*[`"\']([\s\S]*?)[`"\']', text)
print(f'Shaders found: {len(shaders)}')
for i, s in enumerate(shaders[:6]):
    print(f'--- Shader {i} ---')
    print(s[:300])

# find occurrences of spiral
print('\n=== Spiral contexts ===')
matches = [m.start() for m in re.finditer(r'spiral', text, re.IGNORECASE)]
for idx in matches[:10]:
    start = max(0, idx - 150)
    end = min(len(text), idx + 250)
    print('...\n', text[start:end], '\n...')
