# FARLINE-SPEC.md — Portofolio Fakhri C.D.N (Farline-style rebuild)

Status: BERLAKU. Kontrak desain + motion + content. Wajib dibaca sebelum mengubah kode.
Referensi: https://farline.framer.website (public demo). Link Framer asli private; demo publik dipakai sebagai source of truth.
Sumber ekstraksi: rendered SSR/CSS dari /, /work, /gallery, /about, /contact (published Sep 28, 2026).

## 0. Prinsip visual
- Editorial, quiet, monochrome. Stage putih #FFFFFF. Tidak ada dark mode, gradient background, decorative blob.
- Idiom 3D: plate "digantung" di ruang 3D, bukan card grid. Satu container 3D per halaman.
- Motion ketat: hanya easing/durasi di section 8. Tidak ada easing ketiga.
- Setiap container 3D punya padanan semantik (sr-only/DOM).
- Tidak ada Framer badge, CMS, Settings panel.

## 1. Token
| Token | Nilai | Dipakai di |
|---|---|---|
| stage | #FFFFFF | body, semua halaman |
| ink | #14130E | heading, logo, nav active, chip selected |
| muted | #969696 | deskripsi, meta, caption (dekorasi/label) |
| muted-2 | #6B6A63 | teks kecil yang wajib lolos kontras |
| line | #E4E4E4 | border, divider, logo pill, nav |
| paper mat | #DEDBD3 | belakang plate |
| paper edge top | #E2DAC2 | strip atas plate |
| paper edge side | #C8C0A7 | strip samping plate |
| wire | #3A3833 | kawat gantung |
| peg wood | #D9C7A2 / #6B4A22 / #4A3218 | peg (clamp kayu) |
| glass | rgba(255,255,255,0.6) | nav, HUD, status pill |
| glass-strong | rgba(255,255,255,0.72) | form card |
| shadow print | 0 34px 90px -40px rgba(0,0,0,.741) | plate |
| shadow nav | 0 18px 40px -18px rgba(20,19,14,.12) | nav |
| shadow form | 0 40px 90px -40px rgba(20,19,14,.30), 0 1px 2px rgba(20,19,14,.04) | form card |
| font display | Anton 400 | H1 |
| font body | Geist 400/500/700 | body |
| font mono | Geist Mono 400/500/600 | nav, meta, label, form |
| radius pill | 99px / 999px | nav, logo, HUD |
| radius form | 14px | form card |
| radius thumb | 8px | gallery thumbnail |
| radius plate | 0 | sudut tajam |

Warna kind (project/cert/soon) dari kontrak lama tidak dipakai; kategori ditunjukkan teks mono.

## 2. Shell bersama
### 2.1 Logo (kiri atas)
Container absolute: top 29px/left 61px (desktop), top 24/left 40 (tablet), top 16/left 20 (phone). Pill putih, border 1px #E4E4E4, radius 99px, padding 12px, z-index 10. Teks FAKHRI, Geist Mono 16px/16px, weight 600, tracking .01em, uppercase, ink. Link ke index.html, aria-current page bila di Home.

### 2.2 Status pill (kanan atas)
top 31px/right 60px (desktop), right 40 (tablet), top 18/right 20 (phone). Pill putih-alpha .6, border 1px #E4E4E4, radius 99px, padding 12px, blur 6px, z-index 10. Teks Geist Mono 12px/12px weight 500 .06em uppercase ink.
Nilai per halaman: Home `Open to work`, Work `Selected works`, Gallery `Archive`, About `Surabaya · GMT+7`, Contact `Open for work`.

### 2.3 Nav glass (bawah tengah)
Container fixed: bottom 26px, left 50%, transform translate(-50%), z-index 20. Nav: flex, gap 2px, padding 5px, radius 100px, bg glass, border 1px #E4E4E4, blur 6px, shadow nav. Link: padding 11px 18px, radius 100px, Geist Mono 12px/12px weight 500 .06em uppercase. Active: bg ink text white. Inactive: transparent text ink. Item: Main to index, Work to work, Gallery to gallery, About to about, Contact to contact. Transition: background-color .35s cubic-bezier(.22,.8,.25,1), color .35s.

### 2.4 Language toggle (kiri bawah)
Fixed: bottom 30px/left 60px desktop; bottom 88px/left 20px phone. Pill glass, border 1px #E4E4E4, blur 6px, radius 999px, padding 5px, gap 4px, z-index 60. Dua tombol ID/EN, Geist Mono 11px/14px .14em uppercase. Selected: bg ink text white. Persist localStorage.lang (default id).

