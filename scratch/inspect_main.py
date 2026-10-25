import urllib.request, re

urls = [
    'https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/script_main.JCISeFMH.mjs',
    'https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs'
]

for u in urls:
    name = u.split('/')[-1]
    with urllib.request.urlopen(u) as resp:
        txt = resp.read().decode('utf-8')
    with open('scratch/' + name, 'w', encoding='utf-8') as f:
        f.write(txt)
    print(f'Downloaded {name}, size: {len(txt)}')

    # search inside
    for kw in ['rotate', 'perspective', 'translate', 'wire', 'peg', 'hang', 'plate', 'canvas', 'mesh', 'scene', 'fov', 'dolly', 'spring']:
        m = len(re.findall(kw, txt, re.IGNORECASE))
        if m > 0:
            print(f'  {name} has {m} matches for {kw}')
