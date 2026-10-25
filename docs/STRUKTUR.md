# STRUKTUR.md — Struktur Proyek Portofolio (Farline rebuild)

Status: BERLAKU. Konvensi folder, penamaan, urutan load, batas modul. Wajib dibaca sebelum membuat/mengubah file.

## 1. Pohon folder target

```
portofolio/
├── index.html                  # Home: 3D hang hero
├── work.html                   # Work index + hover preview
├── gallery.html                # Light-table gallery
├── about.html                  # About + experience
├── contact.html                # Contact + glass form
├── FARLINE-SPEC.md             # Kontrak desain + motion + content
├── design.md                   # Kontrak ringkas
├── STRUKTUR.md                 # File ini
├── CONTENT.md                  # Inventaris konten & copy
├── COMPONENTS.md               # Katalog komponen HTML/CSS
├── ASSETS.md                   # Inventaris aset
├── I18N.md                     # Dictionary keys & aturan
├── MOTION.md                   # Kontrak motion detail
├── VERIFICATION.md             # QA checklist
├── PLAN.md                     # Rencana build
├── README.md
├── assets/
│   ├── css/
│   │   ├── tokens.css          # variabel CSS (warna, font, spacing, radius, shadow, z)
│   │   ├── base.css            # reset, typography, .reveal, sr-only, focus-visible
│   │   ├── chrome.css          # shell: logo, status pill, nav, lang toggle, page intro
│   │   ├── home.css            # 3D hang + plate + HUD
│   │   ├── work.css            # tabel + hover preview + overlay
│   │   ├── gallery.css         # light table + filter + lightbox
│   │   ├── about.css           # print parallax + experience block
│   │   └── contact.css         # print + glass form
│   ├── js/
│   │   ├── data.js             # ORBIT_PLATES, WORK_PROJECTS, GALLERY_CERTS, EXPERIENCE, SKILLS
│   │   ├── i18n.js             # translations dict + applyLanguage + updateHUDLanguage
│   │   ├── chrome.js           # nav bubble, lang toggle, page intro, scroll-spy, reduced-motion flag
│   │   ├── home-hang.js        # engine 3D hang (wheel/drag/keys/hover/open/intro/idle)
│   │   ├── work.js             # tabel + hover preview + overlay
│   │   ├── gallery.js          # light table + drag/inertia/zoom/filter/lightbox
│   │   ├── about.js            # print reveal + parallax + experience
│   │   └── contact.js          # print parallax + form validation + mailto
│   ├── img/
│   │   ├── projects/           # TechInventory.webp, RemakeNet.webp, portfolio-v2.webp
│   │   ├── certs/              # sertif1.webp ... sertif11.webp
│   │   ├── portrait/           # portrait-cutout.webp, portrait-photo.webp
│   │   └── og/                 # og-image.webp
│   └── fonts/                  # Anton, Geist, Geist Mono (woff2)
├── favicon.svg
└── docs/
    └── archive/                # dokumen lama (pre-farline)
```

## 2. Aturan penamaan
- Halaman: kebab-case lowercase, ekstensi `.html` (`work.html`, `gallery.html`).
- CSS/JS: kebab-case (`home-hang.js`, `tokens.css`).
- Aset gambar: kebab-case, tanpa spasi, tanpa typo (`seritf8.jpeg` → `cert-english-discoveries.webp`). Pemetaan nama lama → baru di `ASSETS.md`.
- Class CSS: BEM-like singkat: `.chrome-nav`, `.hang-plate`, `.hang-hud`, `.gallery-item`, `.contact-form`. Prefix per halaman: `hang-`, `work-`, `gal-`, `about-`, `contact-`, `chrome-`.
- ID: kebab-case, unik per halaman (`#hang-canvas`, `#work-table`, `#gal-lightbox`).
- Variabel JS: camelCase (`orbitPlates`, `posCur`, `posTarget`).
- Konstanta: UPPER_SNAKE (`ORBIT_PLATES`, `STEP`, `N`).
- data-attribute: kebab-case (`data-i18n`, `data-hang-ui`, `data-gal-ui`).