### 2.5 Tidak ada footer
Mengikuti referensi: tidak ada footer, tidak ada Framer badge, tidak ada credit bar.

### 2.6 Page entry animation
`.page-intro` awal opacity .001 + translateY(28px) spring 1s cubic-bezier(.22,1,.36,1) delay .1s bounce 0. Plate awal opacity 0 transition transform 1.4s cubic-bezier(.16,1,.3,1), opacity .9s.

## 3. Home — 3D hang hero
### 3.1 Komposisi
Section full viewport 100vh, overflow hidden, bg white. H1 `FAKHRI` Anton, ukuran min(141px, max(46px, .09576×vw)), lalu di-shrink bila scrollWidth > vw − 2×left. Line-height .84, tracking -.005em, uppercase, ink, nowrap. Posisi: left min(78px, max(20px, .042×W)), top min(168px, max(84px, .18×H)) desktop / min(110px, max(84px, .11×H)) phone. Max-width min(44%, 620px). Deskripsi Geist 13.5/21 muted-2 di bawah H1, max-width min(340px, .4W), margin-top min(43px). Divider 44×1px line, margin-bottom 14px. Print scene layer: absolute inset 0, z-index 20, transform-style preserve-3d, pointer-events none. H1 + deskripsi: z-index 30, pointer-events none.

### 3.2 Rumus camera / cascade (desktop 1440×900 baseline)
W = viewport width, H = viewport height. S = clamp(1.5 − W/H, 0, 1); stack mode bila S > 0.5. w = 1 + 1.3×S. perspective = (W/2)/tan(fovRad/2)×w, fov baseline 87° + 5°×open + 7°×(1−intro). Baseline ≈ 758.7px. perspectiveOrigin = 74% 24.3% (camX .74, camY .243). Untuk plate index i, posisi relatif r = (i − posCur + N) mod N (0..N−1):
- x = (.208 + .14×w×(1 − .45×S) × r) × W
- y = (1.206 + (−.138)×(1 + .1×S) × r) × H
- z = (−15 − 15×r + 26×hover) × w + dolly
Transform plate: translate3d(x − boxW/2, y − boxH/2, z) rotateY(−24°) rotateZ(3°) scale(boxScale). boxW = 1.02 × max(.51, openSize/I) × W (baseline 749px); boxH = boxW / 1.3 (aspect 1.3:1). boxScale = .51×W / boxW. Origin plate: 50% 50%. Origin sheet (gantungan): 7% 0 bila yaw ≤ 0, else 93% 0 (dinamis).

### 3.3 Konstruksi plate
`.plate` container: transform-style preserve-3d, will-change transform, awal visibility hidden opacity 0. `.sheet`: bg paper mat #DEDBD3, width/height box, object-fit cover, object-position focus || 50% 50%. Top edge: strip .0075×boxW (≈5.6px) bg #E2DAC2. Side edge: strip .014×boxW (≈10.5px) bg #C8C0A7. Shadow: 0 0 0 .5px rgba(0,0,0,.12), 0 calc(34px + lift×82px) calc(90px + lift×110px) -40px rgba(0,0,0,.741). Veil: overlay #ECEAE3, opacity --dark (distance haze, 0..1). `.wire`: 3 segmen per plate, height 2px, radius 1px, bg wire, mask linear-gradient(transparent, #000 30%, #000 70%, transparent). Sag 0.06 × chord × .889. `.peg`: wooden clamp, width .03×boxW, height .098×boxW, depth .4×width. Dua jaw (front/back), masing-masing 4 face, dua coil disc. Jaw membuka 12°×openingProgress. Opacity peg: --po (0..1), mengikuti visibility line.

