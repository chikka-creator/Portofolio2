import os
import re

path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find setup function around spiralScrollOffset
idx = text.find('spiralScrollOffset')
if idx != -1:
    start = max(0, idx - 200)
    end = min(len(text), idx + 25000)
    snippet = text[start:end]
    with open(r'c:\portofolio\scratch\spiral_component.js', 'w', encoding='utf-8') as sf:
        sf.write(snippet)
    print('Wrote spiral component snippet, length:', len(snippet))
else:
    print('spiralScrollOffset not found')
