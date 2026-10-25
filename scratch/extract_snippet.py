with open('scratch/QOU7ZF6SQAJQ0MCm8l0Jh76jksyZdgWAmFzQEx39cbM.SMijqcqs.mjs', 'r', encoding='utf-8') as f:
    code = f.read()

# Let's find He and the render function
idx = code.find('fov:87')
start = max(0, idx - 1000)
end = min(len(code), idx + 8000)

with open('scratch/farline_render_snippet.js', 'w', encoding='utf-8') as f:
    f.write(code[start:end])

print(f'Wrote {end - start} bytes to scratch/farline_render_snippet.js')