### 3.4 Interaksi
Wheel: listener window capture, passive false, hanya bila pointer di atas stage; preventDefault. posTarget += .0032 × deltaY × scrollSpeed. Bila plate terbuka, wheel menutup plate. Drag: pointerdown di mana saja kecuali [data-pm-ui]; pointer capture. posTarget -= .011 × (horizontal ? dx×.8 : dy). Horizontal factor .0088 index/px. Click/tap bila total drag ≤ 6px; pilih plate paling depan (depth terbesar) di bawah pointer. Keyboard: ArrowRight/Down/PageDown +1; ArrowLeft/Up/PageUp −1; Escape tutup. preventDefault pada panah. Hover: amount lerp .14/frame; deteksi via projected quad; plate paling depan menang; cursor pointer. Hover menggeser plate +26px Z. Open: progress rate dt/1.2; closing dt/.82. Plate aktif pindah ke x=.715W, y=.5H, tambah z=.34×N (≈258px), scale agar projected width .48W; yaw/roll → 0; lift ≈38px di mid-open; kartu lain push aside 2–6% dan gain veil. UI (counter/hint) fade out delay 130ms; info plate fade in delay 760ms. Position wrap: modulo N; rebasing posTarget setelah drift 6×N. Lerp posisi: posCur += (posTarget − posCur) × min(1, dt×.1); dt cap 50ms. Idle float: clock += .006/frame; pointer tilt damped .06; camera origin shift pushX .5 × .045 = .0225W, pushY .4 × .035 = .014H; idle sine sin(clock)×.3×.012 dan cos(.9×clock)×.3×.009. Sheet sway spring: target Z tilt 30×(.84 + .32×((i×.6180339)%1)), cap Z ±14°, X −10..18°, stiffness 1.9, breeze sine amplitude Z 14°, X 70°. Intro: 10 plate; durasi total 0.62 + .095×9 + .3 = 1.775s; per-plate delay .095 × clamp(r+1.2,0,9); travel .62s easeOutQuint; offset +96px, extra yaw −26°; opacity fade smoothstep 30% pertama. Reduced motion / canvas mode: intro, float, sway, opening lerp dimatikan (state snap); CSS entry animation dimatikan.

### 3.5 Konten Home
10 plate (urutan searah jarum jam):
1. project TechInventory System — TechInventory.png — Full-Stack — https://github.com/chikka-creator/TechInventory.git
2. cert SIMETRI 2025 — sertif1.jpeg — UI/UX Design — Departemen SI ITS
3. project Streaming App UI — RemakeNet.png — Mobile-First — Figma link
4. cert Dasar Frontend & Backend — sertif2.jpeg — Web Dev — Bali Project Indonesia
5. cert AI untuk Software Developer — sertif7.jpeg — Artificial Intelligence — Bali Project Indonesia
6. cert Global Game Jam 2025 — sertif6.jpeg — Game Dev — GADAS & Ciputra Univ.
7. cert English Discoveries — seritf8.jpeg — Language — Edusoft Ltd.
8. cert Data Science Expo — sertif9.png — Data Science — PENS
9. cert Seminar Sekolah Kedinasan — sertif10.jpeg — Career Prep — LKP Science Society
10. cert Entrepreneur Fest 2026 — sertif11.png — Entrepreneurship — (issuer TBD)

Plate texture: foto penuh object-fit cover, paper mat. Nama project/sertif ditampilkan di HUD bawah plate (DOM, bukan texture) agar i18n berjalan. HUD plate aktif: kind pill (mono, ink border), title (Geist 18px/700), tag (Geist Mono 11px), hint (Geist Mono 11px muted). Counter HUD: `01 — 10` Geist Mono 12px/12px weight 500 .06em ink, posisi kanan atas top 31/right 60. Kind pill: bg ink text white radius 999px. Tag: Geist Mono 11px muted. sr-only fallback: h2 + ul 10 item dengan judul + link (project saja). WebGL gagal: try/catch → sembunyikan canvas, tampilkan list DOM biasa. IntersectionObserver → hentikan loop keluar viewport. Touch: touch-action pan-y di canvas.
## 4. Work — index + hover preview
### 4.1 Layout
Full viewport 100vh, bg white, padding 162px 60px 0 61px desktop. H1 `WORK`/`KARYA` Anton 138/84% uppercase ink at x61/y162. Deskripsi Geist 13.5/21 muted-2 width 340px. Divider 44×1px line margin 39px 0 14px. Tabel: kolom No. / Title / Series / Place / Year. Geist Mono 12px/18px .06em uppercase. Header muted, baris ink. Hover baris → preview plate muncul mengikuti kursor (absolute, z-index 40, transform follow lerp .12). Baris project (3):
1. TechInventory System — Web App — Surabaya — 2025 — https://github.com/chikka-creator/TechInventory.git
2. Streaming App UI — Mobile UI — Surabaya — 2025 — Figma link
3. Portfolio v2 (Farline rebuild) — Web — Surabaya — 2026 — (self)
Klik baris → buka plate overlay (dialog native) dengan gambar + deskripsi + link. Easing FLIP cubic-bezier(.25,1,.5,1) .4s. sr-only: daftar project dengan link.

