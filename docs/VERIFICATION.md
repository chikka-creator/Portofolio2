# VERIFICATION.md — QA Checklist (Farline rebuild)

Status: BERLAKU. Wajib lulus sebelum klaim selesai. Lihat juga FARLINE-SPEC.md §13.

## 1. Environment
- [ ] `python -m http.server 8000` di root → http://localhost:8000.
- [ ] Tidak ada build step; buka langsung file juga boleh.

## 2. Console & network
- [ ] Console **0 error** di semua 5 halaman.
- [ ] Network **0 404** (asset, font, gambar).
- [ ] Tidak ada request ke Three.js/Tailwind/GSAP CDN.

## 3. Home (index.html)
- [ ] 10 plate muncul, counter `01 — 10`.
- [ ] Wheel memutar ring; tiap plate sekali lewat depan.
- [ ] Drag horizontal/vertikal memutar; click threshold 6px.
- [ ] Arrow keys ±1; Escape tutup plate.
- [ ] Hover plate depan → scale naik + cursor pointer.
- [ ] Klik plate ber-link (TechInventory, Streaming App UI) → buka tab baru.
- [ ] Plate terbuka: kartu lain push aside, info fade in delay 760ms; Esc menutup, focus kembali ke pemicu.
- [ ] Toggle ID/EN: HUD title/tag/hint/counter berganti; plate title tidak berubah (language-neutral).
- [ ] sr-only list terbaca (matikan JS).
- [ ] WebGL/CSS 3D gagal → list DOM terbaca.

## 4. Work (work.html)
- [ ] Tabel 3 project tampil.
- [ ] Hover baris → preview plate mengikuti kursor; fade out 120ms saat keluar.
- [ ] Klik baris → overlay dengan gambar + deskripsi + link.
- [ ] Link eksternal (GitHub, Figma) jalan.
- [ ] Esc/backdrop/close menutup overlay; focus return.
- [ ] sr-only list terbaca.

## 5. Gallery (gallery.html)
- [ ] 11 plate tampil di light table.
- [ ] Drag + inertia jalan; drag ≤ 4px → buka lightbox.
- [ ] Wheel zoom .9..1.6 clamp.
- [ ] Filter chips: All/UI/UX/Web/AI & Data/Events/Language; non-match fade .2 + scale .92.
- [ ] Hover plate → lift +12px Z.
- [ ] Lightbox: gambar besar + judul + issuer + close; Esc/backdrop/close.
- [ ] sr-only list terbaca.

## 6. About (about.html)
- [ ] Print reveal saat masuk viewport.
- [ ] Parallax ≤ 18px (print) dan ≤ 8px (H1) saat scroll.
- [ ] Blok experience terbaca (3 baris + sertifikat).
- [ ] Credits 3 kolom tampil.
- [ ] sr-only terbaca.

## 7. Contact (contact.html)
- [ ] Form render: Name, Email, Project (4 chip), Message.
- [ ] Validasi required + email regex; error message aria-live.
- [ ] Submit → buka mailto dengan subject/body terisi.
- [ ] "Book a call" → mailto dengan subject=Call.
- [ ] Chip selection toggle aria-checked.
- [ ] Print parallax jalan.
- [ ] sr-only terbaca.

## 8. Responsive
- [ ] 1440×900: layout desktop, plate tidak keluar viewport.
- [ ] 1200×800: breakpoint tablet (810-1199), padding 40px.
- [ ] 810×1080: tablet, H1 138px, intro full width.
- [ ] 390×844: phone, H1 84px, padding 20px, canvas touch-action pan-y, scroll halus, tanpa overflow.
- [ ] Playwright screenshot semua 4 ukuran; bandingkan dengan referensi (jarak, proporsi, tipografi).

## 9. Reduced motion
- [ ] DevTools Rendering → prefers-reduced-motion: reduce.
- [ ] Semua gerak berhenti; layout identik; konten tidak hilang.
- [ ] Home: state snap, float 0, parallax 0.
- [ ] Gallery: drag tanpa inertia, zoom snap, hover tanpa transform.

## 10. Accessibility
- [ ] Semua tombol ikon punya aria-label.
- [ ] :focus-visible terlihat (outline 2px ink, offset 2px).
- [ ] Kontras teks body ≥ 4.5:1 (#6B6A63 di atas putih).
- [ ] Navigasi keyboard: Tab, Enter, Space, Esc berfungsi.
- [ ] Screen reader: sr-only list terbaca.

## 11. Performance
- [ ] Lighthouse a11y ≥ 95, performance ≥ 90 (desktop).
- [ ] Satu container 3D per halaman; loop berhenti keluar viewport.
- [ ] devicePixelRatio cap 2.
- [ ] Font preload + font-display swap.
- [ ] Gambar WebP + srcset + lazy (kecuali plate pertama Home).

## 12. i18n
- [ ] Toggle ID/EN di semua halaman.
- [ ] Semua teks baru berganti; tidak ada teks nyangkut.
- [ ] Key mati tidak error (guard if translations[currentLang][key]).
- [ ] localStorage.lang persist.

## 13. Cross-browser
- [ ] Chromium (Playwright) — pass.
- [ ] Firefox — CSS 3D + backdrop-filter OK.
- [ ] WebKit/Safari — backdrop-filter OK, font OK.

## 14. Final
- [ ] README.md terupdate.
- [ ] Tidak ada file .bak di root.
- [ ] Tidak ada console.log spam / commented-out block.
- [ ] Git status bersih (kecuali perubahan yang disengaja).
