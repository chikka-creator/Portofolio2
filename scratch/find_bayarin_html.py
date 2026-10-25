with open(r'c:\portofolio\scratch\taqy_index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('Bayarin')
if idx != -1:
    print('Found Bayarin in HTML at', idx)
    with open(r'c:\portofolio\scratch\cards_payload.txt', 'w', encoding='utf-8') as out:
        out.write(text[max(0, idx-500):min(len(text), idx+4000)])
    print('Saved cards_payload.txt')
else:
    print('Bayarin not found in HTML')
