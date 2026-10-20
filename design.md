# Design Contract — Portofolio Fakhri C.D.N

Status: BERLAKU. **Wajib dibaca SEBELUM mengubah `index.html`.**
Ini kontrak, bukan tutorial. Animasi baru yang tidak mengikuti §1–§9 = bug.

Repo statis. Tanpa build, tanpa npm, tanpa GSAP. Dep via CDN:
`tailwindcss` (play), `three@0.186.1` (importmap unpkg), `Inter` (Google Fonts).
Satu file: `index.html`. Pola yang sudah terbukti: `PLAN.md` + `initOrbit3D()`.

---

## 1. Token — satu-satunya sumber nilai

Jangan memperkenalkan warna/font/radius di luar daftar ini.

| Token | Nilai | Dipakai di |
|---|---|---|
| `brand` | `#111827` | `tailwind.config` saja (bukan body lagi) |
| scene dark | `#07080f` | **body global**, bg `#about` `#contact`, scrollbar |
| stage dark | `#0a0d14` | bg `#work` `#experience`, `setClearColor`, `FogExp2` — terikat canvas 3D, jangan diubah terpisah |
| nav glass dark | `rgba(10,13,20,.65)` blur `16px`, border `rgba(255,255,255,.1)` | `.glass-pill` (`#main-nav`, mobile menu) |
| aksen amber | `#f59e0b` / `#fbbf24` / `#fde68a` | badge, bubble nav, CTA bracket, glow |
| aksen cyan | `#38bdf8` | HUD, glow ambient (maks 1 per section non-stage) |
| text di scene | `slate-300` (body), `slate-400` (sekunder), `#fff` (heading) | semua section gelap |
| card surface | `#0f111a` | canvas texture 3D |
| exp card glass | `rgba(22,28,38,.96)` gradient, blur `24px`, border `rgba(255,255,255,.1)` | kartu melayang `#experience` |
| footer link | ikon outline `1.5px` + label mono uppercase, `border-top: rgba(255,255,255,.05)` | `#contact` |
| kind project | DOM: `text-blue-400` + `bg-blue-500/10` + `border-blue-500/20`<br>texture: bg `rgba(37,99,235,.35)`, border `rgba(96,165,250,.6)`, teks `#93c5fd` | kartu project |
| kind soon | DOM: `text-amber-400` + `bg-amber-500/10` + `border-amber-500/20`<br>texture: bg `rgba(217,119,6,.35)`, border `rgba(251,191,36,.6)`, teks `#fde68a` | kartu "Coming Soon" |
| kind cert | DOM: `text-emerald-400` + `bg-emerald-500/10` + `border-emerald-500/20`<br>texture: bg `rgba(255,255,255,.15)`, border `rgba(255,255,255,.3)`, teks `#f8fafc` | kartu sertifikat |
| font | `Inter` 300 / 400 / 500 / 600 / 700 (mono uppercase untuk label teknis: badge, ticker, link footer) | seluruh halaman |
| radius | `rounded-full` (nav pill, chip, CTA mono), `rounded-2xl` (HUD, dialog), `rounded-3xl` (panel footer), `28px` (kartu 3D) — variasi disengaja, bukan satu nilai | seluruh halaman |
| lebar | `max-w-5xl` (konten), `max-w-6xl` (nav), `max-w-7xl` (`#work`), `px-6` | existing |
| glow | maks **2** per section stage (`#experience` `#work`), maks **1** per section non-stage (`#about` `#contact`) | anti-slop: hindari decorative blob overload |
| gradient text | maks 2× di seluruh halaman (idiom `STRATEGY.` + `SOMETHING.`) | anti-slop |

Kontras: teks di atas lapisan gelap minimal `gray-300` di atas `#07080f`.
Pola yang sudah terbukti aman: shadow `rgba(0,0,0,.85)` + `blur 12`.

---

## 2. Grammar gerak — persis DUA easing

Easing ketiga = kesalahan. Pilih dari dua ini.

| Tipe | Easing | Durasi | Pemakaian |
|---|---|---|---|
| masuk / reveal | `cubic-bezier(0.16, 1, 0.3, 1)` | `0.7s` | `.reveal` → `.reveal.active` |
| state kecil | `cubic-bezier(0.25, 1, 0.5, 1)` | `0.4s` | `#nav-bubble` |

**Reveal** = `opacity 0 → 1` + `translateY(20px → 0)`. Dipicu `IntersectionObserver`
`threshold: 0.12`, lalu `unobserve` (sekali, tidak berulang).

### Scroll-linked: progres 0..1, wajib

Progress yang sama dengan orbit:

