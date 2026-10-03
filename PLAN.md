# Plan: Orbit 3D Scroll (Project + Sertifikat)

Status: DISETUJUI, BELUM DIIMPLEMENTASI.
Target file: `index.html` saja. Repo statis, tanpa build, tanpa npm, semua dep via CDN.

## 1. Tujuan

Ganti section `#work` (grid 2 kartu) dan section `#certifications` (grid 10 sertifikat)
menjadi SATU section orbit 3D bergaya referensi (Ethan Mercer):

- Portrait orang di tengah.
- Kartu (project + sertifikat) mengorbit mengelilingi portrait.
- Scroll = ring berputar 360 penuh, tiap kartu lewat depan kamera satu per satu.
- Render pakai Three.js (CDN importmap), bukan CSS 3D.

## 2. Keputusan yang sudah dikunci

| Topik | Keputusan |
|---|---|
| Stack 3D | Three.js `0.186.1` via importmap (unpkg) |
| Section `#work` | Diganti total jadi orbit (id `#work` tetap, nav anchor aman) |
| Section `#certifications` | Dihapus total |
| Nav link `#certifications` | Dihapus dari nav desktop + mobile |
| Jumlah kartu | 8 (2 project + 1 coming soon + 5 sertifikat) |
| Portrait | `portrait.png` (cutout PNG) di root; kalau belum ada -> placeholder inisial F |
| Bahasa kartu | Teks di texture hanya nama project/sertif, ID/EN identik -> tidak perlu redraw saat ganti bahasa |

Catatan koreksi: hitungan awal "9 kartu" salah. 2 + 1 + 5 = 8.
Kalau mau 9, tambah `sertif9.png` (Data Science Expo 2026) sebagai kartu terakhir.
`STEP` dihitung dari `N = ORBIT_CARDS.length`, jadi jumlah kartu bebas tanpa ubah kode.

## 3. Inventaris kartu (order di ring, searah jarum jam)

| # | Tipe | Judul | Asset | Link |
|---|---|---|---|---|
| 1 | project | TechInventory System | `TechInventory.png` | https://github.com/chikka-creator/TechInventory.git |
| 2 | cert | SIMETRI 2025 (UI/UX Design) | `sertif1.jpeg` | - |
| 3 | project | Streaming App UI | `RemakeNet.png` | https://www.figma.com/design/rnLD3kSvpWiQDQYp0hYRto/Study-Case-Kel-8 |
| 4 | cert | Dasar Frontend & Backend | `sertif2.jpeg` | - |
| 5 | soon | Coming Soon | - | `#` |
| 6 | cert | AI untuk Software Developer | `sertif7.jpeg` | - |
| 7 | cert | Global Game Jam 2025 | `sertif6.jpeg` | - |
| 8 | cert | English Discoveries | `seritf8.jpeg` | - |

Catatan penting: file sertifikat ke-8 punya typo penamaan `seritf8.jpeg`
(bukan `sertif8.jpeg`). Jangan "diperbaiki" namanya, path di HTML sudah memakai itu.

Sertifikat `sertif11.png` (Entrepreneur Fest 2026, file baru, BELUM ada di HTML)
TIDAK ikut orbit.

## 4. Struktur halaman setelah diubah

```
head
  + <script type="importmap"> {"imports": {"three": "https://unpkg.com/three@0.186.1/build/three.module.js"}} </script>
nav (desktop + mobile)
  - link #certifications dihapus
section #about        (tidak disentuh)
section #expertise    (tidak disentuh)
section #work         (DIGANTI TOTAL, id dipertahankan)
  <section id="work" class="scroll-section relative h-[400vh] bg-[#0a0a0a]">
    <div class="sticky top-0 h-screen overflow-hidden">
      <canvas id="orb-canvas" class="absolute inset-0 w-full h-full block"></canvas>
      <div class="absolute inset-x-0 bottom-10 text-center ...">judul + counter 01/08</div>
      <div class="sr-only">  <!-- fallback a11y/SEO -->
        <h2>Karya & Sertifikasi</h2>
        <ul> 8 item: judul + link (project saja) </ul>
      </div>
    </div>
  </section>
section #certifications (DIHAPUS TOTAL)
footer #contact        (tidak disentuh)
```

