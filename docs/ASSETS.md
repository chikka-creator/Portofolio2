# ASSETS.md — Inventaris Aset (Farline rebuild)

Status: BERLAKU. Sumber tunggal untuk aset, dimensi, format, dan pemetaan nama lama → baru.

## 1. Aset sumber (existing)
| File lama | Dimensi | Format | Dipakai di |
|---|---|---|---|
| portait.png | 768×1024 | PNG ARGB (cutout) | About portrait (cutout) |
| potraiit.jpg | 768×1024 | JPEG RGB | About portrait (fallback foto) |
| TechInventory.png | 1884×1199 | PNG ARGB | Work + Home plate |
| RemakeNet.png | 1917×980 | PNG ARGB | Work + Home plate |
| sertif1.jpeg | 720×497 | JPEG | Home/Gallery plate |
| sertif2.jpeg | (cek) | JPEG | Home/Gallery plate |
| sertif3.jpeg | (cek) | JPEG | Gallery (tidak masuk Home) |
| sertif4.jpeg | (cek) | JPEG | Gallery (tidak masuk Home) |
| sertif5.jpeg | (cek) | JPEG | Gallery (tidak masuk Home) |
| sertif6.jpeg | (cek) | JPEG | Home/Gallery plate |
| sertif7.jpeg | (cek) | JPEG | Home/Gallery plate |
| sertif9.png | (cek) | PNG | Home/Gallery plate |
| sertif10.jpeg | (cek) | JPEG | Home/Gallery plate |
| sertif11.png | 1332×939 | PNG (RGB, no alpha) | Home/Gallery plate |
| setup pertama.png | 6298 KB | PNG | (legacy hero bg — tidak dipakai lagi) |
| seritf8.jpeg | 47 KB | JPEG | Home/Gallery (typo nama) |
| assets/canva_preview.jpg | (cek) | JPEG | (legacy) |
| assets/figma_preview.jpg | (cek) | JPEG | (legacy) |
| assets/vscode_preview.jpg | (cek) | JPEG | (legacy) |

## 2. Pemetaan nama lama → baru
| Nama lama | Nama baru | Lokasi baru |
|---|---|---|
| portait.png | portrait/portrait-cutout.webp | assets/img/ |
| potraiit.jpg | portrait/portrait-photo.webp | assets/img/ |
| TechInventory.png | projects/techinventory.webp | assets/img/ |
| RemakeNet.png | projects/streaming-app-ui.webp | assets/img/ |
| (baru) | projects/portfolio-v2.webp | assets/img/ (screenshot final) |
| sertif1.jpeg | certs/simetri-2025.webp | assets/img/ |
| sertif2.jpeg | certs/dasar-frontend-backend.webp | assets/img/ |
| sertif3.jpeg | certs/computational-thinking-smp.webp | assets/img/ |
| sertif4.jpeg | certs/computational-thinking-sma.webp | assets/img/ |
| sertif5.jpeg | certs/chat-apps-for-business.webp | assets/img/ |
| sertif6.jpeg | certs/global-game-jam-2025.webp | assets/img/ |
| sertif7.jpeg | certs/ai-untuk-software-developer.webp | assets/img/ |
| seritf8.jpeg | certs/english-discoveries.webp | assets/img/ |
| sertif9.png | certs/data-science-expo.webp | assets/img/ |
| sertif10.jpeg | certs/seminar-sekolah-kedinasan.webp | assets/img/ |
| sertif11.png | certs/entrepreneur-fest-2026.webp | assets/img/ |

## 3. Format & optimasi
- Semua gambar konten → WebP (quality 82), dengan fallback JPEG/PNG untuk Safari lama (gunakan `<picture>`).
- Plate Home/Gallery: sumber asli ≥ 1200px lebar; resize ke 1600px lebar (2x untuk plate 800px).
- Portrait cutout: pertahankan alpha; konversi ke WebP dengan alpha (lossless-ish, quality 90).
- Font: WOFF2 (Anton, Geist 400/500/700, Geist Mono 400/500/600). Subset latin + latin-ext.
- Favicon: SVG (monogram F).
- OG image: 1200×630 WebP/JPEG.

## 4. Aturan loading
- Plate pertama Home: `loading="eager"`, `fetchpriority="high"`.
- Plate lain & gallery: `loading="lazy"`.
- Portrait: `loading="lazy"`.
- Font: preload di head, `font-display: swap`.

## 5. Aset yang dihapus (tidak dipakai)
- `setup pertama.png` (6.3MB) — hero bg lama.
- `assets/canva_preview.jpg`, `figma_preview.jpg`, `vscode_preview.jpg` — preview lama.
- `index.html.bak-*`, `design.md.bak-*` — backup.
- `portait.png`/`potraiit.jpg` asli tetap disimpan di root (sumber), tapi kode baru pakai versi WebP di assets/img/.

## 6. Checklist aset sebelum build
- [ ] Konversi 2 project screenshot + 11 sertifikat + 2 portrait ke WebP.
- [ ] Subset & konversi font ke WOFF2.
- [ ] Buat favicon.svg (monogram F).
- [ ] Buat og-image.webp.
- [ ] Screenshot final site → portfolio-v2.webp.
- [ ] Verifikasi semua gambar punya alt text deskriptif.