```
rect     = section.getBoundingClientRect()
progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)
current += (target - current) * min(1, delta * 7.5)
```

- Faktor **7.5** dari `initOrbit3D`. Kalau diubah, ubah di dua-duanya.
- Jangan set `target` langsung ke elemen visual. Kalau
  `prefers-reduced-motion: reduce`: `current = target` (snap) — gerak mati, tampilan utuh.
- Listener `scroll` / `pointermove` wajib `{ passive: true }`.
- Section sticky satu layar = tinggi berbasis `vh`. `h-[400vh]` = satu siklus penuh.
  Jangan lewat `400vh` per section.

### Scroll zoom parade (`#experience`, scroll-driven)

Kartu berurutan menghampiri user saat scroll, memenuhi layar (full-bleed),
lalu kembali ke posisi asalnya saat kartu berikutnya maju. Tanpa library.

- Section `#experience`: `h-[400vh]`, berisi wrapper `position: sticky; top: 0;
  height: 100vh; overflow: hidden`. `overflow-hidden` **pindah** ke wrapper sticky —
  di section itu mematikan sticky.
- `perspective` + `transform-style: preserve-3d` di stage di dalam wrapper.
- Satu skalar per kartu: `e` ∈ [0,1] (`0` = posisi asal, `1` = full-bleed).
  `g = progress × N_FLOAT`; jendela per kartu `i`:
  `[i, i+0.5]` approach 0→1 · `[i+0.5, i+0.8]` hold · `[i+0.8, i+1.2]` return 1→0.
  Kartu terakhir hold sampai `g = N_FLOAT` (tanpa return).
- Transform via custom properties: `translateZ(var(--card-z) × (1 - e))`,
  `translate(--card-dx/--card-dy × e)`, `scale(1 + (s-1) × e)`.
  `dx/dy/s` diukur dari rect posisi asal vs viewport, diukur ulang saat resize.
  Jangan pakai `transition` untuk drive zoom — lerp frame loop §2 yang punya.
- Idle float `sin()` hanya kartu non-dominan: `floatPx = (1-e) × sin(...) × 6`.
- Kartu lain meredup (`opacity 1 - 0.75 × maxE`), portrait redup + blur.
- Klik/fokus HANYA kartu dominan (`e > 0.5`); lainnya `pointer-events: none`
  + `tabindex` dibuang. Klik kartu aktif → dialog FLIP (blok di bawah).
- Parallax lama (`--card-scroll`) DIHAPUS — bentrok dengan parade.
- Progress + lerp: formula §2 persis. `prefers-reduced-motion`: `current = target`,
  float = 0 (snap, layout utuh).

### FLIP zoom (klik kartu aktif → dialog)

Teknik `First-Last-Invert-Play` dengan `<dialog>` native. Tanpa library.

- `transform` FLIP **boleh** pada elemen yang **tidak** punya `.reveal`. `.reveal`
  memegang `transform: translateY()`; menulis `transform` di elemen yang sama
  menimpanya dan menghapus reveal.
- Easing FLIP: `cubic-bezier(0.25, 1, 0.5, 1)` (easing "state kecil" di atas).
  Durasi `0.4s`. Jangan pakai easing ketiga.
- Alur: `showModal()` → ukur rect kartu pemicu → invert panel ke rect itu →
  paksa reflow → lepas invert → transisi ke posisi panel.
- Target akhir dihitung dari rect, **bukan** angka `scale()` hardcode. Magic number
  akan keluar viewport di layar kecil.
- Tutup via tiga jalan, semuanya wajib: `Escape` (native `<dialog>`), klik
  backdrop, tombol close.
- Fokus WAJIB kembali ke kartu pemicu saat ditutup (`dialog.close()` tidak
  menjamin restore fokus di semua browser).
- `prefers-reduced-motion`: matikan FLIP, dialog tetap buka-tutup normal.
- `sr-only` list tetap ada, tidak dipindah ke dialog.

---

## 3. Aturan 3D

- **Material:** `MeshBasicMaterial`. Tanpa lampu → warna screenshot jujur, kode pendek.
  Jangan tambah lampu demi kesan "lebih 3D".
- **Fog wajib** di scene gelap: `new THREE.FogExp2(0x07080f, 0.08)`. Tanpa ini
  kartu belakang nempel, bukan menjauh.
- **Billboard:** objek ber-konten memakai `rotation.set(0, 0, 0)`. Kedalaman dari `z`,
  bukan memutar objek mengikuti ring.
