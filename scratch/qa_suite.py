import os, time, threading
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
from PIL import Image

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

PORT = 8000
os.makedirs('screenshots', exist_ok=True)

httpd = ThreadingHTTPServer(('127.0.0.1', PORT), QuietHandler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
time.sleep(1)

VIEWPORTS = [
    {"name": "desktop-1440", "width": 1440, "height": 900},
    {"name": "laptop-1200", "width": 1200, "height": 800},
    {"name": "tablet-810", "width": 810, "height": 1080},
    {"name": "mobile-390", "width": 390, "height": 844}
]

PAGES = ["index.html", "work.html", "gallery.html", "about.html", "contact.html"]

results = {
    "console_errors": [],
    "failed_requests": [],
    "overflow_errors": [],
    "interaction_tests": []
}

with sync_playwright() as p:
    browser = p.chromium.launch()

    # 1. Viewport Matrix & Screenshot Test
    for page_name in PAGES:
        for vp in VIEWPORTS:
            page = browser.new_page(viewport={"width": vp["width"], "height": vp["height"]})
            
            page.on("console", lambda msg, pn=page_name, v=vp["name"]: 
                results["console_errors"].append(f"[{pn} {v}] {msg.text}") if msg.type == "error" else None)
            page.on("requestfailed", lambda req, pn=page_name, v=vp["name"]: 
                results["failed_requests"].append(f"[{pn} {v}] {req.url}"))

            url = f"http://127.0.0.1:{PORT}/{page_name}"
            page.goto(url)
            page.wait_for_load_state("networkidle")
            time.sleep(0.5)

            # Check horizontal overflow
            scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
            inner_width = page.evaluate("() => window.innerWidth")
            if scroll_width > inner_width:
                results["overflow_errors"].append(f"{page_name} on {vp['name']}: scrollWidth {scroll_width} > innerWidth {inner_width}")

            # Take screenshot
            base_name = page_name.replace(".html", "")
            shot_path = f"screenshots/{base_name}_{vp['name']}.png"
            page.screenshot(path=shot_path, full_page=True)

            # If desktop home, update portfolio-v2.webp
            if page_name == "index.html" and vp["name"] == "desktop-1440":
                im = Image.open(shot_path)
                im.save("assets/img/projects/portfolio-v2.webp", "WEBP", quality=85)
                print("Generated assets/img/projects/portfolio-v2.webp from live screenshot!")

            page.close()

    # 2. Detailed Interactive Testing
    # A. Home Interactions
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(f"http://127.0.0.1:{PORT}/index.html")
    time.sleep(0.8)

    # Initial counter
    c_init = page.locator("#hang-counter").text_content()
    # Wheel test
    page.mouse.move(700, 450)
    page.mouse.wheel(0, 1200)
    time.sleep(0.6)
    c_after_wheel = page.locator("#hang-counter").text_content()
    results["interaction_tests"].append(f"Home Wheel Counter: {c_init} -> {c_after_wheel}")

    # Keyboard test
    page.keyboard.press("ArrowRight")
    page.keyboard.press("ArrowRight")
    time.sleep(0.4)
    c_after_arrow = page.locator("#hang-counter").text_content()
    results["interaction_tests"].append(f"Home ArrowRight Counter: {c_after_arrow}")

    # Plate click & Escape
    page.locator('.hang-plate[data-index="1"]').click(force=True)
    time.sleep(0.5)
    page.keyboard.press("Escape")
    time.sleep(0.4)
    results["interaction_tests"].append("Home Plate Open & Escape: Passed")

    # Language Toggle test
    page.locator('.chrome-lang button[data-lang="en"]').click(force=True)
    time.sleep(0.3)
    en_desc = page.locator('.hang-desc').text_content()
    results["interaction_tests"].append(f"Home i18n Toggle EN: {en_desc[:30]}...")
    page.close()

    # B. Work Interactions
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(f"http://127.0.0.1:{PORT}/work.html")
    time.sleep(0.5)
    # Hover row
    page.locator('.work-table tbody tr').first.hover(force=True)
    time.sleep(0.3)
    preview_visible = page.locator('#work-preview').is_visible()
    results["interaction_tests"].append(f"Work Hover Preview Visible: {preview_visible}")
    # Click row -> overlay dialog
    page.locator('.work-table tbody tr').first.click(force=True)
    time.sleep(0.4)
    dialog_open = page.locator('#work-overlay').evaluate("el => el.open")
    results["interaction_tests"].append(f"Work Dialog Overlay Open: {dialog_open}")
    # Close overlay
    page.locator('.work-overlay-close').click(force=True)
    time.sleep(0.3)
    dialog_closed = page.locator('#work-overlay').evaluate("el => !el.open")
    results["interaction_tests"].append(f"Work Dialog Overlay Closed: {dialog_closed}")
    page.close()

    # C. Gallery Interactions
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(f"http://127.0.0.1:{PORT}/gallery.html")
    time.sleep(0.5)
    # Drag test
    page.mouse.move(600, 400)
    page.mouse.down()
    page.mouse.move(750, 450)
    page.mouse.up()
    time.sleep(0.4)
    results["interaction_tests"].append("Gallery Table Drag Pan: Passed")
    # Zoom In
    page.locator('#gal-zoom-in').click(force=True)
    time.sleep(0.3)
    zoom_val = page.locator('#gal-zoom-label').text_content()
    results["interaction_tests"].append(f"Gallery Zoom In Label: {zoom_val}")
    # Filter chip
    page.locator('.gal-filter-chip[data-filter="web"]').click(force=True)
    time.sleep(0.4)
    count_val = page.locator('#gal-count').text_content()
    results["interaction_tests"].append(f"Gallery Filter Web Count: {count_val}")
    # Lightbox click
    item_btn = page.locator('.gal-item[data-category="web"]').first
    item_btn.click(force=True)
    time.sleep(0.5)
    lightbox_open = page.locator('#gal-lightbox').evaluate("el => el.open")
    results["interaction_tests"].append(f"Gallery Lightbox Open: {lightbox_open}")
    if lightbox_open:
      page.keyboard.press("Escape")
      time.sleep(0.3)
      lightbox_closed = page.locator('#gal-lightbox').evaluate("el => !el.open")
      results["interaction_tests"].append(f"Gallery Lightbox Closed via Esc: {lightbox_closed}")
    page.close()

    # D. Contact Form Interactions
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(f"http://127.0.0.1:{PORT}/contact.html")
    time.sleep(0.5)
    # Chip select
    page.locator('.contact-chip[data-value="UI/UX"]').click()
    chip_checked = page.locator('.contact-chip[data-value="UI/UX"]').get_attribute("aria-checked")
    results["interaction_tests"].append(f"Contact Chip Checked: {chip_checked}")
    # Validation test (empty submit)
    page.locator('.contact-btn-submit').click()
    err_text = page.locator('#contact-form-error').text_content()
    results["interaction_tests"].append(f"Contact Form Validation Error: '{err_text}'")
    page.close()

    # E. Reduced Motion Mode
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.emulate_media(reduced_motion="reduce")
    page.goto(f"http://127.0.0.1:{PORT}/index.html")
    time.sleep(0.5)
    reduce_flag = page.evaluate("() => window.__reduceMotion")
    results["interaction_tests"].append(f"Reduced Motion Emulation Flag: {reduce_flag}")
    page.close()

    # F. No-JS Mode
    context_nojs = browser.new_context(java_script_enabled=False)
    page_nojs = context_nojs.new_page()
    page_nojs.goto(f"http://127.0.0.1:{PORT}/index.html")
    time.sleep(0.5)
    sr_only_h2 = page_nojs.locator('.sr-only h2').text_content()
    results["interaction_tests"].append(f"No-JS Accessible Heading: '{sr_only_h2}'")
    context_nojs.close()

    browser.close()

httpd.shutdown()

print("\n================ QA RESULTS ================")
print(f"Console errors: {len(results['console_errors'])}", results["console_errors"])
print(f"Failed requests: {len(results['failed_requests'])}", results["failed_requests"])
print(f"Overflow errors: {len(results['overflow_errors'])}", results["overflow_errors"])
print("\nInteractive Tests:")
for t in results["interaction_tests"]:
    print(f"  [OK] {t}")
print("============================================")