### 4.2 Hover preview
Plate preview ~320×246px, radius 0, shadow print, paper mat. Posisi: left cursorX + 24, top cursorY − 120, clamp ke viewport. Transisi opacity/transform .25s cubic-bezier(.22,.8,.25,1). Hanya tampil bila pointer di atas baris; fade out 120ms saat keluar.

## 5. Gallery — light table
### 5.1 Layout
Full viewport 100vh, min-height 680px, padding 162px 60px 0 61px. H1 `GALLERY`/`GALERI` Anton 138/84%. Deskripsi Geist 13.5/21 muted-2. HUD kiri atas: `11 frames` (atau N frames) Geist Mono 12px/12px weight 500, pill putih-alpha .6, blur 6px, z-index 20, top 31/right 60. Zoom HUD kanan bawah: pill `− / 100% / +`, Geist Mono 12px/12px, tombol 36×34px, label min-width 44px. z-index 20, bottom 26/right 60. Filter chip bar: `All 11`, plus kategori. Chip: Geist Mono 12px/12px .06em uppercase, padding 8px 14px, radius 999px, border 1px #E4E4E4. Selected: bg ink text white. Unselected: bg white-alpha .7 text ink. Canvas light table: absolute inset 0, overflow hidden, touch-action none, user-select none, cursor grab. Item: plate ~180×138px (aspect 1.3), radius 0, shadow print, paper mat. Scatter posisi awal acak tapi deterministik (seed dari index), rotasi ±6°, z-index by depth. Bottom fade: linear-gradient transparent → white, height 150px, pointer-events none. Lightbox: native dialog dengan plate besar + judul + issuer + close. Easing FLIP cubic-bezier(.25,1,.5,1) .4s. Esc/backdrop/close menutup; focus return.

### 5.2 Interaksi
Drag: pointerdown → capture; setiap move translate(x,y) item; inertia: velocity lerp .08/frame, decay .92/frame. Bila drag ≤ 4px → buka lightbox. Wheel: zoom scale .9..1.6, lerp .12/frame, clamp. Filter: chip click → item yang tidak match fade opacity .2 + scale .92 dalam .3s; match tetap. Hover item: lift +12px Z + rotate → 0, shadow naik; cursor pointer. Reduced motion: drag tetap jalan (tanpa inertia), zoom snap, hover tanpa transform.

### 5.3 Konten Gallery (11 sertifikat)
Filter kategori:
- All 11
- UI/UX 1: SIMETRI 2025
- Web 4: Dasar Frontend & Backend, Computational Thinking (SMP), Computational Thinking (SMA), Chat Apps for Business
- AI & Data 2: AI untuk Software Developer, Data Science Expo
- Events 3: Global Game Jam 2025, Seminar Sekolah Kedinasan, Entrepreneur Fest 2026
- Language 1: English Discoveries

## 6. About
### 6.1 Layout (desktop 1440×900)
Stage full viewport, padding 97px 60px 0 61px, flex row, align start, min-height 760px. Intro width 489px, padding-top 65px. H1 `ABOUT`/`TENTANG` Anton 138/84% at x61/y162. Divider 44×1px line, padding 39px 0 14px. Bio Geist 13.5/21 muted-2, width 340px. Cue Geist Mono 12/18 muted uppercase, padding-top 22px. Nilai: `Surabaya · GMT+7`. Credits: flex row, gap 51px, padding-top 44px. Tiga kolom:
- Focus: Front-End Development, UI/UX Design, Design Systems, Web Performance.
- Tools: VS Code, Figma, Canva, Git, Tailwind.
- Recognition: SIMETRI 2025, Global Game Jam 2025, Data Science Expo, Seminar Sekolah Kedinasan, Entrepreneur Fest 2026.
Portrait: flex 1, max-width 1600px, full height, padding-bottom 28px. Cutout `portait.png` (768×1024, ARGB) sebagai `.print` di dinding. Print: 508.4×391.0769px, centered, perspective 640.6px, origin 63% 12%, initial translate3d(0,74px,0) rotateY(-50deg) rotateZ(3deg), opacity 0. Mat/edge/shadow sesuai section 3.3. Caption: Geist Mono 12/18 muted, right-aligned, padding-right 40px.

### 6.2 Blok kedua (experience) — muncul saat scroll
Pengalaman detail dipindah ke blok kedua di bawah stage, gaya editorial sama (bg white, H2 Anton, tabel). Berisi 3 baris pengalaman (magang, organisasi, workshop) + daftar sertifikat unggulan. Tidak ada sticky kedua — hanya scroll normal.

