# Design Contract — Portofolio Fakhri C.D.N (Farline rebuild)

Status: BERLAKU. Wajib dibaca SEBELUM mengubah kode. Kontrak ini ringkas; detail lengkap ada di `FARLINE-SPEC.md`.

## 1. Sumber nilai
- Token, tipografi, spacing, radius, shadow → `FARLINE-SPEC.md` §1–§2.
- Tidak ada warna/font/radius di luar daftar token. Warna kind (project/cert/soon) dari kontrak lama **tidak dipakai**.

## 2. Grammar gerak — persis DUA easing
- masuk/reveal: `cubic-bezier(0.16, 1, 0.3, 1)` (`.7s` CSS / `1s` spring).
- state kecil: `cubic-bezier(0.22, 0.8, 0.25, 1)` (`.35s`).
- Gerak idle ditulis `sin()`/`cos()` di frame loop, bukan `@keyframes`. Tidak ada easing ketiga.
- Scroll-linked: `progress = clamp(-rect.top/(rect.height-innerHeight),0,1)`, `current += (target-current)*min(1,delta*7.5)`. Reduced motion → `current = target`.

## 3. Aturan 3D
- Material: CSS 3D (`transform-style: preserve-3d`, `perspective`). Tanpa Three.js.
- Fog/depth: via shadow + veil overlay `#ECEAE3` + z-depth.
- Billboard: objek ber-konten `rotation` 0 di local; kedalaman dari `z`.
- Offset tidak random: `Math.sin(i*1.5)*.12` bila diperlukan.
- GPU: satu container per halaman, loop berhenti keluar viewport (IntersectionObserver). `devicePixelRatio` cap 2.
- Touch: setiap container 3D WAJIB `touch-action: pan-y` (atau `none` untuk gallery).
- Plate: foto penuh, paper mat `#DEDBD3`, sudut tajam (radius 0).

## 4. Arah visual per halaman
| Halaman | Boleh | Jangan |
|---|---|---|
| Semua | white stage, ink text, glass nav, 3D hang | dark background, decorative blob, gradient background, easing ketiga |
| Home | 3D hang 10 plate, counter, HUD | menambah section sticky kedua |
| Work | tabel + hover preview + overlay | grid card biasa |
| Gallery | light table + drag/inertia + lightbox | masonry statis |
| About | print parallax + experience block | section gelap |
| Contact | glass form mailto | backend/formspree |

## 5. A11y & fallback
- Setiap container punya padanan semantik (sr-only). Container buta untuk screen reader & tanpa-JS.
- Reduced motion mematikan gerak, bukan tampilan.
- WebGL/CSS 3D gagal → konten tetap terbaca dari DOM.
- Kontras: teks body minimal `#6B6A63` di atas putih; `#969696` hanya untuk teks ≥18px atau uppercase mono.

## 6. i18n
- Teks yang di-draw ke plate harus language-neutral (nama project/sertif). Teks berbahasa → `data-i18n` + dict id/en. Guard `if (translations[currentLang][key])`.

## 7. Anti-pattern — sudah ditolak
- Tanpa Three.js/GSAP/ScrollTrigger/Framer Motion. CSS 3D + lerp manual cukup.
- Tanpa `animation-timeline`/`scroll()`/`view()` (Firefox masih preview).
- Tanpa `@keyframes` untuk gerak idle.
- Tanpa bundler/npm/Vite.
- Tanpa easing ketiga.
- Tanpa lampu 3D / post-processing.
- Tanpa menghapus sr-only fallback.
- Tanpa background gelap di halaman studio terang.
- Tanpa CTA generik — pakai bracket mono `[ ... ]`.

## 8. Verifikasi
Lihat `FARLINE-SPEC.md` §13 dan `VERIFICATION.md`. Wajib lulus sebelum klaim selesai.

## 9. Referensi
- Detail lengkap: `FARLINE-SPEC.md`.
- Demo: https://farline.framer.website
- Aset: `portait.png` (cutout), `potraiit.jpg` (fallback foto), 11 sertifikat, 2 project screenshot.
