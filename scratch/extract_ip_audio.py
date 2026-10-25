import re

path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find exact Up
idx_up = text.find('varying vec2 vUv;')
if idx_up != -1:
    print('=== VERTEX SHADER (Up) ===')
    end_up = text.find('`', idx_up)
    print(text[idx_up-30:end_up+1])

# find exact Ip
idx_ip = text.find('const Ip=')
if idx_ip == -1:
    idx_ip = text.find('Ip=`')
if idx_ip != -1:
    print('=== FRAGMENT SHADER (Ip) ===')
    end_ip = text.find('`', idx_ip + 10)
    print(text[idx_ip:end_ip+1])
else:
    # let's search for Ip=
    for m in re.finditer(r'\bIp\s*=\s*[`"]([\s\S]*?)[`"]', text):
        print('Found Ip:\n', m.group(0))

# Search for audio functions (uo)
print('\n=== Searching audio module ===')
idx_audio = text.find('playRatchet')
if idx_audio != -1:
    start_a = max(0, idx_audio - 300)
    end_a = min(len(text), idx_audio + 2500)
    print(text[start_a:end_a])
