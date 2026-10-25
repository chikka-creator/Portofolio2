with open(r'c:\portofolio\scratch\taqy_assets\ggOkP6o7.js', 'r', encoding='utf-8', errors='ignore') as f:
    t = f.read()

idx = t.find('playRatchet')
with open(r'c:\portofolio\scratch\audio_implementation.js', 'w', encoding='utf-8') as out:
    out.write(t[max(0, idx-500):min(len(t), idx+2500)])
print('Saved audio_implementation.js')
