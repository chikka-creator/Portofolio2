from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import threading, time
from playwright.sync_api import sync_playwright

httpd = ThreadingHTTPServer(('127.0.0.1', 8083), SimpleHTTPRequestHandler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
time.sleep(0.5)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for page_name in ['index.html', 'work.html', 'gallery.html', 'about.html', 'contact.html']:
        page = browser.new_page()
        page.goto(f'http://127.0.0.1:8083/{page_name}')
        time.sleep(0.3)
        # click EN
        page.locator('.chrome-lang button[data-lang="en"]').click(force=True)
        time.sleep(0.2)
        lang_doc = page.evaluate('() => document.documentElement.lang')
        ls_lang = page.evaluate('() => localStorage.getItem("lang")')
        # click ID
        page.locator('.chrome-lang button[data-lang="id"]').click(force=True)
        time.sleep(0.2)
        lang_id_doc = page.evaluate('() => document.documentElement.lang')
        print(f'{page_name}: EN={lang_doc} (ls={ls_lang}) -> ID={lang_id_doc}')
        page.close()
    browser.close()
httpd.shutdown()
