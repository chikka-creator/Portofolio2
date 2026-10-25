# PLAN â€” Section #experience: Scroll Zoom Parade (Kartu Menghampiri User)

Status: **AKTIF** â€” implementasi berjalan sesuai file ini.
Baca `design.md` (kontrak) DAN file ini (urutan langkah) sebelum menyentuh `index.html`.

Target: `index.html` saja. Repo statis, tanpa build, tanpa npm, semua dep CDN.
Kontrak `design.md` **sudah di-amend** (Â§2 blok "Scroll zoom parade", Â§4 baris
`#experience`, Â§7 dua anti-pattern baru, Â§8 item 10) â€” jangan amend lagi.

---

## 0. Kenapa Ada File Ini

| File | Peran |
|---|---|
| `design.md` | **Apa yang boleh** â€” batas, token, anti-pattern, verifikasi |
| `PLAN-experience.md` (ini) | **Bagaimana cara** â€” jangkar edit, matematika parade, kode |

Dua-duanya wajib dibaca. Kalau bertentangan: **`design.md` menang.**

---

## 1. Ringkasan Perubahan

> **Satu kalimat:** Ubah `#experience` dari "11 kartu melayang + parallax" menjadi
> parade scroll-driven â€” saat user scroll, kartu satu per satu menghampiri user,
> memenuhi layar (full-bleed), lalu kembali ke posisi asalnya saat kartu berikutnya
> maju; klik kartu aktif tetap membuka dialog FLIP.

### Sebelum vs Sesudah

```
SEBELUM (implementasi floating cards)      SESUDAH (scroll zoom parade)
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€      â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
section#experience                         section#experience
  min-height: 220vh                          h-[400vh]  (tanpa overflow-hidden!)
  perspective: 1200px (di section)           â””â”€ div sticky top-0 h-screen
  â””â”€ .exp-stage (preserve-3d, 160vh)              overflow-hidden, header
       â”œâ”€ portrait (selalu tajam)                 â””â”€ .exp-stage preserve-3d
       â””â”€ 11 kartu: parallax --card-scroll             â”œâ”€ portrait (redup saat parade)
         + idle float semua kartu                      â””â”€ 11 kartu: parade e 0â†’1â†’0
  klik kartu mana pun â†’ dialog FLIP          klik HANYA kartu aktif â†’ dialog FLIP
```

---

## 2. Keputusan yang Sudah Dikunci (Jangan Dibuka Lagi)

| # | Topik | Keputusan | Alasan |
|---|---|---|---|
| 1 | Pemicu modal | Scroll adalah pemicu utama; klik = hybrid (hanya kartu aktif) | User keputusan 2024 sesi parade |
| 2 | Kartu lama | **Kembali ke posisi asal** saat kartu baru maju (return, bukan fade) | Simetris, konsisten "animasi tetap sama" |
| 3 | Tinggi section | Tetap `400vh` (11 kartu, Â±36vh scroll/kartu) | Patuh kontrak Â§2 |
| 4 | Kartu lain saat dominan | **Redup** di belakang (opacity 1â†’0.25), bukan disembunyikan | Konteks peta tetap terasa |
| 5 | Ukuran penuh | **Full-bleed viewport** (kartu menutup seluruh layar) | "menutupi layar si user" |
| 6 | Portrait | **Redup + blur** saat parade, tidak hilang | Konteks tetap |
| 7 | Klik saat parade | Hanya kartu dominan (`e > 0.5`) klik-able | Tidak ada tabrakan dialog |
| 8 | Idle float | Hanya kartu non-dominan: `(1-e) Ã— sin(...) Ã— 6` | Kartu penutup layar tidak goyang |
| 9 | Dialog klik | `<dialog>` FLIP **tidak diubah** â€” FLIP mengukur rect saat buka | Berjalan dari full-bleed = natural |
| 10 | WebGL | Context total tetap 1; parade = CSS 3D murni | Kontrak Â§3 |

---

## 3. Matematika Parade (sumber kebenaran kode)

