with open("scratch/farline_gallery_chunk.mjs", "r", encoding="utf-8") as f:
    code = f.read()

import re

# find function names or component definitions
functions = re.findall(r'function\s+([a-zA-Z0-9_]+)\s*\(', code)
print("Functions count:", len(functions))

# Search for Light Table or table or canvas
snippets = []
for m in re.finditer(r'(?:Light\s*Table|drag|zoom|hover|print)', code, re.IGNORECASE):
    start = max(0, m.start() - 150)
    end = min(len(code), m.end() + 250)
    snippets.append(code[start:end])

print(f"Snippets found: {len(snippets)}")
for i, snip in enumerate(snippets[:6]):
    print(f"\n--- Snippet {i} ---")
    print(snip)
