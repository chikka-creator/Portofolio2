import re

with open(r'c:\portofolio\scratch\taqy_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

styles = re.findall(r'<style[^>]*>([\s\S]*?)</style>', html)
with open(r'c:\portofolio\scratch\taqy_styles.css', 'w', encoding='utf-8') as out:
    for s in styles:
        out.write(s + '\n\n')

print(f'Saved {len(styles)} styles to taqy_styles.css')
