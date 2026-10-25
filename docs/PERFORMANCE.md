# PERFORMANCE.md — Budget & Strategi (Farline rebuild)

Status: BERLAKU. Target performa dan cara mencapainya.

## 1. Target
- Lighthouse Performance ≥ 90 (desktop), ≥ 80 (mobile).
- Lighthouse Accessibility ≥ 95.
- First Contentful Paint < 1.5s (desktop), < 2.5s (mobile).
- Largest Contentful Paint < 2.5s.
- Cumulative Layout Shift < 0.1.
- Total Blocking Time < 200ms.

## 2. Budget aset
- Satu file HTML ≤ 40KB.
- Satu file CSS ≤ 25KB; total CSS ≤ 80KB.
- Satu file JS ≤ 30KB; total JS ≤ 120KB.
- Gambar plate: ≤ 120KB (WebP, 1600px lebar).
- Font total ≤ 120KB (subset).
- Total halaman (transfer) ≤ 1MB (desktop), ≤ 600KB (mobile).

## 3. Strategi loading
- Font preload di head: Anton, Geist, Geist Mono (WOFF2). `font-display: swap`.
- Plate pertama Home: `loading="eager"`, `fetchpriority="high"`.
- Plate lain & gallery: `loading="lazy"`.
- Portrait: `loading="lazy"`.
- CSS: tokens → base → chrome → page (urutan penting, hindari FOUC).
- JS: defer, urutan data → i18n → chrome → page.

## 4. Runtime
- Satu container 3D per halaman. Loop WAJIB berhenti keluar viewport via IntersectionObserver → cancelAnimationFrame.
- devicePixelRatio cap 2 (`Math.min(devicePixelRatio || 1, 2)`).
- Lerp per frame; dt cap 50ms; hindari alokasi di loop (reuse vector/object).
- Event listener scroll/pointer/wheel: `{ passive: true }` kecuali wheel Home (passive false + capture).
- Hindari forced reflow: batch read/write DOM.

## 5. Gambar
- WebP dengan fallback (picture element).
- srcset 1x/2x untuk plate.
- Resize sumber ke 1600px lebar (2x untuk plate 800px).
- Portrait cutout: WebP dengan alpha, quality 90.

## 6. Pengukuran
- Lighthouse (Chrome DevTools) per halaman, desktop & mobile.
- Playwright: screenshot + console error + network 404.
- Cek `renderer.info` / tidak ada WebGL context kedua (N/A — CSS 3D, tapi cek tidak ada canvas berlebih).
- Profil frame: Chrome Performance tab, pastikan 60fps saat scroll Home.

## 7. Anti-pattern performa
- Tanpa Three.js/GSAP/bundler.
- Tanpa `@keyframes` untuk gerak idle (pakai sin() di loop).
- Tanpa menambah container 3D kedua.
- Tanpa gambar > 300KB di above-the-fold.
- Tanpa font > 3 file (Anton, Geist, Geist Mono).
