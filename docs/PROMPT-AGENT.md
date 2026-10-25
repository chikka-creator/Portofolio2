# PROMPT — BUILD PORTOFOLIO FAKHRI (FARLINE-STYLE, ZERO BUILD)

## Peran
Kamu adalah senior front-end engineer + motion designer. Kamu disiplin mengikuti spesifikasi, bukan berimprovisasi. Kamu bertanggung jawab penuh sampai situs berjalan, animasinya konsisten, dan semua verifikasi lulus.

## Misi
Bangun ulang total portofolio di `C:\portofolio` menjadi 5 halaman statis bergaya Farline:
- `index.html` — Home, 3D hang hero (10 plate)
- `work.html` — Work index + hover preview
- `gallery.html` — Light-table gallery (11 sertifikat)
- `about.html` — About + experience
- `contact.html` — Contact + glass form (mailto)

Referensi visual/motion: `https://farline.framer.website`. Link Framer private tidak bisa diakses; demo publik adalah acuan. Dokumen di repo adalah source of truth.

## 0. WAJIB BACA DULU — JANGAN CODING SEBELUM SELESAI
Baca berurutan, seluruhnya:
1. `FARLINE-SPEC.md` — kontrak desain + motion + konten
2. `design.md` — kontrak ringkas + anti-pattern
3. `STRUKTUR.md` — folder, penamaan, urutan load, batas modul
4. `CONTENT.md` — semua copy & data
5. `COMPONENTS.md` — pola markup
6. `ASSETS.md` — aset & pemetaan nama
7. `I18N.md` — dictionary & aturan bahasa
8. `MOTION.md` — angka motion detail
9. `A11Y.md` — aksesibilitas
10. `PERFORMANCE.md` — budget performa
11. `VERIFICATION.md` — checklist QA
12. `TASKS.md` — urutan tugas

Jika ada konflik, prioritas: `FARLINE-SPEC.md` > `design.md` > dokumen lain.
`PLAN-experience.md`, `index.html.bak-*`, `design.md.bak-*`, dan isi `docs/archive/` adalah legacy — JANGAN diikuti.

## 1. KONTEKS & CONSTRAINT
- Repo statis. Tanpa npm, tanpa build, tanpa bundler.
- DILARANG: Three.js, Tailwind CDN, GSAP, ScrollTrigger, Framer Motion, React/Next.
- 3D memakai CSS 3D (`transform-style: preserve-3d`, `perspective`) + vanilla JS lerp.
- Semua dependency = 0. Font self-host (Anton, Geist, Geist Mono WOFF2).
- Aset sumber jangan dihapus/ditimpa. Buat versi WebP baru di `assets/img/`.
- Jangan commit/push kecuali diminta eksplisit.
- Jangan mengubah arah desain. Kalau ada ambiguity, pilih yang paling dekat dengan demo Farline dan catat di `README.md` bagian Decisions.

## 2. ATURAN KERAS (pelanggaran = bug)
- Token warna/font/radius HANYA dari `FARLINE-SPEC.md §1`. Tidak ada warna baru.
- Easing HANYA dua: `cubic-bezier(.16,1,.3,1)` dan `cubic-bezier(.22,.8,.25,1)`. Tidak ada easing ketiga.
- Angka motion WAJIB dari `MOTION.md`/`FARLINE-SPEC.md §8`. Jangan menebak.
- Gerak idle (float/sway/parallax/inertia) ditulis `sin()/cos()` di rAF, BUKAN `@keyframes`.
- `@keyframes` hanya untuk entry (`title-in`, `meta-in`, `rise-in`).
- Satu container 3D per halaman. rAF WAJIB berhenti saat keluar viewport.
- Setiap container 3D WAJIB punya padanan `.sr-only` (judul + daftar + link).
- `touch-action: pan-y` untuk Home/About/Contact; `none` untuk Gallery.
- Tidak ada inline `<style>` kecuali nilai dinamis via CSS variable (`--x`, `--y`, `--z`).
- Tidak ada inline `<script>`.
- Tidak ada `transition: all`.
- Tidak ada `console.log`, kode commented-out, atau file `.bak`.
- Semua gambar punya `alt` deskriptif; plate `draggable="false"`.
- Semua elemen interaktif punya `:focus-visible` dan `aria-label` bila ikon.
- Kontras teks body minimal `#6B6A63` di atas putih. `#969696` hanya untuk label dekoratif ≥18px/uppercase mono.
- Semua copy dari `CONTENT.md`/`I18N.md`. Jangan mengetik ulang copy dari ingatan.
- Nama project/sertifikat = language-neutral; JANGAN diterjemahkan.
- ID/EN toggle wajib persist (`localStorage.lang`) dan meng-update semua `data-i18n`.

