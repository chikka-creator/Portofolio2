import re

with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

# find where stepX is referenced in code
matches = [m.start() for m in re.finditer(r'stepX', code)]
print(f'Found {len(matches)} occurrences of stepX')

for idx in matches:
    start = max(0, idx - 200)
    end = min(len(code), idx + 1200)
    print("--- SNIPPET ---")
    print(code[start:end])
