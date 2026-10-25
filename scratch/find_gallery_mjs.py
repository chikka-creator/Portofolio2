import re

with open(r'C:\Users\fakhri\.gemini\antigravity-ide\brain\008f83a8-495a-46f9-851f-f55ea0972c80\.system_generated\steps\1050\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

modules = re.findall(r'https://[^\s"\'()<>]+\.mjs', text)
print('Modules found:', len(modules))
for m in set(modules):
    print(m)