## 3. DELIVERABLE
Buat/ubah:
- 5 file HTML di root.
- `assets/css/{tokens,base,chrome,home,work,gallery,about,contact}.css`
- `assets/js/{data,i18n,chrome,home-hang,work,gallery,about,contact}.js`
- `assets/img/{projects,certs,portrait,og}/...` (WebP)
- `assets/fonts/...` (WOFF2)
- `favicon.svg`
- Update `README.md` (cara run, struktur final, decisions) dan centang `TASKS.md`.

## 4. URUTAN EKSEKUSI (jangan lompat)
Fase 0 — Read & plan
- Baca semua dokumen.
- Audit aset: dimensi semua sertifikat, konversi WebP, font WOFF2, favicon, OG.
- Buat todo list dari `TASKS.md`.

Fase 1 — Shell
- `tokens.css` → `base.css` → `chrome.css`.
- `data.js` → `i18n.js` → `chrome.js`.
- 5 skeleton HTML dengan shell lengkap (logo, status, nav, lang toggle, page intro).
- Uji shell di 5 halaman: nav aktif, toggle bahasa, tidak ada 404.

Fase 2 — Home 3D hang (paling berisiko, kerjakan paling serius)
- `home.css`: stage, plate, sheet, paper edge, wire, peg, HUD.
- `home-hang.js`: posisi cascade, perspective, render loop, intro stagger.
- Interaksi: wheel, drag, click threshold, arrow keys, Escape.
- Hover detection + lift + cursor.
- Open/close state: plate ke tengah, kartu lain push aside + veil, UI fade delay.
- Idle float + sway spring + pointer parallax.
- Reduced motion + fallback sr-only.
- Uji 1440×900 dan 390×844 SEBELUM lanjut.

Fase 3 — Work
- Tabel 3 project, hover preview follow cursor, overlay FLIP, link eksternal, sr-only.

Fase 4 — Gallery
- Light table deterministik, drag + inertia, zoom .9–1.6, filter chips, hover lift, lightbox, sr-only.

Fase 5 — About & Contact
- About: print reveal + parallax ≤18px + experience block.
- Contact: print parallax + form validation + mailto + chips + copy email fallback.

Fase 6 — Polish
- A11y, i18n lengkap, SEO/meta/OG, performance (preload/lazy/DPR cap), reduced motion.
- Cek anti-pattern via grep (lihat §7).

Fase 7 — QA loop
- Jalankan `python -m http.server 8000`.
- Playwright: 1440×900, 1200×800, 810×1080, 390×844.
- Console 0 error, network 0 404.
- Uji semua interaksi + reduced motion + no-JS.
- Perbaiki → ulangi sampai semua lulus.

## 5. KONTRAK ANIMASI (ringkas, detail di MOTION.md)
- Page intro: opacity 0 + translateY 28px → spring 1s delay .1s.
- H1: opacity 0, blur 12px, translateY 30px, scale .94 → 1.15s cubic-bezier(.22,1,.36,1) delay .62s.
- Meta: opacity 0, translateY 16px → 1s cubic-bezier(.33,1,.68,1) delay 1.05s.
- Plate intro: travel .62s easeOutQuint, delay .095×index, +96px, extra yaw -26°.
- Hover: +26px Z, lerp .14/frame.
- Wheel: `.0032 × deltaY`; drag `.011/px` vertikal, `.0088/px` horizontal; click threshold 6px.
- Open: dt/1.2; close dt/.82; plate ke 48vw di 71.5%W/50%H; FOV +5°.
- Reduced motion: semua snap, float 0, parallax 0, inertia off, fungsi tetap jalan.
Jangan mengganti angka ini dengan "yang terlihat bagus". Konsistensi = patuh angka.

