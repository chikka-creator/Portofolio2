import re

with open(r'c:\portofolio\scratch\taqy_styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

print('CSS size:', len(css))
keywords = ['view-switch', 'view-pill', 'sound-toggle', 'spiral-hover-tag', 'hover-tag', 'badge-loop', 'list-container', 'preview-follower', 'list-project-title', 'webgl-canvas']
for kw in keywords:
    matches = re.findall(rf'(\.[^{{;]*?{kw}[^{{;]*?\{{[^}}]*\}})', css)
    print(f'Matches for {kw}: {len(matches)}')
    for m in matches[:2]:
        print('  ', m[:180])
