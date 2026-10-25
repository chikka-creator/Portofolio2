import re

path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# search for AudioContext or sound synthesizer
matches = [m.start() for m in re.finditer(r'AudioContext|webkitAudioContext|playRatchet', text)]
for idx in matches:
    print('Match at', idx)
    with open(rf'c:\portofolio\scratch\audio_match_{idx}.js', 'w', encoding='utf-8') as out:
        out.write(text[max(0, idx-300):min(len(text), idx+1500)])