### Progress (identik kontrak Â§2)

```js
rect     = section.getBoundingClientRect()
scrollable = rect.height - window.innerHeight        // guard <= 0
progress = clamp(-rect.top / scrollable, 0, 1)
current += (target - current) * Math.min(1, delta * 7.5)   // lerp kontrak Â§2
```

### Variabel parade

```
g = current Ã— 11            (current = progress ter-lerp; 11 = N_FLOAT)
e[i]  âˆˆ [0,1]               0 = posisi asal FLOAT_POS, 1 = full-bleed
maxE = max(e[0..10])        untuk dimming
```

### Jendela per kartu i (unit = 1 segmen)

| `g` dalam | Aksi |
|---|---|
| `[i, i+0.5]` | approach: `e` 0â†’1 (menghampiri user) |
| `[i+0.5, i+0.8]` | hold: `e = 1` (menutupi layar) |
| `[i+0.8, i+1.2]` | return: `e` 1â†’0 (kartu lama mundur; kartu i+1 mulai approach di `g=i+1`, overlap 0.2 = handoff mulus) |
| kartu terakhir (i=10) | hold sampai `g = 11`, tidak return |

### Transform kartu (custom properties, TANPA transition)

```css
transform:
  translateZ(calc(var(--card-z, 0px) * (1 - var(--card-e, 0))))
  translate(calc(var(--card-dx, 0px) * var(--card-e, 0)),
            calc(var(--card-dy, 0px) * var(--card-e, 0) + var(--card-float, 0px)))
  scale(calc(1 + (var(--card-s, 1) - 1) * var(--card-e, 0)));
```

- `--card-dx/dy`: jarak dari pusat kartu (posisi asal) ke pusat viewport â€” px.
- `--card-s`: skala agar kartu menutup viewport penuh: `max(vw/w, vh/h) Ã— 1.15`
  (1.15 = overscan anti-tepi).
- `translateZ` dikalikan `(1-e)`: di `e=1` geometri datar persis, bebas
  distorsi perspektif saat full-bleed.
- `--card-float`: idle float, `0` saat `e â‰¥ 1` atau `prefers-reduced-motion`.
- `--card-scroll` (parallax lama): **DIHAPUS** â€” bentrok dengan parade.

### Dimming & gating

| Elemen | Aturan |
|---|---|
| Kartu non-dominan | `opacity = 1 - 0.75 Ã— maxE` (min 0.25), `pointer-events: none`, `tabindex` dibuang saat `e < 0.5` |
| Kartu dominan (`e > 0.5`) | klik-able, fokus-able, dialog boleh dibuka |
| Portrait | `opacity = 1 - 0.85 Ã— maxE`, `filter: blur(4px Ã— maxE)` |
| `prefers-reduced-motion` | `current = target` (snap), float = 0 â€” layout identik versi animasi |

---

## 4. Langkah Implementasi (urut, jangan loncat)

| # | Langkah | Jangkar di `index.html` (saat ini) | Selesai jika |
|---|---|---|---|
| 1 | Markup: `min-height: 220vh; perspective: 1200px` â†’ `h-[400vh]`; buang `overflow-hidden` dari section; bungkus header+stage dalam `sticky top-0 h-screen overflow-hidden`; pindah `perspective` ke `.exp-stage` | L359â€“393 | sticky jalan, header tetap di atas |
| 2 | CSS: ganti komposisi `transform` `.float-card` (L77â€“91); hapus `--card-scroll`; tambah `.float-card.dim`, portrait dim; media 768px disesuaikan | `<style>` L76â€“100 | kartu approach penuh viewport tanpa lompatan |
| 3 | JS `initFloatCards()`: ganti `tick()` (L1562â€“1582) â†’ parade: ukur `dx/dy/s` sekali + resize; hitung `g`, jendela, `e`; lerp 7.5; set props + dim + gate klik/tabindex; IntersectionObserver start/stop dipertahankan | L1457â€“1593 | parade mulus, console bersih |
| 4 | Klik guard: `handleOpen()` cek `e > 0.5` (state shared dari initFloatCards) | L1718â€“1724 | dialog hanya dari kartu aktif |
| 5 | Verifikasi Â§8 kontrak (11 cek, item 10 versi baru) + Playwright | â€” | semua PASS |

