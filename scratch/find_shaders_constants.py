import re

path = r'c:\portofolio\scratch\taqy_assets\BglMqFnM.js'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# find Up and Ip definitions
print('=== Searching for Up & Ip definitions ===')
# Look around vertexShader: Up
m = re.search(r'const\s+Up\s*=\s*[`"\']([\s\S]*?)[`"\']', text)
if m:
    print('Up (vertexShader):')
    print(m.group(0)[:800])
else:
    # let's search Up=
    m2 = re.search(r'(?:let|const|var)?\s*Up\s*=\s*[`"][\s\S]*?[`"]', text)
    if m2:
        print('Found Up:', m2.group(0)[:800])
    else:
        print('Up definition not matched directly, searching references...')
        for match in re.finditer(r'vertexShader\s*:\s*([a-zA-Z0-9_$]+)', text):
            print('vertexShader:', match.group(0))

m_ip = re.search(r'const\s+Ip\s*=\s*[`"\']([\s\S]*?)[`"\']', text)
if m_ip:
    print('Ip (fragmentShader):')
    print(m_ip.group(0)[:800])
else:
    for match in re.finditer(r'fragmentShader\s*:\s*([a-zA-Z0-9_$]+)', text):
        print('fragmentShader:', match.group(0))

# Search for constants ni, ii, so, io, ro, Dp, ao
print('\n=== Searching for constants ===')
for var in ['ni', 'ii', 'so', 'io', 'ro', 'Dp', 'ao']:
    m_var = re.search(rf'(?:const|let|var)\s+{var}\s*=\s*([^,;\n]+)', text)
    if m_var:
        print(f'{var} = {m_var.group(1)}')
    else:
        # search {var}=
        m_var2 = re.search(rf'\b{var}\s*=\s*([0-9\.\-]+)', text)
        if m_var2:
            print(f'{var} = {m_var2.group(1)}')
