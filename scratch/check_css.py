import re

with open(r'c:\portofolio\scratch\taqy_index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# search for .css in html
matches = re.findall(r'/[^"\'\s>]+\.css', html)
print('CSS references in HTML:', matches)

# check <style> tags
styles = re.findall(r'<style[^>]*>([\s\S]*?)</style>', html)
print(f'Inline <style> tags count: {len(styles)}')
if styles:
    print('Sample inline style (first 500 chars):')
    print(styles[0][:500])
