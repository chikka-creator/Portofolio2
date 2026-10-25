with open(r'c:\portofolio\scratch\taqy_assets\ggOkP6o7.js', 'r', encoding='utf-8', errors='ignore') as f:
    t = f.read()

idx = t.find('audioEnabled:st')
if idx != -1:
    # search backwards for function uo
    start = max(0, idx - 2500)
    with open(r'c:\portofolio\scratch\full_audio_synth.js', 'w', encoding='utf-8') as out:
        out.write(t[start:idx+300])
    print('Saved full_audio_synth.js')
