import re

with open(r'c:\portofolio\scratch\taqy_assets\ggOkP6o7.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find cards data
m = re.findall(r'title:\s*["\']([^"\']+)["\']', text)
print('Titles found in ggOkP6o7.js:', m[:20])

idx = text.find('Bayarin Mobile')
if idx != -1:
    print('Found Bayarin Mobile at', idx)
    print(text[max(0, idx-200):min(len(text), idx+1200)])