- **Offset tidak boleh random.** Pola sah: `Math.sin(i * 1.5) * 0.12` (stagger Y).
- **Kurva kedalaman yang sudah terbukti:**

  ```
  focusK     = Math.cos(theta + current)
  scale      = 0.82 + max(0, focusK) * 0.26
  opacity    = clamp(0.38 + (focusK + 1) * 0.31, 0.28, 1)
  renderOrder = Math.round((focusK + 1) * 50)
  ```

- **Orbit:** `R = 3.35` desktop, `2.65` bila `innerWidth < 768`.
  `PerspectiveCamera(45, aspect, 0.1, 100)` di `(0, 0.25, 7.2)`.
- **Hover/raycast:** aktif saat `focusK > 0.45`, scale `× 1.08`, `cursor: pointer`
  hanya kalau kartu punya `url`.
- **GPU:** `renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))`.
  Satu canvas per section. Loop WAJIB berhenti keluar viewport via
  `IntersectionObserver` → `renderer.setAnimationLoop(null)` / `(animate)`.
- **WebGL gagal:** `try/catch` di `new THREE.WebGLRenderer` → `console.warn`,
  canvas disembunyikan, konten tetap harus terbaca (§5).
- **Touch:** setiap `<canvas>` WAJIB `touch-action: pan-y`. Tanpa itu scroll HP kesedot.
- **Texture:** canvas 768×480, `roundRect` radius `28`, Inter, **language-neutral**.
  Elemen yang bisa ada di DOM diletakkan di DOM (HUD), bukan di texture.

---

## 4. Arah visual per section

Jawaban untuk "animasi ini ditaruh mana".

| Section | Sekarang | Boleh | Jangan |
|---|---|---|---|
| `#nav` | dark glass pill `rgba(10,13,20,.65)`, link `slate-300`, bubble amber `#f59e0b` | transisi opacity/posisi bubble | background putih/terang; hapus bubble amber (satu-satunya elemen terang) |
| `#about` | foto `setup pertama.png`, overlay `[#07080f]/85`, badge mono amber, CTA bracket mono `[ ... ]`, 1 ambient glow amber | parallax tipis lapisan foto | merotasi/menggeser teks judul; menaikkan transparansi overlay; tombol CTA rounded biasa |
| `#expertise` | DIHAPUS — isi pindah jadi data kartu di `#experience` | — | jangan biarkan anchor `#expertise` hidup (dead anchor) |
| `#experience` | ada: sticky `h-[400vh]` + wrapper `h-screen`, 11 kartu parade scroll `e`, dialog FLIP | parade scroll full-bleed (`e` 0→1→0), float hanya kartu non-dominan, redup kartu lain + portrait | `--card-scroll` (parallax lama); drive zoom via `transition`; biarkan kartu non-dominan klik-able; buang `sr-only` |
| `#work` | orbit 3D lengkap (HUD, raycast, sr-only) | — | disentuh, kecuali ada bug nyata |
| `#contact` | dark studio `#07080f`, 1 ambient glow cyan, headline **LET'S BUILD SOMETHING.** (gradient amber→slate), CTA bracket mono `[ ditofakhri3@gmail.com ]`, 3 icon link (GitHub/Instagram/Email), footer bottom "© 2026 — SURABAYA, INDONESIA", `.reveal` | `.reveal` saja | background terang `#fff`/`#f9fafb`; layout 4-kolom template; tombol CTA generik "Get in Touch" |

`#about`: overlay `[#07080f]/85` disengaja supaya teks putih lulus kontras. Animasi apa pun
di sini tidak boleh menipiskannya.

---

## 5. Kontrak a11y & fallback

- Setiap canvas punya padanan semantik (`sr-only` atau DOM biasa) berisi judul +
  daftar konten. Canvas buta untuk screen reader dan tanpa-JS.
- Scroll mobile tetap jalan tanpa terkunci canvas (`pan-y`).
- `prefers-reduced-motion: reduce` mematikan **gerak**, bukan tampilan. Posisi akhir
  identik dengan versi beranimasi, hanya dicapai tanpa interpolasi.
- WebGL tidak tersedia → konten tetap terbaca dari DOM. Bukan layar kosong.
- Elemen interaktif punya `aria-label` (tombol ikon) dan `:focus-visible` terlihat.

---

## 6. Kontrak i18n

- Teks yang di-draw ke texture/canvas harus **language-neutral** (nama project,
  nama sertifikat). Lihat `ORBIT_CARDS`.
- Teks berbahasa → `data-i18n` + dictionary `id` **dan** `en`.
  Guard tetap: `if (translations[currentLang][key])`.
- Key mati (contoh `navCert`) boleh. Teks ada tanpa key tidak boleh.
- Kolom baru wajib diisi dua sisi. Teks berisi HTML → pakai `innerHTML`
  (pola `heroTitle1`), teks biasa → `textContent`.
