with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

import re
css_matches = re.findall(r'<style[^>]*>(.*?)</style>', code, re.DOTALL)
print('Style tags found:', len(css_matches))
for i, s in enumerate(css_matches):
    print(f'--- STYLE {i} ({len(s)} chars) ---')
    print(s[:2000])

# also search for template literals with CSS
css_blocks = re.findall(r'\.pm-[a-zA-Z0-9_\-]+\s*{[^}]+}', code)
print('pm classes found:', len(css_blocks))
with open('scratch/farline_css.css', 'w', encoding='utf-8') as f:
    for c in css_blocks:
        f.write(c + '\n')
