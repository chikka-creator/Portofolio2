import re

for fn in [r'c:\portofolio\scratch\taqy_assets\ggOkP6o7.js', r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js']:
    with open(fn, 'r', encoding='utf-8', errors='ignore') as f:
        t = f.read()
    apis = set(re.findall(r'["\'](/api/[^"\']+)["\']', t))
    print(f'APIs in {fn}:', apis)
