with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('if(v&&U.length){n.lineShown=!0;')
print(code[idx:idx + 4000])