### 6.3 Interaksi
Print reveal: opacity 0 → 1 + transform ke posisi akhir, transition 1.4s/.9s saat masuk viewport (IntersectionObserver threshold .2). Parallax ringan saat scroll: translateY(scrollProgress × 18px) pada print, translateY(scrollProgress × −8px) pada H1 (maks 18px). Reduced motion: state snap, parallax 0.
## 7. Contact
### 7.1 Layout (desktop)
Stage full viewport, padding 162px 60px 0 61px, flex column, min-height 760px. Intro width min-content. H1 `CONTACT`/`KONTAK` Anton 138/84% at x61/y162. Divider + deskripsi Geist 13.5/21 muted-2, width 300px. Cue: `Surabaya · Indonesia` Geist Mono 12/18 muted, padding-top 22px. Email link: Geist 27px/112% weight 500, tracking -.015em, ink, dengan panah ↗. Padding-top 46px. mailto:ditofakhri3@gmail.com. Details: padding-top 16px, gap 10px. Baris `Based in / Surabaya, Indonesia`, `Elsewhere / GitHub ↗ · Instagram ↗`, `Response / within 2 days`. Print + form layer: absolute top 0/left 440px/right 0/height 100%, width 700px. Portrait absolute top 10px/left 77px, 92%×86%, max-width 1000px container. Form absolute bottom 110px/left 120px, width 560px. Print: sama dengan About (508.4×391.0769px, perspective 640.6, origin 63% 12%).

### 7.2 Form (glass)
Card `.contact-form`: bg glass-strong, border 1px #E4E4E4, radius 14px, blur 18px, shadow form, padding 28px. Header: `New enquiry` Geist Mono 12/16 muted uppercase .14em. Step `01 / 02` Geist Mono 12/16 muted. Fields:
- Name: text, name="name", autocomplete name, placeholder `Your name`.
- Email: email, name="email", autocomplete email, placeholder `you@studio.com`.
- Project: radiogroup, 4 chip: `Front-End`, `UI/UX`, `Collaboration`, `Other`. Selected chip bg ink/text white; unselected bg white-alpha .7/text ink.
- Message: textarea rows 2, name="message", placeholder `Tell me about the work — place, dates, how it will be used.`
Input style: transparent bg, bottom border 1px #E4E4E4, focus bottom border ink, placeholder muted. Geist/Inter 14px/20px. Submit `Send enquiry →` type submit, bg ink, text white, radius 999px, padding 12px 20px, Geist Mono 12px/12px weight 500 .06em uppercase. Arrow transform on hover translateX(2px). Secondary `Book a call` → mailto:ditofakhri3@gmail.com?subject=Call, ghost style (border line, text ink). Form novalidate (validasi JS ringan: required + email regex). Submit → buka mailto dengan subject/body terisi. Tidak ada backend. Tidak ada step kedua meski ada `01 / 02`.

## 8. Motion contract — persis dua easing
| Tipe | Easing | Durasi | Pemakaian |
|---|---|---|---|
| masuk / reveal | cubic-bezier(0.16, 1, 0.3, 1) | .7s (CSS) / 1s (spring) | .reveal → .reveal.active, page intro |
| state kecil | cubic-bezier(0.22, 0.8, 0.25, 1) | .35s | nav, chip, button, hover preview |

Gerak idle (float, sway, parallax, inertia) ditulis sin()/cos() di frame loop, bukan @keyframes. Tidak ada easing ketiga.

Scroll-linked (semua section scroll-driven):
```
rect = section.getBoundingClientRect()
progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1)
current += (target - current) * min(1, delta * 7.5)
```
Faktor 7.5 wajib konsisten. Reduced motion: current = target (snap).

Listener: scroll/pointermove/wheel wajib { passive: true } kecuali wheel Home hang → passive false + capture. touch-action: pan-y di setiap canvas (atau none untuk gallery).

Reduced motion: matikan gerak, bukan tampilan. Posisi akhir identik dengan versi beranimasi, hanya tanpa interpolasi. CSS: entry animation off, hover transform off, inertia off (snap), parallax 0. JS: if matchMedia('(prefers-reduced-motion: reduce)') → state snap.

