# TASKS.md — Breakdown Tugas Build (Farline rebuild)

Status: BERLAKU. Urutan granular. Tandai [x] saat selesai. Satu tugas = satu commit kecil (opsional).

## Fase 0 — Dokumentasi & aset
- [x] T0.1 Verifikasi FARLINE-SPEC.md, design.md, STRUKTUR.md, CONTENT.md, COMPONENTS.md, ASSETS.md, I18N.md, MOTION.md, VERIFICATION.md, A11Y.md, PERFORMANCE.md sudah ada.
- [x] T0.2 Audit dimensi semua sertifikat (sertif2..sertif11) → isi ASSETS.md.
- [x] T0.3 Konversi 2 project + 11 sertifikat + 2 portrait ke WebP (lihat ASSETS.md §3).
- [x] T0.4 Subset & konversi font Anton/Geist/Geist Mono ke WOFF2.
- [x] T0.5 Buat favicon.svg (monogram F) & og-image.webp.
- [x] T0.6 Screenshot final (nanti) → portfolio-v2.webp.

## Fase 1 — Shell & token
- [x] T1.1 Buat assets/css/tokens.css (variabel warna, font, spacing, radius, shadow, z).
- [x] T1.2 Buat assets/css/base.css (reset, typography, .reveal, .sr-only, :focus-visible).
- [x] T1.3 Buat assets/css/chrome.css (logo, status, nav, lang toggle, page intro).
- [x] T1.4 Buat assets/js/data.js (ORBIT_PLATES, WORK_PROJECTS, GALLERY_CERTS, EXPERIENCE, SKILLS).
- [x] T1.5 Buat assets/js/i18n.js (translations dict + applyLanguage + updateHUDLanguage).
- [x] T1.6 Buat assets/js/chrome.js (nav bubble, lang toggle, page intro, scroll-spy, reduced-motion flag).
- [x] T1.7 Buat 5 skeleton HTML (index, work, gallery, about, contact) dengan shell.

## Fase 2 — Home 3D hang (paling berat)
- [x] T2.1 Buat assets/css/home.css (stage, plate, sheet, edge, wire, peg, HUD).
- [x] T2.2 Buat assets/js/home-hang.js: init plates, rumus posisi, render loop.
- [x] T2.3 Wheel handler (passive false, capture, close-on-open).
- [x] T2.4 Drag handler + click threshold 6px.
- [x] T2.5 Keyboard handler (arrow, escape).
- [x] T2.6 Hover detection via projected quad + lerp .14.
- [x] T2.7 Open/close state + FLIP-ish transform + UI fade.
- [x] T2.8 Intro animation (stagger 10 plate).
- [x] T2.9 Idle float (clock, pointer tilt, sway spring).
- [x] T2.10 Reduced motion + canvas mode fallback.
- [x] T2.11 IntersectionObserver (stop loop keluar viewport).
- [x] T2.12 sr-only fallback + WebGL/CSS 3D gagal fallback.

## Fase 3 — Work
- [x] T3.1 Buat assets/css/work.css.
- [x] T3.2 Buat assets/js/work.js: render tabel, hover preview follow cursor.
- [x] T3.3 Overlay dialog (FLIP .4s) + Esc/backdrop/close + focus return.
- [x] T3.4 sr-only fallback.

## Fase 4 — Gallery
- [x] T4.1 Buat assets/css/gallery.css.
- [x] T4.2 Buat assets/js/gallery.js: render light table, scatter deterministik.
- [x] T4.3 Drag + inertia.
- [x] T4.4 Wheel zoom .9..1.6.
- [x] T4.5 Filter chips.
- [x] T4.6 Hover lift.
- [x] T4.7 Lightbox dialog + focus return.
- [x] T4.8 Reduced motion.
- [x] T4.9 sr-only fallback.

## Fase 5 — About & Contact
- [x] T5.1 Buat assets/css/about.css + assets/js/about.js (print reveal, parallax, experience block).
- [x] T5.2 Buat assets/css/contact.css + assets/js/contact.js (print parallax, form validation, mailto).
- [x] T5.3 Form: chip selection, submit → mailto dengan subject/body.
- [x] T5.4 sr-only fallback.

## Fase 6 — Polish & QA
- [x] T6.1 A11y: aria-label, focus-visible, kontras.
- [x] T6.2 SEO: title, meta, canonical, og, favicon.
- [x] T6.3 Performance: preload, lazy, cap DPR, loop stop.
- [x] T6.4 Playwright: 4 viewport screenshot + interaksi + reduced motion + no-JS.
- [x] T6.5 Cross-browser (Firefox, WebKit).
- [x] T6.6 Lighthouse ≥ target.
- [x] T6.7 Update README.md (final).
- [x] T6.8 Bersihkan .bak & console.log.

## Fase 7 — Deploy
- [ ] T7.1 Git status bersih, commit (jika diminta).
- [ ] T7.2 Deploy (Vercel/Netlify/GitHub Pages) — sesuai hosting.
