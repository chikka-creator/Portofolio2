with open(r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

idx = text.find('Bayarin Mobile')
if idx != -1:
    print('Found Bayarin Mobile in BglMqFnM.js at', idx)
    print(text[max(0, idx-300):min(len(text), idx+1500)])
