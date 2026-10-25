with open("scratch/gallery_table_extracted.js", "r", encoding="utf-8") as f:
    code = f.read()

# Let's inspect sections
lines = [code[i:i+300] for i in range(0, min(len(code), 6000), 300)]
for i, l in enumerate(lines[:12]):
    print(f"\n--- Section {i} ---")
    print(l)
