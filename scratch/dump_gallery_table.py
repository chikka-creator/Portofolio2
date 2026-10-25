with open("scratch/farline_gallery_chunk.mjs", "r", encoding="utf-8") as f:
    code = f.read()

import re

# Find where dealIn is defined
pos = code.find("dealIn")
print("Position of dealIn:", pos)
start = code.rfind("function ", 0, pos)
print("Function start:", start)
# Find the end of this component (next large function or export)
end = code.find("displayName", pos)
end = code.find(";", end) + 1
print("Function end:", end)

component_code = code[start:end]
with open("scratch/gallery_table_extracted.js", "w", encoding="utf-8") as f:
    f.write(component_code)

print("Saved gallery_table_extracted.js, len:", len(component_code))
