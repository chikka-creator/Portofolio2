# Portofolio — Fakhri Cahyo Diandra Nandito

Personal portfolio, rebuilt in the style of Farline (https://farline.framer.website): white editorial stage (#FFFFFF), quiet monochrome typography, 3D hang hero, light-table gallery, and glassmorphic chrome.

## Status
Rebuilt & Fully Verified (Zero Build, Pure Vanilla HTML/CSS/JS).

## Halaman (5 Static Pages)
- `index.html` — Home: 3D hang hero (10 plate carousel dengan camera cascade, idle sway spring, pointer parallax, hover lift +26px Z, dan modal reveal).
- `work.html` — Work index: tabel proyek editorial dengan dynamic hover preview plate yang mengikuti kursor dan native `<dialog>` overlay modal.
- `gallery.html` — Light-table gallery: meja peraga interaktif berisi 11 sertifikat dengan scatter deterministik, drag + inertia, wheel zoom (0.9x–1.6x), filter chips kategori, dan lightbox dialog.
- `about.html` — About: profil editorial, 3D print reveal di dinding dengan scroll parallax, 3 kolom keahlian (Focus, Tools, Recognition), serta blok riwayat pengalaman.
- `contact.html` — Contact: editorial direct email, status ketersediaan, 3D portrait wall print, dan card glassmorphism dengan validasi formulir enquiry (mailto).

## Tech Stack & Constraints
- **Zero Dependencies**: Tanpa build step, tanpa npm/bundler, tanpa framework.
- **Pure CSS 3D**: Menggunakan `transform-style: preserve-3d`, `perspective`, dan vanilla JavaScript lerp di `requestAnimationFrame`.
- **Dilarang & Dieliminasi**: Three.js, Tailwind CDN, GSAP, ScrollTrigger, Framer Motion, React/Next.
- **Dua Easing**: `cubic-bezier(.16,1,.3,1)` untuk enter/reveal dan `cubic-bezier(.22,.8,.25,1)` untuk state interaction.
- **Font Self-Hosted**: Anton (400), Geist (400–700), Geist Mono (400–600) dalam format WOFF2 (total ~71 KB).
- **Semua Aset Teroptimasi**: Format WebP modern di `assets/img/`.

## Cara Menjalankan
Buka langsung file HTML di browser, atau jalankan local server:
```bash
python -m http.server 8000
```
Lalu akses `http://localhost:8000/`.

## Struktur Final
```
portofolio/
├── index.html                  # Home: 3D hang hero
├── work.html                   # Work index + hover preview
├── gallery.html                # Light-table gallery
├── about.html                  # About + experience
├── contact.html                # Contact + glass form
├── favicon.svg                 # Favicon monogram F
├── assets/
│   ├── css/
│   │   ├── tokens.css          # Design tokens (warna, font, radius, shadow, z-index)
│   │   ├── base.css            # Reset, typography, font-face, .reveal, .sr-only
│   │   ├── chrome.css          # Shell: logo pill, status pill, nav glass, lang toggle
│   │   ├── home.css            # 3D hang hero, paper edges, wire, peg, HUD
│   │   ├── work.css            # Tabel editorial, preview follow cursor, overlay
│   │   ├── gallery.css         # Light table, items scatter, zoom HUD, lightbox
│   │   ├── about.css           # 3D print portrait, credits, experience table
│   │   └── contact.css         # Glass enquiry form, chip selector, contact details
│   ├── js/
│   │   ├── data.js             # ORBIT_PLATES, WORK_PROJECTS, GALLERY_CERTS, EXPERIENCE
│   │   ├── i18n.js             # Kamus dwibahasa ID & EN, applyLanguage, updateHUDLanguage
│   │   ├── chrome.js           # Shell navigation, toggle bahasa, reduced-motion flag
│   │   ├── home-hang.js        # Engine 3D camera cascade, wheel/drag/keys, hover lift
│   │   ├── work.js             # Hover preview follow cursor, modal overlay FLIP
│   │   ├── gallery.js          # Light table pan + inertia, wheel zoom, filter chips
│   │   ├── about.js            # Print reveal observer, scroll parallax calculation
│   │   └── contact.js          # Form validation, radio chips, mailto dispatch
│   ├── img/
│   │   ├── projects/           # techinventory.webp, streaming-app-ui.webp, portfolio-v2.webp
│   │   ├── certs/              # simetri-2025.webp ... entrepreneur-fest-2026.webp (11 certs)
│   │   ├── portrait/           # portrait-cutout.webp, portrait-photo.webp
│   │   └── og/                 # og-image.webp (1200x630)
│   └── fonts/                  # Anton.woff2, Geist.woff2, GeistMono.woff2
├── docs/
│   └── archive/                # Backup & file legacy pre-farline
└── screenshots/                # Bukti QA matrix (4 viewports x 5 halaman)
```

## Decisions & Implementasi Teknis
1. **Font WOFF2 Self-Hosting**: File font Anton, Geist, dan Geist Mono diunduh langsung dalam subset Latin WOFF2 ke dalam `assets/fonts/` dengan total bobot 71 KB (memenuhi budget performa ≤ 120 KB).
2. **Responsive Tablet Stacking (<= 1199px)**: Pada About dan Contact, stage diubah menjadi vertical column stack pada resolusi tablet (termasuk 810×1080) untuk mengeliminasi horizontal overflow.
3. **Pointer Capture & Target Tracking**: Menyimpan `pointerDownTarget` dan `pointerDownPlate` saat pointer down agar tap/click pada objek bergerak di 3D stage terdeteksi akurat tanpa interferensi pointer capture.
4. **Zero Hex Colors Outside tokens.css**: Seluruh nilai warna pada 7 file CSS lainnya 100% menggunakan CSS variable (`var(--...)`) atau `rgba(...)`.
5. **Real Live Screenshot Portfolio v2**: Gambar `assets/img/projects/portfolio-v2.webp` diambil otomatis dari hasil render desktop Home 1440×900.

## Hasil Verifikasi
- **Console Errors**: 0 error di seluruh 5 halaman dan 4 viewport.
- **Failed Network Requests**: 0 kegagalan 404 (semua 48 aset font, CSS, JS, dan WebP ada di disk).
- **Horizontal Overflow**: 0 overflow di semua ukuran viewport (1440×900, 1200×800, 810×1080, 390×844).
- **Interaksi Teruji**:
  - Home: Wheel, drag gesture, keyboard arrow, counter 01–10, plate open & escape.
  - Work: Row hover preview, dialog open & close via close button / backdrop / Esc.
  - Gallery: Light table drag pan, inertia decay, zoom in/out label update, category filtering, lightbox open & close.
  - About: Print reveal observer & parallax scroll translation.
  - Contact: Chip selection toggle, form validation alert, mailto link dispatch.
  - Dwibahasa: Toggle ID/EN di seluruh halaman, persisten di `localStorage.lang`.
  - Reduced Motion: Menghentikan interpolasi/sway/float saat `prefers-reduced-motion: reduce` aktif.
  - No-JS Mode: Daftar `.sr-only` semantik dan fallback form tetap dapat diakses penuh.

## Kontak & Profil
- Pengembang: Fakhri Cahyo Diandra Nandito
- Lokasi: Surabaya, Indonesia (GMT+7)
- GitHub: https://github.com/chikka-creator
- Instagram: https://www.instagram.com/khrisselll/
- Email: ditofakhri3@gmail.com
