path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('function uo()')
if idx == -1:
    idx = text.find('uo=')
if idx != -1:
    print('Found uo at', idx)
    print(text[idx-50:idx+2500])
else:
    # search around 'audioEnabled'
    idx2 = text.find('audioEnabled')
    if idx2 != -1:
        print('Found audioEnabled at', idx2)
        print(text[idx2-200:idx2+1500])
