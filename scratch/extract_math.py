import re

with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's extract functions or mathematical formulas
print('Total code length:', len(code))

# Find lines or snippets containing rotate, perspective, wire, peg, dolly
patterns = [
    r'(\w+\s*=\s*function[^{]+{[^}]+rotate[^}]+})',
    r'(\bperspective\b[^\n;]+;?)',
    r'(\bfov\b[^\n;]+;?)',
    r'(\brotateY\b[^\n;]+;?)',
    r'(\brotateZ\b[^\n;]+;?)',
    r'(\bwire\b[^\n;]+;?)',
    r'(\bpeg\b[^\n;]+;?)'
]

for pat in patterns:
    matches = re.findall(pat, code)
    print(f'Pattern {pat}: {len(matches)} matches')
    for m in matches[:5]:
        print('   ', m[:160])
