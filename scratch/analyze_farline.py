import os, re, urllib.request

with open('scratch/Ofo1Tmj_R.CF6jmeMT.mjs', 'r', encoding='utf-8') as f:
    txt = f.read()

print('Length:', len(txt))
# search keywords like transform, rotate, hang, wire, peg, clamp, plate
for kw in ['rotate', 'perspective', 'translate', 'clamp', 'wire', 'peg', 'hang', 'plate', 'canvas', 'mesh', 'scene']:
    matches = [m.start() for m in re.finditer(kw, txt, re.IGNORECASE)]
    print(f'Keyword "{kw}": {len(matches)} matches')

# print snippets of matches
for kw in ['perspective', 'rotate', 'peg']:
    for m in re.finditer(kw, txt, re.IGNORECASE):
        start = max(0, m.start() - 60)
        end = min(len(txt), m.end() + 100)
        print(f'[{kw}] {txt[start:end]}\n')
