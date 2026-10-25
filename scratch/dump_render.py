with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

idx = code.find('let S=Y(1.5-o/s)')
print(code[idx:idx + 5000])
