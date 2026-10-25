path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('audioEnabled')
with open(r'c:\portofolio\scratch\audio_code.js', 'w', encoding='utf-8') as out:
    out.write(text[idx-500:idx+3500])
print('Saved audio code snippet')
