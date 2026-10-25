import re

with open(r'c:\portofolio\scratch\spiral_component.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Add newlines after semicolons and brackets
formatted = re.sub(r'([;{}])', r'\1\n', code)
with open(r'c:\portofolio\scratch\spiral_component_pretty.js', 'w', encoding='utf-8') as f:
    f.write(formatted)
print('Done pretty printing')