## 3. Urutan load (per halaman)
Head:
1. `<meta charset, viewport, title, description, canonical, og:*>`
2. `<link rel="icon" href="favicon.svg">`
3. Preload font (Anton, Geist, Geist Mono woff2) + plate pertama Home.
4. `<link rel="stylesheet" href="assets/css/tokens.css">`
5. `<link rel="stylesheet" href="assets/css/base.css">`
6. `<link rel="stylesheet" href="assets/css/chrome.css">`
7. `<link rel="stylesheet" href="assets/css/{page}.css">`

Body akhir:
1. `<script src="assets/js/data.js" defer></script>`
2. `<script src="assets/js/i18n.js" defer></script>`
3. `<script src="assets/js/chrome.js" defer></script>`
4. `<script src="assets/js/{page}.js" defer></script>`
Catatan: `{page}.js` bergantung pada data/i18n/chrome; urutan defer menjamin eksekusi berurutan.

## 4. Batas modul (jangan dilanggar)
- `data.js` hanya data + konstanta. Tidak ada DOM, tidak ada event.
- `i18n.js` hanya dictionary + apply. Tidak ada layout.
- `chrome.js` hanya shell + lang toggle + page intro + reduced-motion flag + scroll-spy. Tidak ada 3D.
- `{page}.js` hanya logika halaman itu. Tidak boleh impor halaman lain.
- CSS per halaman tidak boleh override token; token hanya di `tokens.css`.
- Tidak ada inline `<style>` kecuali nilai dinamis via CSS variable (`--left`, `--top`).
- Tidak ada inline `<script>` kecuali bootstrap kecil (tidak ada).

## 5. Konvensi HTML
- Semantik: `<main>`, `<nav aria-label>`, `<section>`, `<article>` bila perlu. Tanpa `<header>`/`<footer>` (mengikuti referensi).
- Setiap halaman: satu `<h1>`. Judul section pakai `<h2>`.
- Canvas/container 3D selalu punya padanan sr-only (`<div class="sr-only">`).
- Atribut i18n: `data-i18n="key"` (textContent) atau `data-i18n-html="key"` (innerHTML).
- Elemen interaktif: `aria-label`, `:focus-visible` terlihat.
- Gambar: `alt` wajib (deskriptif, bukan kosong), `loading="lazy"` kecuali plate pertama Home, `draggable="false"` pada plate.
- Form input: `<label for>` terasosiasi.

## 6. Konvensi CSS
- Mobile-first tidak wajib; gunakan breakpoint desktop-first (min-width) sesuai referensi: 1200, 810, 390.
- Gunakan CSS variable dari tokens.css; jangan hardcode warna di file lain.
- Easing hanya dua (lihat design.md §2). Tidak ada `@keyframes` untuk gerak idle.
- `transform-style: preserve-3d` hanya di container 3D.
- z-index scale: base 0, plate 10, HUD 20, overlay 30, lightbox 40, nav 50, lang toggle 60.

## 7. Konvensi JS
- ES modules? Tidak — gunakan script biasa (defer) agar tanpa build. Gunakan IIFE per file untuk isolasi.
- Tidak ada dependensi eksternal (no Three.js, no GSAP).
- `requestAnimationFrame` loop wajib dibatalkan saat keluar viewport.
- Event listener scroll/pointer/wheel: `{ passive: true }` kecuali wheel Home (passive false + capture).
- Semua angka magic diberi nama konstanta di atas file.
- Reduced motion dicek sekali di chrome.js → flag global `window.__reduceMotion`.

## 8. Batas ukuran
- Satu file HTML ≤ 40KB (tanpa data inline besar).
- Satu file CSS ≤ 25KB.
- Satu file JS ≤ 30KB.
- Jika melebihi, pecah per komponen.

## 9. Yang tidak boleh
- Inline style kecuali nilai dinamis via CSS variable.
- Inline script.
- `!important` kecuali override library (tidak ada library).
- Commit file .bak.
- Aset dengan nama typo (seritf8, potraiit) di kode baru.