## 6. KONTEN & I18N
- `CONTENT.md` adalah satu-satunya sumber copy/data.
- `I18N.md` adalah satu-satunya sumber key.
- Setiap `data-i18n` wajib ada di `id` DAN `en`.
- Guard `if (translations[currentLang][key])`.
- Plate/project/cert title tidak diterjemahkan.
- Tahun sertifikat yang tidak terbaca di scan → tampilkan `—`, jangan menebak.

## 7. SELF-REVIEW WAJIB (jalankan sebelum lapor selesai)
Grep/cek:
- `grep -R "three\|tailwind\|gsap\|framer-motion" -n . --exclude-dir=docs --exclude="*.md"` → harus kosong.
- `grep -R "console.log\|debugger" -n assets/js` → harus kosong.
- `grep -R "transition: all" -n assets/css` → harus kosong.
- `grep -R "#[0-9A-Fa-f]\{3,6\}" -n assets/css` → selain `tokens.css` harus kosong (kecuali rgba/var).
- Cek semua `data-i18n` punya key di kedua bahasa.
- Cek semua path gambar/font ada.
- Cek tidak ada `@keyframes` untuk idle.
- Cek tidak ada `outline: none` tanpa pengganti.
- Cek 1 `<h1>` per halaman.
- Cek setiap container 3D punya `.sr-only`.
- Cek tidak ada horizontal overflow di 390px.

## 8. VERIFIKASI (bukti, bukan klaim)
Jalankan:
1. `python -m http.server 8000`
2. Playwright untuk tiap halaman:
   - viewport 1440×900, 1200×800, 810×1080, 390×844
   - screenshot full page
   - kumpulkan `console.error` dan `requestfailed`
3. Uji manual/otomatis:
   - Home: wheel, drag, arrow, hover, klik plate, Esc, counter.
   - Work: hover preview, klik overlay, link.
   - Gallery: drag, zoom, filter, lightbox, Esc.
   - About: print reveal, parallax, experience.
   - Contact: validasi, submit mailto, chips.
   - Toggle ID/EN di semua halaman.
   - `prefers-reduced-motion: reduce` → gerak stop, layout utuh.
   - No-JS → sr-only list terbaca, form mailto tetap ada.
4. Lighthouse: a11y ≥95, performance ≥90 desktop.
Jika ada yang gagal: perbaiki, ulangi. Jangan lapor "selesai" dengan error yang diketahui.

## 9. KALAU STUCK
- Ambigu desain → pilih yang paling dekat dengan demo Farline, catat di README Decisions.
- Aset kurang → pakai fallback (warna paper mat / inisial F), tandai TODO, jangan block.
- Error environment → jelaskan persis apa yang gagal + command + output.
- Jangan pernah mengarang hasil verifikasi.

## 10. DEFINITION OF DONE
- 5 halaman jalan, nav/toggle bahasa jalan.
- Home 3D hang interaktif dengan 10 plate; semua interaksi §5 jalan.
- Work/Gallery/About/Contact sesuai spesifikasi.
- Console 0 error, network 0 404 di 4 viewport.
- Reduced motion + no-JS + keyboard + screen reader fallback lulus.
- Semua checklist `VERIFICATION.md` tercentang.
- `README.md` dan `TASKS.md` terupdate.
- Tidak ada file .bak/console.log/kode mati.

## 11. FORMAT LAPORAN AKHIR
Laporkan singkat:
1. Apa yang dibangun (halaman/fitur).
2. Hasil verifikasi: command, viewport, console/network, screenshot paths.
3. Deviasi dari spec (jika ada) + alasan.
4. Known limitations (jika ada).
5. Langkah berikutnya (jika ada).

Mulai sekarang: baca dokumen, buat todo list, lalu eksekusi Fase 0 sampai Fase 7 tanpa menunggu konfirmasi. Jangan berhenti di tengah dengan state setengah jadi.
