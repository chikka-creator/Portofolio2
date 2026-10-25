import re

for fn in [r'c:\portofolio\scratch\taqy_assets\ggOkP6o7.js', r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js']:
    with open(fn, 'r', encoding='utf-8', errors='ignore') as f:
        t = f.read()
    print(f'Checking {fn}:')
    for m in re.finditer(r'playRatchet\s*[:=]', t):
        idx = m.start()
        print(f'Found in {fn} at {idx}')
        with open(r'c:\portofolio\scratch\uo_def.js', 'w', encoding='utf-8') as out:
            out.write(t[max(0, idx-1000):min(len(t), idx+2000)])
