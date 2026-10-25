with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

import re
matches = [m.start() for m in re.finditer(r'cardBack', code)]
print(f'cardBack occurrences: {len(matches)}')
for idx in matches:
    print(code[max(0, idx - 150):min(len(code), idx + 250)])
    print('---')
