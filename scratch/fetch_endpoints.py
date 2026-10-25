import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
for ep in ['/api/showcase-cards', '/api/site-settings']:
    url = f'https://taqy.tech{ep}'
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
        print(f'=== {ep} ===')
        fname = ep.replace('/', '_') + '.json'
        with open(rf'c:\portofolio\scratch\{fname}', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f'Saved to {fname}')
    except Exception as e:
        print(f'Error fetching {ep}:', e)