- Teks HUD yang berganti per state memakai hook `updateHUDLanguage`.

---

## 7. Anti-pattern — sudah ditolak, jangan diulang

- **Tanpa GSAP / ScrollTrigger / Framer Motion.** Lerp manual + FLIP native cukup,
  nol dependensi.
- **Tanpa `animation-timeline` / `scroll()` / `view()`.** Chrome 115+ dan Safari 26+
  sudah support, tapi **Firefox masih `preview`** (Sumber: MDN BCD,
  `css/properties/animation-timeline.json`). Mengandalkannya = sebagian pengguna
  dapat halaman tanpa efek. Pakai JS lerp §2.
- **Tanpa `@keyframes` untuk gerak idle.** Easing §2 hanya ada dua; gerak berulang
  (float) ditulis `sin()` di frame loop, bukan keyframes dengan `ease-in-out`.
- **Tanpa bundler / Vite / npm.** Semua lewat CDN.
- **Tanpa easing ketiga.** §2 hanya mengenal dua.
- **Tanpa lampu 3D.** §3 pakai `MeshBasicMaterial`.
- **Tanpa menghapus `sr-only` fallback** untuk menghemat markup.
- **Tanpa menambah section sticky kedua sekaligus.** Satu per satu, ukur dulu.
- **Tanpa menaikkan `h-[400vh]`** di `#work`; angka itu sudah 1 rotasi penuh.
- **Tanpa drive zoom dengan `transition` + scroll listener.** `transition` berbalapan
  dengan lerp frame loop — zoom parade murni lerp §2.
- **Tanpa `position: sticky` di dalam ancestor `overflow-hidden`.** Sticky mati
  diam-diam; `overflow-hidden` harus di wrapper *di dalam* section sticky.
- **Tanpa melebihi kuota glow.** Maks 2 ambient glow per section stage
  (`#experience` `#work`), maks 1 per section non-stage (`#about` `#contact`).
  Lebih dari itu = decorative blob template (anti-slop).
- **Tanpa gradient text lebih dari 2×.** Hanya `STRATEGY.` (`#work`) dan
  `SOMETHING.` (`#contact`) — satu idiom, dua tempat.
- **Tanpa background terang di halaman studio dark.** Body, nav, footer semua
  `#07080f`. Putih/krem hanya untuk teks, bukan surface.
- **Tanpa CTA generik.** Semua CTA pakai bracket mono `[ ... ]` dengan copy
  spesifik, bukan "Get Started Free" / "Mulai Diskusi" polos.

---

## 8. Kontrak verifikasi (wajib sebelum klaim selesai)

1. `python -m http.server 8000` di root → `http://localhost:8000`.
2. Console **nol error**. 404 asset → pastikan fallback jalan, bukan crash.
3. Scroll `#about` → `#contact`: progres tiap section benar-benar 0 → 1, animasi
   terbaca, tanpa lompatan di awal/akhir.
4. DevTools Rendering → `prefers-reduced-motion: reduce`: semua gerak berhenti,
   layout identik, konten tidak hilang.
5. Toggle ID/EN: semua teks baru ikut berubah, tidak ada teks nyangkut satu bahasa.
6. Cek `sr-only` / matikan JS: isi section tetap terbaca.
7. Mobile 390×844: scroll halus, canvas tidak menahan gesture, tanpa overflow.
8. Semua `.reveal` terisi — tidak ada blok nyangkut `opacity: 0` di tengah layar.
9. Anchor `#about` `#experience` `#work` `#contact` hidup, bubble nav tetap sinkron. Tidak ada `href="#expertise"` tersisa di nav desktop maupun mobile.
10. `#experience`: scroll membawa 11 kartu **berurutan** — satu kartu membesar
    memenuhi viewport, kartu sebelumnya kembali ke posisi asal, tanpa jeda kosong.
    Hanya kartu dominan yang bisa diklik; kartu terakhir tertahan (tidak return).
    Tidak ada kartu keluar viewport di 390×844. Klik kartu aktif → dialog,
    `Escape` menutup dan fokus kembali ke pemicu.
11. WebGL context total tetap **1**. Cek `renderer.info` / tidak ada `new WebGLRenderer`
    kedua di kode `#experience`.

---

## 9. YAGNI — sengaja tidak ada

- Drag-to-spin, teks 3D (`TextGeometry`), depth of field, post-processing.
- Tema terang/gelap. Satu skema ini sudah dipakai.
- Fallback CSS 3D untuk browser tanpa WebGL (pakai padanan DOM biasa).
- Animasi di luar section §4. Section baru → tambah baris §4 dulu.