## 9. A11y & fallback
- Setiap canvas punya padanan semantik: sr-only list judul + link.
- Scroll mobile tidak terkunci canvas (pan-y).
- WebGL/CSS 3D gagal → konten tetap terbaca dari DOM (list biasa), bukan layar kosong.
- Elemen interaktif: aria-label pada tombol ikon, :focus-visible terlihat (outline 2px ink, offset 2px).
- Form: label terasosiasi, error message dengan aria-live polite.
- Lightbox/dialog: Esc, backdrop, close; focus return ke pemicu.
- Kontras: teks body minimal #6B6A63 di atas putih (4.5:1); label dekoratif #969696 hanya untuk teks ≥18px atau uppercase mono.

## 10. i18n
- Teks yang di-draw ke canvas harus language-neutral (nama project/sertif). HUD title & hint boleh i18n karena DOM.
- Teks berbahasa → data-i18n + dictionary id dan en. Guard if (translations[currentLang][key]).
- Key mati boleh, teks tanpa key tidak boleh.
- Kolom baru wajib diisi dua sisi. HTML → innerHTML, teks biasa → textContent.
- HUD yang berganti per state memakai hook updateHUDLanguage.

## 11. Performa
- Satu container 3D per halaman. Loop WAJIB berhenti keluar viewport via IntersectionObserver → cancelAnimationFrame.
- devicePixelRatio cap 2.
- Font preload: Anton, Geist, Geist Mono (WOFF2). font-display swap.
- Gambar: WebP + srcset (1x/2x), loading lazy kecuali plate pertama Home.
- Tidak ada Three.js, tidak ada GSAP, tidak ada bundler.

## 12. Data model
### 12.1 Project (work.html)
{ id, title, series, place, year, img, url, descId, descEn } — 3 item: TechInventory System, Streaming App UI, Portfolio v2.

### 12.2 Plate (index.html)
{ kind: "project"|"cert", title, tag, img, url, hintId, hintEn, issuer? } — 10 item (lihat section 3.5).

### 12.3 Certificate (gallery.html)
{ id, title, issuer, year, category, img } — 11 item (lihat section 5.3). Kategori: uiux, web, aidata, events, lang.

### 12.4 i18n dictionary
Key minimal (id + en): navMain, navWork, navGallery, navAbout, navContact, status*, heroTitle, heroDesc, workTitle, workDesc, galleryTitle, galleryDesc, galleryFrames, aboutTitle, aboutBio, aboutFocus, aboutTools, aboutRecognition, contactTitle, contactDesc, contactCue, contactEmail, contactBased, contactElsewhere, contactResponse, formName, formEmail, formProject, formMessage, formSend, formBook, formStep, chip*.

## 13. Verifikasi (wajib sebelum klaim selesai)
1. python -m http.server 8000 → http://localhost:8000.
2. Console 0 error. 404 asset → pastikan fallback jalan, bukan crash.
3. Home: scroll/wheel/drag/keys memutar 10 plate, counter 01→10, tiap plate sekali lewat depan. Hover scale naik. Klik plate ber-link → buka tab baru. Esc menutup plate, focus kembali.
4. Work: hover baris → preview mengikuti kursor; klik → overlay; link eksternal jalan.
5. Gallery: drag + inertia, zoom ±, filter, lightbox, Esc.
6. About: print reveal, parallax ≤18px, blok experience terbaca.
7. Contact: validasi, submit membuka mailto dengan subject/body terisi, Book a call jalan.
8. Toggle ID/EN: semua teks berganti, tidak ada teks nyangkut.
9. Reduced motion: semua gerak berhenti, layout identik.
10. No-JS: sr-only list terbaca, form tetap submit (mailto default).
11. Mobile 390×844: scroll halus, canvas tidak menahan gesture, tanpa overflow, plate tidak keluar viewport.
12. Playwright screenshot di 1440×900, 1200×800, 810×1080, 390×844; bandingkan dengan referensi (jarak, proporsi, tipografi).
13. Lighthouse: a11y ≥95, performance ≥90 (desktop).

## 14. Out of scope (YAGNI)
CMS, multi-page print detail, Settings panel, drag-to-spin manual, DOF/post-processing, dark mode, bundler, GSAP/ScrollTrigger, animation-timeline, teks 3D.

## 15. Catatan sumber
- Link Framer asli private; demo publik farline.framer.website dipakai. Semua angka diekstrak dari SSR/CSS demo. Bila ada perbedaan kecil saat implementasi, prioritaskan tampilan semirip mungkin dengan demo, bukan nilai absolut.
- Aset sertifikat tahun penerbitan yang tidak terbaca di scan → tandai `—` di UI, jangan menebak.
- `portait.png` (768×1024, ARGB) dipakai sebagai cutout; `potraiit.jpg` sebagai fallback foto.
