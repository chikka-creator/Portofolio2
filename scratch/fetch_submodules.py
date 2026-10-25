import urllib.request

urls = [
    "https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/szZxqO8XR.CbG9VRL_.mjs",
    "https://framerusercontent.com/sites/6CLuXpGUnpOKPIAEJB9sd0/OBEEVhA6tWwRJ4hrfskNWkDVbWFJtW90BrTXmidri4o.CXvCclut.mjs"
]

for u in urls:
    name = u.split("/")[-1]
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    code = urllib.request.urlopen(req).read().decode('utf-8')
    with open("scratch/" + name, "w", encoding="utf-8") as f:
        f.write(code)
    print("Fetched", name, "size:", len(code))
