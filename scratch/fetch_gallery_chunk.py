import urllib.request

url = "https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/gl5MsRZwKJv-QwaZ_ek1TgHXUs3RKazQw1H1uNxnM4Q.arRaCOjt.mjs"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
code = urllib.request.urlopen(req).read().decode('utf-8')
with open("scratch/farline_gallery_chunk.mjs", "w", encoding="utf-8") as f:
    f.write(code)

print("Saved farline_gallery_chunk.mjs, len:", len(code))
