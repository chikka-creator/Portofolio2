/* Gallery Light Table Engine — Authentic Farline Physics & Deal-in Animation */

(function () {
  'use strict';

  // Deterministic pseudo-random generator matching Farline
  function R(e) {
    const t = Math.sin(e * 127.1 + 311.7) * 43758.5453;
    return t - Math.floor(t);
  }

  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  function padZero(n) {
    return String(n).padStart(2, '0');
  }

  // DOM Elements
  let stageEl = null;
  let tableEl = null;
  let worldEl = null;
  let countEl = null;
  let zoomOutBtn = null;
  let zoomInBtn = null;
  let zoomLabelEl = null;
  let filterBtns = [];

  let lightboxEl = null;
  let lightboxImg = null;
  let lightboxTitle = null;
  let lightboxMeta = null;

  // State
  let currentFilter = 'all';
  let activePrints = [];
  let currentLayout = [];
  let printNodes = new Map();
  let aspectRatios = {};
  let hoveredIndex = -1;
  let activeLightboxIndex = -1;

  // Animation & Physics State
  const tableState = {
    x: 0,
    y: 0,
    z: 1,
    tx: 0,
    ty: 0,
    tz: 1,
    vx: 0,
    vy: 0,
    sv: 0,
    sw: 0,
    drag: false,
    moved: 0,
    lx: 0,
    ly: 0,
    lt: 0
  };

  let phase = 'hidden'; // 'hidden' -> 'stack' -> 'deal' -> 'done'
  let sequenceTimers = [];
  let rafId = null;
  let reducedMotion = false;

  const EASING_DEAL = 'cubic-bezier(0.2, 0.85, 0.25, 1)';
  const EASING_STACK = 'cubic-bezier(0.55, 0, 0.2, 1)';
  const EASING_STANDARD = 'cubic-bezier(0.22, 0.8, 0.25, 1)';

  function init() {
    stageEl = document.getElementById('gal-stage');
    tableEl = document.getElementById('gal-table');
    worldEl = document.getElementById('gal-world');
    countEl = document.getElementById('gal-count');
    zoomOutBtn = document.getElementById('gal-zoom-out');
    zoomInBtn = document.getElementById('gal-zoom-in');
    zoomLabelEl = document.getElementById('gal-zoom-label');
    filterBtns = Array.from(document.querySelectorAll('.gal-filter-chip'));

    lightboxEl = document.getElementById('gal-lightbox');
    if (lightboxEl) {
      lightboxImg = lightboxEl.querySelector('.gal-lightbox-img');
      lightboxTitle = lightboxEl.querySelector('.gal-lightbox-title');
      lightboxMeta = lightboxEl.querySelector('.gal-lightbox-meta');
    }

    if (!tableEl || !worldEl || typeof GALLERY_CERTS === 'undefined') return;

    reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Pre-seed certificates with original indices
    GALLERY_CERTS.forEach((item, idx) => {
      item.originalIndex = idx;
      aspectRatios[item.img] = 1.34; // default aspect ratio
    });

    prepareDOM();
    updateFilterList('all', false);

    attachEventListeners();
    startPhysicsLoop();

    // Trigger initial deal-in sequence
    if (reducedMotion) {
      phase = 'done';
      updateAllTransforms();
    } else {
      setTimeout(() => {
        dealInSequence(780);
      }, 80);
    }
  }

  function prepareDOM() {
    worldEl.innerHTML = '';
    printNodes.clear();

    GALLERY_CERTS.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'gal-item';
      el.dataset.index = idx;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `${item.title} — ${item.issuer || ''} (${item.year})`);

      const swayMult = 0.55 + R((idx + 1) * 11.3) * 0.9;
      el.style.setProperty('--sway-mult', swayMult.toFixed(2));

      const numStr = padZero(idx + 1);

      el.innerHTML = `
        <div class="gal-item-mat">
          <img src="${item.img}" alt="" draggable="false" loading="${idx < 8 ? 'eager' : 'lazy'}">
        </div>
        <span class="gal-item-caption">
          ${numStr} — ${item.title} · ${item.year}
        </span>
      `;

      // Preload image natural aspect ratio
      const img = el.querySelector('img');
      img.addEventListener('load', () => {
        if (img.naturalWidth && img.naturalHeight) {
          const ratio = clamp(img.naturalWidth / img.naturalHeight, 0.66, 1.9);
          aspectRatios[item.img] = ratio;
          const slot = currentLayout.find(s => s.originalIndex === idx);
          if (slot) {
            el.style.height = `${(slot.w / ratio).toFixed(1)}px`;
          }
        }
      });

      worldEl.appendChild(el);
      printNodes.set(idx, el);
    });
  }

  function computeLayout(containerW, containerH, prints) {
    const isMobile = containerW < 810;
    const focalX = isMobile ? containerW * 0.5 : containerW * 0.66;
    const focalY = isMobile ? containerH * 0.55 : containerH * 0.48;
    const clearW = isMobile ? 0 : 540;
    const clearH = isMobile ? 0 : 520;
    const r = 176 * 1.01 * 1.0;
    const a = 176 * 1.24 * 1.0;

    const candidateSlots = [];
    for (let n = -2; n * a < containerH * 1.6; n++) {
      for (let i = -2; i * r < containerW * 1.7; i++) {
        const posX = i * r + (n % 2 ? r / 2 : 0) + r / 2;
        const posY = n * a + a / 2 - a * 0.18;
        if (clearW > 0 && posX - r * 0.35 < clearW && posY - a * 0.35 < clearH && posX > -r && posY > -a) {
          continue;
        }
        const seed = (n + 7) * 131 + (i + 11) * 17;
        const dist = Math.hypot((posX - focalX) / containerW, (posY - focalY) / containerH) + R(seed) * 0.08;
        candidateSlots.push({ x: posX, y: posY, d: dist });
      }
    }
    candidateSlots.sort((e, t) => e.d - t.d);

    return prints.map((item, t) => {
      const slot = candidateSlots[t] || candidateSlots[candidateSlots.length - 1] || { x: focalX, y: focalY, d: 0 };
      const u = item.originalIndex + 1;
      const width = 176 * (0.86 + R(u * 9.3) * 0.3);
      const rot = (R(u * 13.7) - 0.5) * 2 * 5;
      const x = slot.x + (R(u * 3.1) - 0.5) * r * 0.26;
      const y = slot.y + (R(u * 5.7) - 0.5) * a * 0.24;
      return {
        item,
        dealIndex: t,
        originalIndex: item.originalIndex,
        x,
        y,
        w: width,
        rot
      };
    });
  }

  function getBounds(layout) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const slot of layout) {
      const aspect = aspectRatios[slot.item.img] || 1.34;
      const h = slot.w / aspect;
      x0 = Math.min(x0, slot.x - slot.w / 2);
      x1 = Math.max(x1, slot.x + slot.w / 2);
      y0 = Math.min(y0, slot.y - h / 2);
      y1 = Math.max(y1, slot.y + h / 2);
    }
    if (!isFinite(x0)) return { x0: 0, x1: window.innerWidth, y0: 0, y1: window.innerHeight };
    return { x0, x1, y0, y1 };
  }

  function clampWorldBounds() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const r = tableState.tz;
    const bounds = getBounds(currentLayout);
    const minX = Math.min(0, W - 140 - bounds.x1 * r);
    const maxX = Math.max(0, 140 - bounds.x0 * r);
    const minY = Math.min(0, H - 140 - bounds.y1 * r);
    const maxY = Math.max(0, 140 - bounds.y0 * r);
    tableState.tx = clamp(tableState.tx, minX, maxX);
    tableState.ty = clamp(tableState.ty, minY, maxY);
  }

  function updateFilterList(filterKey, animate = true) {
    currentFilter = filterKey;

    if (filterKey === 'all') {
      activePrints = [...GALLERY_CERTS];
    } else {
      activePrints = GALLERY_CERTS.filter(c => c.category === filterKey);
    }

    const W = window.innerWidth;
    const H = window.innerHeight;
    currentLayout = computeLayout(W, H, activePrints);

    // Update filter chip UI
    filterBtns.forEach(btn => {
      const match = btn.getAttribute('data-filter') === filterKey;
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    // Update HUD counter
    if (countEl) {
      const isIndo = document.documentElement.lang === 'id' || document.documentElement.getAttribute('data-lang') === 'id';
      const label = isIndo ? `${activePrints.length} BINGKAI` : `${activePrints.length} FRAMES`;
      countEl.textContent = label;
    }

    clampWorldBounds();

    if (animate && !reducedMotion) {
      dealInSequence(560);
    } else {
      updateAllTransforms();
    }
  }

  function dealInSequence(durationToDeal) {
    sequenceTimers.forEach(clearTimeout);
    sequenceTimers = [];

    hoveredIndex = -1;
    phase = 'stack';
    if (stageEl) stageEl.dataset.phase = 'stack';
    updateAllTransforms();

    const L = currentLayout.length;
    const Ge = Math.min(0.045, 1.5 / Math.max(1, L));

    // Deal phase: cards spread across table
    sequenceTimers.push(
      setTimeout(() => {
        phase = 'deal';
        if (stageEl) stageEl.dataset.phase = 'deal';
        updateAllTransforms();
      }, durationToDeal)
    );

    // Done phase: cards become interactive
    sequenceTimers.push(
      setTimeout(() => {
        phase = 'done';
        if (stageEl) stageEl.dataset.phase = 'done';
        updateAllTransforms();
      }, durationToDeal + 1150 + L * Ge * 1000)
    );
  }

  function updateAllTransforms() {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 810;
    const focalX = isMobile ? W * 0.5 : W * 0.66;
    const focalY = isMobile ? H * 0.55 : H * 0.48;

    const L = currentLayout.length;
    const Ge = Math.min(0.045, 1.5 / Math.max(1, L));

    const activeSet = new Set(activePrints.map(p => p.originalIndex));

    GALLERY_CERTS.forEach((item, idx) => {
      const el = printNodes.get(idx);
      if (!el) return;

      const isActive = activeSet.has(idx);
      const slot = currentLayout.find(s => s.originalIndex === idx);
      const isHovered = hoveredIndex === idx && phase === 'done' && !tableState.drag;

      if (!isActive || !slot) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.transform = 'scale(0.8)';
        el.classList.remove('is-hovered');
        return;
      }

      const aspect = aspectRatios[item.img] || 1.34;
      const w = slot.w;
      const h = w / aspect;
      el.style.width = `${w.toFixed(1)}px`;
      el.style.height = `${h.toFixed(1)}px`;

      el.style.setProperty('--x', `${(slot.x - w / 2).toFixed(1)}px`);
      el.style.setProperty('--y', `${(slot.y - h / 2).toFixed(1)}px`);
      el.style.setProperty('--rot', `${slot.rot.toFixed(2)}deg`);

      const origIdx = item.originalIndex;
      const dealIdx = slot.dealIndex;

      const zScale = tableState.z || 1;
      const stackX = (focalX - tableState.x) / zScale + (R((origIdx + 1) * 2.3) - 0.5) * 16;
      const stackY = (focalY - tableState.y) / zScale + (R((origIdx + 1) * 4.1) - 0.5) * 16;
      const stackRot = (R((origIdx + 1) * 7.7) - 0.5) * 22;

      let transformStr = '';
      let transitionStr = '';

      if (phase === 'hidden' || phase === 'stack') {
        const currentScale = phase === 'hidden' ? 1.14 : 0.94;
        transformStr = `translate3d(${(stackX - w / 2).toFixed(1)}px, ${(stackY - h / 2).toFixed(1)}px, 0) rotate(${stackRot.toFixed(2)}deg) scale(${currentScale})`;
      } else {
        const currentScale = isHovered ? 1.16 : 1.0;
        const currentRot = isHovered ? 0 : slot.rot.toFixed(2);
        transformStr = `translate3d(${(slot.x - w / 2).toFixed(1)}px, ${(slot.y - h / 2).toFixed(1)}px, 0) rotate(${currentRot}deg) scale(${currentScale})`;
      }

      if (reducedMotion || phase === 'hidden') {
        transitionStr = 'none';
      } else if (phase === 'stack') {
        const delay = ((L - dealIdx) * 0.01).toFixed(3);
        transitionStr = `transform 0.62s ${EASING_STACK} ${delay}s, opacity 0.45s ${EASING_STANDARD}`;
      } else if (phase === 'deal') {
        const delay = (dealIdx * Ge).toFixed(3);
        transitionStr = `transform 1.1s ${EASING_DEAL} ${delay}s, opacity 0.4s ${EASING_STANDARD}`;
      } else {
        // phase === 'done'
        const dur = isHovered ? '0.6s' : '1s';
        transitionStr = `transform ${dur} ${EASING_STANDARD}, opacity 0.6s ${EASING_STANDARD}`;
      }

      el.style.transform = transformStr;
      el.style.transition = transitionStr;
      el.style.opacity = phase === 'hidden' ? '0' : '1';
      el.style.zIndex = phase === 'done' ? (isHovered ? 30 : 2 + L - dealIdx) : (2 + L - dealIdx);
      el.style.pointerEvents = phase === 'done' ? 'auto' : 'none';

      if (isHovered) {
        el.classList.add('is-hovered');
      } else {
        el.classList.remove('is-hovered');
      }
    });
  }

  function applyWorldTransform() {
    if (!worldEl) return;
    worldEl.style.transform = `translate3d(${tableState.x.toFixed(2)}px, ${tableState.y.toFixed(2)}px, 0) scale(${tableState.z.toFixed(4)})`;
    worldEl.style.setProperty('--sway', tableState.sw.toFixed(3));
  }

  function startPhysicsLoop() {
    function loop() {
      if (!reducedMotion) {
        if (!tableState.drag) {
          if (Math.abs(tableState.vx) > 0.05 || Math.abs(tableState.vy) > 0.05) {
            tableState.tx += tableState.vx;
            tableState.ty += tableState.vy;
            tableState.vx *= 0.93;
            tableState.vy *= 0.93;
            clampWorldBounds();
          } else {
            tableState.vx = 0;
            tableState.vy = 0;
          }
        }

        tableState.x += (tableState.tx - tableState.x) * 0.2;
        tableState.y += (tableState.ty - tableState.y) * 0.2;
        tableState.z += (tableState.tz - tableState.z) * 0.16;

        tableState.sv *= 0.9;
        tableState.sw += (clamp(tableState.sv * 0.2, -7, 7) - tableState.sw) * 0.16;

        applyWorldTransform();
      }

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);
  }

  function setZoom(targetZ, originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
    const clampedZ = clamp(Math.round(targetZ * 100) / 100, 0.5, 1.6);
    tableState.tx = originX - ((originX - tableState.tx) / tableState.tz) * clampedZ;
    tableState.ty = originY - ((originY - tableState.ty) / tableState.tz) * clampedZ;
    tableState.tz = clampedZ;

    clampWorldBounds();

    if (zoomLabelEl) {
      zoomLabelEl.textContent = `${Math.round(clampedZ * 100)}%`;
    }
  }

  const ZOOM_STEPS = [0.5, 0.65, 0.8, 1.0, 1.2, 1.4, 1.6];
  function stepZoom(direction) {
    const cur = tableState.tz;
    let next;
    if (direction > 0) {
      next = ZOOM_STEPS.find(s => s > cur + 0.001);
    } else {
      next = [...ZOOM_STEPS].reverse().find(s => s < cur - 0.001);
    }
    if (next) {
      setZoom(next);
    }
  }

  function openLightbox(item) {
    if (!lightboxEl) return;
    activeLightboxIndex = activePrints.findIndex(p => p.originalIndex === item.originalIndex);

    lightboxImg.src = item.img;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;

    const numStr = padZero(item.originalIndex + 1);
    lightboxMeta.textContent = [numStr, item.issuer, item.year].filter(Boolean).join(' · ');

    lightboxEl.showModal();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.close();
    activeLightboxIndex = -1;
  }

  function navigateLightbox(dir) {
    if (activeLightboxIndex < 0 || !activePrints.length) return;
    activeLightboxIndex = (activeLightboxIndex + dir + activePrints.length) % activePrints.length;
    const item = activePrints[activeLightboxIndex];
    openLightbox(item);
  }

  function attachEventListeners() {
    // Light Table pointer drag
    tableEl.addEventListener('pointerdown', (e) => {
      if (e.target.closest('[data-gal-ui]') || e.target.closest('.gal-intro')) return;
      tableState.drag = true;
      tableState.moved = 0;
      tableState.lx = e.clientX;
      tableState.ly = e.clientY;
      tableState.lt = performance.now();
      tableState.vx = 0;
      tableState.vy = 0;
      tableEl.classList.add('is-dragging');
      tableEl.setPointerCapture(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      if (!tableState.drag) return;
      const dx = e.clientX - tableState.lx;
      const dy = e.clientY - tableState.ly;
      const now = performance.now();
      const dt = Math.max(1, now - tableState.lt);

      tableState.lx = e.clientX;
      tableState.ly = e.clientY;
      tableState.lt = now;
      tableState.moved += Math.abs(dx) + Math.abs(dy);

      if (tableState.moved > 6 && hoveredIndex >= 0) {
        hoveredIndex = -1;
        updateAllTransforms();
      }

      tableState.tx += dx;
      tableState.ty += dy;
      tableState.x += dx;
      tableState.y += dy;
      tableState.vx = (dx / dt) * 16;
      tableState.vy = (dy / dt) * 16;
      tableState.sv = tableState.vx - tableState.vy * 0.4;

      clampWorldBounds();
    });

    const onPointerEnd = (e) => {
      if (!tableState.drag) return;
      tableState.drag = false;
      tableEl.classList.remove('is-dragging');

      try {
        tableEl.releasePointerCapture(e.pointerId);
      } catch (err) {}

      if (performance.now() - tableState.lt > 80) {
        tableState.vx = 0;
        tableState.vy = 0;
      }

      // Check click if moved <= 6px
      if (tableState.moved <= 6) {
        const itemEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.gal-item');
        if (itemEl && phase === 'done') {
          const idx = Number(itemEl.dataset.index);
          const item = GALLERY_CERTS[idx];
          if (item) {
            openLightbox(item);
          }
        }
      }
    };

    window.addEventListener('pointerup', onPointerEnd);
    window.addEventListener('pointercancel', onPointerEnd);

    // Mouse wheel pan & zoom
    tableEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const rect = tableEl.getBoundingClientRect();
        const factor = Math.exp(-e.deltaY * 0.01);
        setZoom(tableState.tz * factor, e.clientX - rect.left, e.clientY - rect.top);
      } else {
        tableState.tx -= e.deltaX;
        tableState.ty -= e.deltaY;
        tableState.sv += (-e.deltaX + e.deltaY * 0.4) * 0.12;
        clampWorldBounds();
      }
    }, { passive: false });

    // Zoom Buttons
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => stepZoom(1));
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => stepZoom(-1));
    }

    // Filter Chips
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterKey = btn.getAttribute('data-filter');
        if (filterKey) {
          updateFilterList(filterKey, true);
        }
      });
    });

    // Print Hovers & Keyboard
    GALLERY_CERTS.forEach((item, idx) => {
      const el = printNodes.get(idx);
      if (!el) return;

      const onEnter = () => {
        if (!tableState.drag && phase === 'done') {
          hoveredIndex = idx;
          updateAllTransforms();
        }
      };

      const onLeave = () => {
        if (hoveredIndex === idx) {
          hoveredIndex = -1;
          updateAllTransforms();
        }
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
      el.addEventListener('mouseleave', onLeave);
      el.addEventListener('focus', onEnter);
      el.addEventListener('blur', onLeave);

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(item);
        }
      });
    });

    // Lightbox events & Keyboard navigation
    if (lightboxEl) {
      lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl || e.target.classList.contains('gal-lightbox-container')) {
          closeLightbox();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (!lightboxEl.open) return;
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          navigateLightbox(1);
        } else if (e.key === 'ArrowLeft') {
          navigateLightbox(-1);
        }
      });
    }

    // Window Resize
    window.addEventListener('resize', () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      currentLayout = computeLayout(W, H, activePrints);
      clampWorldBounds();
      updateAllTransforms();
    });

    // Language Change Hook
    window.addEventListener('languagechange', () => {
      if (countEl) {
        const isIndo = document.documentElement.lang === 'id' || document.documentElement.getAttribute('data-lang') === 'id';
        const label = isIndo ? `${activePrints.length} BINGKAI` : `${activePrints.length} FRAMES`;
        countEl.textContent = label;
      }
    });
  }

  // Self Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