---

## 5. Verifikasi (kontrak Â§8 + spesifik parade)

1. `python -m http.server 8000` â†’ `http://localhost:8000`.
2. Console **nol error**; nol 404 (`sertif11.png`, `assets/*_preview.jpg` â€” yang
   hilang harus jatuh ke `onerror` fallback, bukan crash).
3. Scroll `#experience` 0â†’1: 11 kartu **berurutan** approachâ€“holdâ€“return; screenshot
   Playwright di `g â‰ˆ i+0.4` (full-bleed) dan `g â‰ˆ i+1` (handoff); kartu terakhir
   tertahan sampai akhir section.
4. Hanya kartu dominan klik-able â†’ dialog FLIP terbuka, Escape/backdrop/close
   menutup, fokus kembali ke kartu.
5. Mobile 390Ã—844: kartu menutup penuh viewport, tanpa overflow; **scroll tidak
   macet** (uji khusus sticky + overflow-hidden).
6. DevTools Rendering â†’ `prefers-reduced-motion: reduce`: snap tanpa interpolasi,
   layout identik, konten utuh.
7. Toggle ID/EN saat parade: teks kartu ikut berganti.
8. `sr-only` utuh; WebGL context tetap 1; anchor nav + bubble sinkron.

---

## 6. Out of Scope (YAGNI)

- âŒ Parallax `--card-scroll` (dihapus permanen)
- âŒ GSAP / ScrollTrigger / Framer / `animation-timeline`
- âŒ Easing ketiga, `@keyframes` untuk gerak
- âŒ Naikkan `h-[400vh]`, sentuh `#work` / `initOrbit3D()`
- âŒ Ubah dialog FLIP (markup, CSS, animasi)
- âŒ Drag kartu, autoplay, carousel

---

## 7. Risiko & Mitigasi

| # | Risiko | Mitigasi |
|---|---|---|
| 1 | Sticky mati karena `overflow-hidden` di section | Overflow pindah ke wrapper sticky (kontrak Â§7) |
| 2 | Full-bleed terdistorsi perspektif | `translateZ Ã— (1-e)` â†’ datar saat `e=1` |
| 3 | Tepi viewport bocor saat full-bleed | Overscan `s Ã— 1.15` |
| 4 | `transition` balapan dengan lerp | Zoom murni lerp; `transition` hanya hover border/shadow |
| 5 | Handoff kartu terasa kosong | Overlap jendela return 0.2 (Â§3) |
| 6 | Klik terpicu saat parade | Guard `e > 0.5` + `pointer-events: none` |
| 7 | Focus trap saat kartu non-aktif | `tabindex` di-gate per frame |
| 8 | Resize menggeser `dx/dy/s` | Ukur ulang saat `resize` (passive) |

---

## 8. Definition of Done

- [x] `design.md` Â§2/Â§4/Â§7/Â§8 ter-amend (parade, bukan parallax)
- [x] Section sticky `h-[400vh]` + wrapper `h-screen overflow-hidden` jalan
- [x] 11 kartu parade berurutan: approach â†’ hold full-bleed â†’ return ke asal
- [x] Kartu terakhir hold sampai `g = 11`
- [x] Idle float hanya kartu non-dominan
- [x] Dimming kartu lain + portrait saat ada kartu dominan
- [x] Klik hanya kartu aktif â†’ dialog FLIP, 3 jalan tutup, fokus restore
- [x] `--card-scroll` hilang total dari kode
- [x] `prefers-reduced-motion` snap, layout identik
- [x] Verifikasi Â§5 file ini + Â§8 kontrak semua PASS (Playwright)
- [x] Console nol error, WebGL context tetap 1