- Tinggi `h-[400vh]` = jarak scroll untuk memutar ring 1x penuh.
- Scroll-spy `#work` tetap jalan (class `scroll-section` dipertahankan).
- Background dark `#0a0a0a` (senada `#about`) supaya glow/fog kelihatan.
- Hapus `<article>` grid lama di `#work` dan seluruh grid sertifikat.
- Key `navCert` di dictionary boleh dibiarkan mati (tidak dirapikan, biar diff kecil).

## 5. Alur data JS

Semua di blok `<script>` existing, satu blok baru `// 6. ORBIT 3D` di dalam
`DOMContentLoaded` (setelah logic reveal/nav yang sekarang jadi bagian 1-5).

```js
const ORBIT_CARDS = [
  { kind:"project", title:"TechInventory System",
    tag:"Full-Stack", img:"TechInventory.png", url:"https://github.com/..." },
  { kind:"cert",    title:"SIMETRI 2025",
    tag:"UI/UX Design", img:"sertif1.jpeg" },
  // ... total 8, urutan sesuai tabel section 3
];
const N = ORBIT_CARDS.length;
const STEP = (Math.PI * 2) / N;
```

Field `title` dipakai untuk texture DAN sr-only list. Tidak ada `titleId`/`titleEn`
karena isi kartu sengaja language-neutral (nama project/sertif tidak diterjemahkan,
persis seperti kartu lama di grid).

## 6. Matematika scroll + ring

```
p        = clamp((scrollY - sectionTop) / (sectionHeight - viewportH), 0, 1)
target   = p * Math.PI * 2              // 1 penuh rotation selama section
current += (target - current) * min(1, dt * 6)   // smoothing frame-rate independent
ring.rotation.y = -current
```

Posisi kartu i di local ring (sebelum ring berputar):

```
theta = i * STEP
x = Math.sin(theta) * R
z = Math.cos(theta) * R
y = stagger(i)          // +/- .15 biar tidak segaris kaku
```

Kartu TIDAK di-yaw mengikuti ring (`rotation.y = 0` di local ring) supaya semua
kartu tetap terbaca dari kamera. Kedalaman, scale, dan opacity datang dari `z`.

Frame loop per kartu:

```
focusK  = Math.cos(theta + current)       // 1 = persis depan kamera
scale   = 1 + max(0, focusK) * 0.18
opacity = 0.55 + max(0, focusK) * 0.45
```

Counter di HUD: `String(Math.round(current / STEP) % N + 1).padStart(2, "0")`.

Camera: `PerspectiveCamera(45, aspect, 0.1, 100)`, posisi `(0, 0.3, 7)`,
`lookAt(0, 0, 0)`. R = 3.2 desktop / 2.6 mobile (`innerWidth < 768`).

## 7. Kartu (texture via 2D canvas -> THREE.CanvasTexture)

Satu fungsi `makeCardTexture(card)` -> canvas 768x480:

1. Rounded rect clip radius 32, isi `#111`.
2. `drawImage` sampel `cover` (crop tengah, sesuaikan aspect 1.6).
3. Gradient bawah (hitam 0 -> 0.85) biar teks kebaca.
4. Judul (Inter 600, 40px, putih, max 1 baris).
5. Chip `tag` kecil di bawah (pill bg putih 0.12).

Mesh: `PlaneGeometry(1.6, 1)`, `MeshBasicMaterial({ map, transparent:true, side:DoubleSide, fog:true })`.
`MeshBasicMaterial` disengaja: tanpa lampu, warna screenshot jujur, kode lebih pendek.
Coming soon: texture murni kanvas (tanpa image), judul "Coming Soon" + garis putus-putus.

