with open("scratch/gallery_table_extracted.js", "r", encoding="utf-8") as f:
    code = f.read()

lines = [code[i:i+400] for i in range(3600, min(len(code), 14000), 400)]
for i, l in enumerate(lines):
    print(f"\n--- Section {i+12} ---")
    print(l)
