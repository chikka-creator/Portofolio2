# MOTION.md — Kontrak Motion Detail (Farline rebuild)

Status: BERLAKU. Semua nilai motion. Lihat juga FARLINE-SPEC.md §3.4 dan §8.

## 1. Dua easing (satu-satunya)
- Enter/reveal: `cubic-bezier(0.16, 1, 0.3, 1)`.
- State kecil: `cubic-bezier(0.22, 0.8, 0.25, 1)`.
- Gerak idle ditulis `sin()`/`cos()` di frame loop, bukan `@keyframes`. Tidak ada easing ketiga.

## 2. Durasi standar
| Token | Nilai | Pemakaian |
|---|---|---|
| durFast | 0.25s | hover preview, chip, tooltip |
| durState | 0.35s | nav, button, form focus |
| durReveal | 0.7s | .reveal → .reveal.active |
| durSpring | 1.0s | page intro (spring) |
| durPlate | 1.4s | plate transform reveal |
| durOpacity | 0.9s | plate opacity reveal |
| durFlip | 0.4s | dialog FLIP, lightbox |

## 3. Home — 3D hang
### 3.1 Entry (intro)
- 10 plate. Durasi total `0.62 + 0.095×9 + 0.3 = 1.775s`.
- Per-plate delay `0.095 × clamp(r + 1.2, 0, 9)` detik.
- Travel `0.62s` easeOutQuint (`1 - (1-e)^5`).
- Offset awal `+96px` Y, extra yaw `-26°`.
- Opacity fade smoothstep pada 30% pertama travel (≈0.186s).
- Page intro (H1): `1s cubic-bezier(.22,1,.36,1)` delay `.1s`, awal opacity .001 + translateY(28px) + blur 12px? H1: opacity 0 → 1, filter blur 12px → 0, transform translateY(30px) scale(.94) → none, durasi 1.15s delay .62s.
- Meta: opacity 0 → 1, translateY(16px) → 0, durasi 1s delay 1.05s, easing cubic-bezier(.33,1,.68,1).

### 3.2 Lerp & scroll
- posCur += (posTarget - posCur) × min(1, dt × 0.1). dt cap 50ms.
- progress = clamp(-rect.top / (rect.height - innerHeight), 0, 1).
- current += (target - current) × min(1, delta × 7.5).
- Reduced motion: current = target (snap).

### 3.3 Interaksi
- Wheel: posTarget += 0.0032 × deltaY × scrollSpeed. passive false + capture. Bila plate terbuka → wheel menutup.
- Drag: posTarget -= 0.011 × (horizontal ? dx×0.8 : dy). Horizontal factor 0.0088 index/px. Click threshold 6px (total movement).
- Keyboard: ArrowRight/Down/PageDown +1; ArrowLeft/Up/PageUp -1; Escape tutup.
- Hover: amount lerp 0.14/frame; deteksi projected quad; plate paling depan menang; cursor pointer. Hover → +26px Z.
- Open: progress rate dt/1.2; close dt/0.82. Plate aktif → x=.715W, y=.5H, z += .34×N (≈258px), scale projected width .48W; yaw/roll → 0; lift ≈38px mid-open. Kartu lain push aside 2–6% + gain veil. UI fade out delay 130ms; info fade in delay 760ms.
- Position wrap: modulo N; rebasing posTarget setelah drift 6×N.

### 3.4 Idle float
- clock += 0.006/frame.
- Pointer tilt damped 0.06.
- Camera origin shift: pushX 0.5 × 0.045 = 0.0225W; pushY 0.4 × 0.035 = 0.014H.
- Idle sine: sin(clock) × 0.3 × 0.012 = 0.0036; cos(0.9×clock) × 0.3 × 0.009 = 0.0027.
- Sheet sway spring: target Z tilt 30×(0.84 + 0.32×((i×0.6180339)%1)), cap Z ±14°, X -10..18°, stiffness 1.9, breeze sine amplitude Z 14°, X 70°.
- Reduced motion / canvas mode: intro, float, sway, opening lerp dimatikan (state snap).

## 4. Work
- Hover preview: opacity/transform .25s cubic-bezier(.22,.8,.25,1); fade out 120ms.
- Preview follow: lerp .12/frame ke cursorX+24, cursorY-120, clamp viewport.
- Overlay FLIP: cubic-bezier(.25,1,.5,1) .4s. showmodal → ukur rect pemicu → invert → reflow → lepas → transisi.
- Reduced motion: FLIP mati, dialog buka/tutup normal.

## 5. Gallery
- Drag: pointer capture; translate item; inertia velocity lerp .08/frame, decay .92/frame. Drag ≤ 4px → buka lightbox.
- Wheel: zoom scale .9..1.6, lerp .12/frame, clamp.
- Filter: chip click → non-match fade opacity .2 + scale .92 dalam .3s; match tetap.
- Hover item: lift +12px Z + rotate → 0, shadow naik; cursor pointer.
- Lightbox: FLIP cubic-bezier(.25,1,.5,1) .4s. Esc/backdrop/close; focus return.
- Reduced motion: drag tanpa inertia (snap), zoom snap, hover tanpa transform.

## 6. About
- Print reveal: opacity 0 → 1 + transform ke posisi akhir, transition 1.4s/.9s saat masuk viewport (IntersectionObserver threshold .2).
- Parallax: print translateY(scrollProgress × 18px); H1 translateY(scrollProgress × -8px); maks 18px.
- Reduced motion: state snap, parallax 0.

## 7. Contact
- Print parallax sama dengan About.
- Form focus: bottom border #E4E4E4 → ink, .35s cubic-bezier(.22,.8,.25,1).
- Submit button arrow: translateX(2px) on hover, .35s.
- Chip selected: bg ink text white, .2s.

## 8. Reduced motion (global)
- Matikan gerak, bukan tampilan. Posisi akhir identik dengan versi beranimasi.
- CSS: entry animation off, hover transform off, inertia off (snap), parallax 0.
- JS: `if (matchMedia('(prefers-reduced-motion: reduce)').matches)` → state snap, float 0.

## 9. Canvas/container loop
- Satu container 3D per halaman. Loop WAJIB berhenti keluar viewport via IntersectionObserver → cancelAnimationFrame.
- devicePixelRatio cap 2.
- touch-action: pan-y (Home/About/Contact) atau none (Gallery).

## 10. Anti-pattern (motion)
- Tanpa GSAP/ScrollTrigger/Framer Motion.
- Tanpa `animation-timeline`/`scroll()`/`view()` (Firefox preview).
- Tanpa `@keyframes` untuk gerak idle.
- Tanpa easing ketiga.
- Tanpa lampu 3D / post-processing.
- Tanpa drive zoom dengan `transition` + scroll listener.