## 8. Portrait di tengah

- Plane `1.5 x 2.2` di `(0, -0.15, 0)`, `TextureLoader().load("portrait.png")`.
- `onError` -> ganti map ke texture kanvas berisi huruf "F" dalam orb.
- Cutout PNG asli: `transparent`, `depthWrite:false` supaya tidak ketemu sort-order kartu.
- Glow: plane `3 x 3` di belakangnya, texture radial-gradient kanvas,
  `AdditiveBlending`, opacity 0.5.
- Animasi halus: `position.y = baseY + Math.sin(elapsed) * 0.03`.

## 9. Interaksi

- Raycaster `pointermove` di `#orb-canvas`. Kartu focus (`cos > 0.85`) dapat scale
  ekstra + `cursor:pointer`.
- `pointerdown` -> buka `card.url` kalau ada (`_blank`, `noopener`). Sertifikat tidak punya link.
- Wajib: `touch-action: pan-y` di canvas supaya scroll HP tidak kesedot canvas.

## 10. Performa & a11y

- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
- IntersectionObserver di `#work`: keluar viewport -> hentikan loop
  (`renderer.setAnimationLoop(null)`), masuk -> jalan lagi.
- `resize` handler: update `camera.aspect`, `renderer.setSize`, re-hitung R mobile.
- `prefers-reduced-motion`: matikan smoothing (pakai `target` langsung), matikan bob portrait.
- sr-only list WAJIB ada (8 item) - canvas buta untuk screen reader dan tanpa-JS.
- WebGL gagal (`try/catch` di `new WebGLRenderer`): sembunyikan canvas, tampilkan
  list project biasa.

## 11. Kontrak verifikasi (wajib dijalankan sebelum klaim selesai)

1. `python -m http.server 8000` di root, buka `http://localhost:8000`.
2. Console: nol error. `portrait.png` boleh 404 -> WAJIB fallback placeholder jalan, bukan crash.
3. Scroll `#work` atas ke bawah: counter jalan 01 -> 08, tiap kartu persis sekali lewat depan.
4. Hover kartu depan -> scale naik; klik TechInventory -> GitHub, klik Streaming -> Figma.
5. Toggle ID/EN -> nav tetap, isi sr-only list ganti (key `work1Title` dll sudah ada di dictionary).
6. Nav link `#certifications` hilang dari desktop DAN mobile menu.
7. `#about`, `#expertise`, `#contact` tidak berubah (diff hanya `#work`, nav, head).
8. Mobile 390x844: canvas tidak overflow, scroll tidak kesedot, R pakai 2.6.
9. Assertions: `ORBIT_CARDS.length === 8`, `Math.abs(STEP - Math.PI * 2 / 8) < 1e-6`.

## 12. Temuan saat riset (ikut dibereskan)

- Nav mobile punya link `#certifications`. Kalau section dihapus, link jadi dead anchor.
  Wajib dihapus bersamaan (bagian 4).
- `sertif11.png` file baru tapi tak terpakai. Jangan ikut ter-commit dengan perubahan ini
  supaya tidak nyasar ke orbit.
- Key `navCert` jadi tidak terpakai di dictionary. Sengaja dibiarkan (diff kecil), tidak error:
  guard `if (translations[currentLang][key])` sudah eyedrop.

## 13. Yang TIDAK dikerjakan (YAGNI)

- Tanpa GSAP/ScrollTrigger (lerp manual cukup).
- Tanpa build step/bundler/Vite.
- Tanpa drag-to-spin (cuma scroll + hover).
- Tanpa teks 3D (TextGeometry + font loader) - semua label di texture kanvas.
- Tanpa fallback CSS 3D untuk browser tanpa WebGL.
- Tanpa i18n redraw texture (texture sengaja language-neutral).
- Tanpa preload `sertif9/sertif10/sertif11` (tidak dipakai).
