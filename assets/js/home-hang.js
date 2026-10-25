/* Home 3D Hang Hero Engine - Farline Exact Implementation */

(function () {
  const N = (typeof ORBIT_PLATES !== "undefined" && ORBIT_PLATES.length) || 10;
  const SCROLL_SPEED = 1.0;
  const DT_CAP = 50; // ms

  const a = {
    camX: 0.74,
    camY: 0.243,
    dolly: 0,
    fov: 87,
    yaw: -24,
    roll: 3,
    size: 0.51,
    stepX: 0.14,
    stepY: -0.138,
    stepZ: 15,
    pushX: 0.5,
    pushY: 0.4,
    pushZ: 0.3,
    sway: 1,
    breeze: 0.35,
    sag: 0.06
  };
  const ze = 0.86;
  const Be = 0.03;
  const Ve = 0.098;
  const Z = Math.PI / 180;

  const Fe = (v, m) => ((v % m) + m) % m;
  const Y = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);
  const X = (v, min, max) => Y((v - min) / (max - min));
  const Pe = t => t * t * (3 - 2 * t);
  const je = e => (e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2);
  const Ne = t => 1 - Math.pow(1 - t, 5);
  const Me = (v0, v1, t) => v0 + (v1 - v0) * t;

  let stage = null;
  let scene = null;
  let counterEl = null;
  let swapEl = null;

  let cards = [];
  let wires = [];
  let pegs = [];

  let currentBoxW = 0;

  // Motion and interaction state
  let posCur = 0;
  let posTarget = 0;
  let openingIndex = -1;
  let openStates = new Float64Array(N);
  let hoverStates = new Float64Array(N);
  let hoveredIndex = -1;

  let onStage = new Array(N).fill(false);
  let quads = Array.from({ length: N }, () => new Float64Array(8));
  let cardDepths = new Float64Array(N);
  let sz = new Float64Array(N);
  let szv = new Float64Array(N);
  let sx = new Float64Array(N);
  let sxv = new Float64Array(N);
  let rest = Array.from({ length: N }, () => [0, 0, 0, 0, 0, 0, 1]);

  let introT = 0;
  let clock = 0;
  let lastTimestamp = 0;
  let isRunning = false;
  let rafId = null;

  let isDragging = false;
  let hasDragged = false;
  let hasPointerCapture = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let totalDragDist = 0;
  let pointerVelocity = 0;
  let dragVelocity = 0;

  let normPointerX = 0;
  let normPointerY = 0;
  let dampedTiltX = 0;
  let dampedTiltY = 0;

  let currentSwapMode = "idle";
  let currentSwapIndex = -1;
  let swapTimeout = null;

  function init() {
    stage = document.getElementById("hang-stage");
    scene = document.getElementById("hang-scene");
    counterEl = document.getElementById("hang-counter");
    swapEl = document.getElementById("hang-swap");

    if (!stage || !scene) return;

    try {
      buildSceneDOM();
      attachListeners();
      renderSwapContent("idle", -1);
      startLoop();

      const urlParams = new URLSearchParams(window.location.search);
      const sParam = urlParams.get("spotlight");
      if (sParam !== null) {
        const sIdx = parseInt(sParam, 10);
        if (!isNaN(sIdx) && sIdx >= 0 && sIdx < N) {
          setTimeout(() => openPlate(sIdx), 150);
        }
      }
    } catch (e) {
      document.body.classList.add("no-3d");
    }
  }

  function buildSceneDOM() {
    scene.innerHTML = "";
    cards = [];
    wires = [];
    pegs = [];

    // 1. Cards
    for (let i = 0; i < N; i++) {
      const data = ORBIT_PLATES[i];
      const card = document.createElement("div");
      card.className = "hang-card";
      card.setAttribute("data-index", String(i));
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", data.title + " — " + data.tag);

      const sheet = document.createElement("div");
      sheet.className = "hang-sheet";

      const img = document.createElement("img");
      img.src = data.img;
      img.alt = data.title + " — " + data.tag;
      img.draggable = false;
      if (i === 0) {
        img.loading = "eager";
        img.setAttribute("fetchpriority", "high");
      } else {
        img.loading = "lazy";
      }

      const veil = document.createElement("div");
      veil.className = "hang-veil";

      const edgeT = document.createElement("span");
      edgeT.className = "hang-edge hang-edge--top";

      const edgeS = document.createElement("span");
      edgeS.className = "hang-edge hang-edge--side";

      sheet.appendChild(img);
      sheet.appendChild(veil);
      sheet.appendChild(edgeT);
      sheet.appendChild(edgeS);
      card.appendChild(sheet);

      scene.appendChild(card);
      cards.push(card);
    }

    // 2. Wire segments: 3 per plate (30 segments total)
    for (let i = 0; i < N; i++) {
      for (let s = 0; s < 3; s++) {
        const wire = document.createElement("div");
        wire.className = "hang-wire";
        wire.setAttribute("aria-hidden", "true");
        scene.appendChild(wire);
        wires.push(wire);
      }
    }

    // 3. Pegs: 1 per plate
    for (let i = 0; i < N; i++) {
      const peg = document.createElement("div");
      peg.className = "hang-peg";
      peg.setAttribute("data-index", i);
      peg.setAttribute("aria-hidden", "true");

      const psh = document.createElement("i");
      psh.className = "hang-psh";
      peg.appendChild(psh);

      const jawBack = document.createElement("div");
      jawBack.className = "hang-jaw hang-jb";
      ["hang-fo", "hang-fl", "hang-fr", "hang-ft"].forEach(cls => {
        const span = document.createElement("i");
        span.className = cls;
        jawBack.appendChild(span);
      });
      peg.appendChild(jawBack);

      const jawFront = document.createElement("div");
      jawFront.className = "hang-jaw hang-jf";
      ["hang-fo", "hang-fl", "hang-fr", "hang-ft"].forEach(cls => {
        const span = document.createElement("i");
        span.className = cls;
        jawFront.appendChild(span);
      });
      peg.appendChild(jawFront);

      const cl = document.createElement("i");
      cl.className = "hang-coil hang-cl";
      const cr = document.createElement("i");
      cr.className = "hang-coil hang-cr";
      peg.appendChild(cl);
      peg.appendChild(cr);

      scene.appendChild(peg);
      pegs.push(peg);
    }
  }

  function attachListeners() {
    // Wheel Listener (passive: false + capture)
    window.addEventListener(
      "wheel",
      e => {
        if (!stage) return;
        const rect = stage.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (inside) {
          e.preventDefault();
          if (openingIndex >= 0) {
            closePlate();
            return;
          }
          posTarget += 0.0028 * e.deltaY * SCROLL_SPEED;
        }
      },
      { passive: false, capture: true }
    );

    // Pointer Events on Scene (Drag & Tap)
    scene.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);

    // Keyboard Events
    window.addEventListener("keydown", e => {
      if (e.target.closest("[data-hang-ui], input, textarea, a, button")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (openingIndex >= 0) {
          const nextIdx = Fe(openingIndex + 1, N);
          posTarget = Math.round(posTarget) + 1;
          openPlate(nextIdx);
        } else {
          posTarget += 1;
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (openingIndex >= 0) {
          const prevIdx = Fe(openingIndex - 1, N);
          posTarget = Math.round(posTarget) - 1;
          openPlate(prevIdx);
        } else {
          posTarget -= 1;
        }
      } else if (e.key === "Escape") {
        if (openingIndex >= 0) {
          e.preventDefault();
          closePlate();
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (openingIndex >= 0) {
          closePlate();
        } else {
          openPlate(getActiveIndex());
        }
      }
    });

    // Resize Observer
    window.addEventListener("resize", () => {
      currentBoxW = 0;
    });

    // IntersectionObserver to stop loop out of viewport
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      });
      obs.observe(stage);
    }
  }

  let pointerDownPlate = null;
  let lastOpenTime = 0;
  let lastCloseTime = 0;
  const DRAG_THRESHOLD = 15;

  function onPointerDown(e) {
    if (e.target.closest("[data-hang-ui], a, button")) return;
    pointerDownPlate = e.target.closest(".hang-card, .hang-peg");
    isDragging = true;
    hasDragged = false;
    hasPointerCapture = false;
    startPointerX = e.clientX;
    startPointerY = e.clientY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    totalDragDist = 0;
    dragVelocity = 0;
    pointerVelocity = 0;
  }

  function onPointerMove(e) {
    normPointerX = (e.clientX / window.innerWidth) * 2 - 1;
    normPointerY = (e.clientY / window.innerHeight) * 2 - 1;

    if (!isDragging) {
      detectHover(e.clientX, e.clientY);
      return;
    }

    const dx = e.clientX - lastPointerX;
    const dy = e.clientY - lastPointerY;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    const moveDist = Math.hypot(e.clientX - startPointerX, e.clientY - startPointerY);
    totalDragDist = Math.max(totalDragDist, moveDist);

    if (totalDragDist > DRAG_THRESHOLD) {
      hasDragged = true;
      if (!hasPointerCapture) {
        try {
          scene.setPointerCapture(e.pointerId);
          hasPointerCapture = true;
        } catch (err) {}
        scene.classList.add("is-dragging");
      }
    }

    if (openingIndex < 0) {
      const isHorizontal = Math.abs(dx) > Math.abs(dy);
      const dragDelta = isHorizontal ? dx * 0.8 : dy;
      const factor = isHorizontal ? 0.0088 : 0.011;
      const deltaTarget = -dragDelta * factor;
      posTarget += deltaTarget;
      pointerVelocity = deltaTarget;
    }
  }

  function onPointerCancel(e) {
    isDragging = false;
    scene.classList.remove("is-dragging");
    if (hasPointerCapture) {
      try {
        scene.releasePointerCapture(e.pointerId);
      } catch (err) {}
      hasPointerCapture = false;
    }
    pointerDownPlate = null;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    scene.classList.remove("is-dragging");
    if (hasPointerCapture) {
      try {
        scene.releasePointerCapture(e.pointerId);
      } catch (err) {}
      hasPointerCapture = false;
    }

    if (hasDragged || totalDragDist > DRAG_THRESHOLD) {
      dragVelocity = Y(pointerVelocity * 22, -14, 14);
    } else {
      // Tap or click:
      if (e.target.closest("[data-hang-ui], a, button")) {
        pointerDownPlate = null;
        return;
      }

      if (openingIndex >= 0) {
        // Spotlight is currently open: clicking anywhere closes it
        closePlate();
        pointerDownPlate = null;
        return;
      }

      // Spotlight is not open: open whichever card was clicked
      let clickedIdx = -1;
      const clickedEl = pointerDownPlate || e.target.closest(".hang-card, .hang-peg");
      if (clickedEl) {
        const rawIdx = clickedEl.getAttribute("data-index");
        if (rawIdx !== null) {
          clickedIdx = parseInt(rawIdx, 10);
        }
      }

      if (clickedIdx < 0 || isNaN(clickedIdx)) {
        // Geometric picking for 3D projected area & proximity
        const stageRect = stage.getBoundingClientRect();
        const px = e.clientX - stageRect.left;
        const py = e.clientY - stageRect.top;
        let maxDepth = -Infinity;
        let closestDist = Infinity;
        let bestDistIdx = -1;

        for (let k = 0; k < N; k++) {
          if (!onStage[k]) continue;
          if (pointInQuad(quads[k], px, py) && cardDepths[k] > maxDepth) {
            maxDepth = cardDepths[k];
            clickedIdx = k;
          }
          const d = distToQuad(quads[k], px, py);
          if (d < 50 && d < closestDist) {
            closestDist = d;
            bestDistIdx = k;
          }
        }
        if (clickedIdx < 0 && bestDistIdx >= 0) {
          clickedIdx = bestDistIdx;
        }
      }

      if (clickedIdx >= 0 && clickedIdx < N) {
        openPlate(clickedIdx);
      }
    }
    pointerDownPlate = null;
  }

  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(px - x1, py - y1);
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lenSq));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return Math.hypot(px - projX, py - projY);
  }

  function distToQuad(quad, px, py) {
    if (pointInQuad(quad, px, py)) return 0;
    let minDist = Infinity;
    for (let i = 0; i < 4; i++) {
      const x1 = quad[2 * i], y1 = quad[2 * i + 1];
      const x2 = quad[((i + 1) % 4) * 2], y2 = quad[((i + 1) % 4) * 2 + 1];
      const d = distToSegment(px, py, x1, y1, x2, y2);
      if (d < minDist) minDist = d;
    }
    return minDist;
  }

  function pointInQuad(quad, px, py) {
    let r = 0;
    for (let i = 0; i < 4; i++) {
      const a_x = quad[2 * i], a_y = quad[2 * i + 1];
      const b_x = quad[((i + 1) % 4) * 2], b_y = quad[((i + 1) % 4) * 2 + 1];
      const l = (b_x - a_x) * (py - a_y) - (b_y - a_y) * (px - a_x);
      if (l === 0) continue;
      const u = l > 0 ? 1 : -1;
      if (r === 0) r = u;
      else if (u !== r) return false;
    }
    return true;
  }

  function detectHover(px, py) {
    if (openingIndex >= 0) {
      hoveredIndex = openingIndex;
      return;
    }
    let closestIndex = -1;
    let maxDepth = -Infinity;

    for (let i = 0; i < N; i++) {
      if (!onStage[i]) continue;
      if (pointInQuad(quads[i], px, py) && cardDepths[i] > maxDepth) {
        maxDepth = cardDepths[i];
        closestIndex = i;
      }
    }
    hoveredIndex = closestIndex;
    scene.style.cursor = hoveredIndex >= 0 ? "pointer" : "grab";
  }

  function getActiveIndex() {
    const raw = Fe(Math.round(posCur), N);
    return Math.floor(raw);
  }

  function openPlate(index) {
    if (index < 0 || index >= N) return;
    const now = performance.now();
    if (now - lastCloseTime < 250) return;
    lastOpenTime = now;
    openingIndex = index;
    if (stage) stage.classList.add("is-open");
    transitionSwap("open", index);
  }

  function closePlate() {
    const now = performance.now();
    if (now - lastOpenTime < 350) return;
    lastCloseTime = now;
    openingIndex = -1;
    if (stage) stage.classList.remove("is-open");
    transitionSwap("idle", -1);
  }

  function transitionSwap(mode, index) {
    if (currentSwapMode === mode && currentSwapIndex === index) return;
    currentSwapMode = mode;
    currentSwapIndex = index;

    if (!swapEl) {
      swapEl = document.getElementById("hang-swap");
    }
    if (!swapEl) return;

    clearTimeout(swapTimeout);
    swapEl.setAttribute("data-out", "true");

    swapTimeout = setTimeout(() => {
      renderSwapContent(mode, index);
      swapEl.setAttribute("data-out", "false");
    }, 130);
  }

  function renderSwapContent(mode, index) {
    if (!swapEl) {
      swapEl = document.getElementById("hang-swap");
    }
    if (!swapEl) return;

    const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";

    if (mode === "open" && index >= 0 && index < N) {
      const data = ORBIT_PLATES[index];
      if (!data) return;

      const title = data.title;
      const sub = [data.place, data.year].filter(Boolean).join(" · ");
      const specs = data.specs || data.tag;
      const desc = isId ? data.descId : data.descEn;
      const closeText = isId ? "Tutup" : "Close";
      const viewText = isId ? (data.btnLabelId || "Lihat Karya") : (data.btnLabelEn || "View Project");

      let actionsHtml = `<button type="button" class="hang-btn-close" id="hang-action-close">${closeText}</button>`;
      if (data.url && data.url.length > 0) {
        actionsHtml += `
          <a class="hang-btn-view" href="${data.url}" target="_blank" rel="noopener noreferrer">
            <span>${viewText}</span>
            <span aria-hidden="true">↗</span>
          </a>
        `;
      }

      swapEl.innerHTML = `
        <h2 class="hang-open-title">${title}</h2>
        ${sub ? `<div class="hang-open-sub">${sub}</div>` : ""}
        ${specs ? `<div class="hang-open-specs">${specs}</div>` : ""}
        <p class="hang-open-desc">${desc || ""}</p>
        <div class="hang-open-actions" data-hang-ui>
          ${actionsHtml}
        </div>
      `;

      const closeBtn = document.getElementById("hang-action-close");
      if (closeBtn) {
        closeBtn.addEventListener("click", e => {
          e.stopPropagation();
          closePlate();
        });
      }
    } else {
      const descText = isId
        ? "Saya adalah seorang Front-End Developer dan UI/UX Designer. Berfokus pada penyederhanaan antarmuka yang kompleks menjadi solusi elegan yang berpusat pada pengguna."
        : "I am a Front-End Developer and UI/UX Designer. Focused on simplifying complex interfaces into elegant, user-centered solutions.";
      const cueText = isId ? "Gulir atau geser untuk menjelajah" : "Scroll or drag to explore";

      swapEl.innerHTML = `
        <p class="hang-desc" id="hang-desc">${descText}</p>
        <div class="hang-cue" id="hang-cue">${cueText}</div>
      `;
    }
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      lastTimestamp = performance.now();
      rafId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (isRunning) {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    }
  }

  function render(timestamp) {
    if (!isRunning) return;
    const rawDt = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    const dt = Math.min(rawDt, DT_CAP);
    const dtSec = dt / 1000;

    clock += 0.006;
    introT += dtSec;

    const isReducedMotion = !!window.__reduceMotion;

    // Inertia momentum decay & gentle magnetic snap
    if (!isDragging && Math.abs(dragVelocity) > 0.001) {
      posTarget += dragVelocity * dtSec;
      dragVelocity *= Math.exp(-dtSec * 4.8);
      if (Math.abs(dragVelocity) <= 0.015) {
        dragVelocity = 0;
        if (openingIndex < 0) {
          posTarget = Math.round(posTarget);
        }
      }
    }

    // Framerate-independent position lerping
    if (isReducedMotion) {
      posCur = posTarget;
    } else {
      const lerpDamp = 1 - Math.exp(-dtSec * 8.2);
      posCur += (posTarget - posCur) * lerpDamp;
    }

    // Rebase posTarget after large drift
    if (Math.abs(posTarget) > 6 * N) {
      const shift = Math.floor(posTarget / N) * N;
      posTarget -= shift;
      posCur -= shift;
    }

    // Camera and perspective setup
    const o = window.innerWidth;
    const s = window.innerHeight;
    const S = Y(1.5 - o / s);
    const w = 1 + 1.3 * S;
    const T = S > 0.5;
    const E = a.size * w;
    const D = a.stepX * w * (1 - 0.45 * S);
    const ee = a.stepY * (1 + 0.1 * S);
    const O = T ? 0.12 * s : 0;

    // Smooth opening states
    let maxOpen = 0;
    let openIdx = -1;
    for (let e = 0; e < N; e++) {
      const isTarget = (openingIndex === e) ? 1 : 0;
      if (isReducedMotion) {
        openStates[e] = isTarget;
      } else {
        const step = dtSec / (isTarget === 1 ? 0.95 : 0.72);
        openStates[e] = isTarget === 1
          ? Math.min(1, openStates[e] + step)
          : Math.max(0, openStates[e] - step);
      }
      if (openStates[e] > maxOpen) {
        maxOpen = openStates[e];
        openIdx = e;
      }
      const hoverTarget = (hoveredIndex === e && openingIndex < 0) ? 1 : 0;
      if (isReducedMotion) {
        hoverStates[e] = hoverTarget;
      } else {
        const hovSpeed = 1 - Math.exp(-dtSec * 10.0);
        hoverStates[e] += (hoverTarget - hoverStates[e]) * hovSpeed;
      }
    }

    const te = openIdx >= 0 ? Fe(openIdx - posCur + 2.6, N) - 2.6 : 0;
    const j = maxOpen > 0 ? Pe(X(maxOpen, 0.05, 0.9)) : 0;
    const introB = isReducedMotion ? 1 : Pe(Y(introT / 1.775));
    const M_fov = a.fov + 5 * j + (1 - introB) * 7;
    const N_persp = (o / 2) / Math.tan((M_fov * Z) / 2) * w;

    const tiltDamp = 1 - Math.exp(-dtSec * 6.5);
    dampedTiltX += (normPointerX - dampedTiltX) * tiltDamp;
    dampedTiltY += (normPointerY - dampedTiltY) * tiltDamp;

    const P = isReducedMotion ? 0 : Math.sin(clock) * a.pushZ * 0.012;
    const ne = isReducedMotion ? 0 : Math.cos(0.9 * clock) * a.pushZ * 0.009;
    const re = a.camY;
    const ie = a.camX - 0.07 * j + dampedTiltX * a.pushX * 0.045 * (1 - j) + P + (1 - introB) * 0.055;
    const F = re + 0.06 * j + dampedTiltY * a.pushY * 0.035 * (1 - j) + ne - (1 - introB) * 0.045;

    scene.style.perspective = `${N_persp.toFixed(2)}px`;
    scene.style.perspectiveOrigin = `${(100 * ie).toFixed(3)}% ${(100 * F).toFixed(3)}%`;
    scene.style.transform = O ? `translate3d(0, ${O.toFixed(1)}px, 0)` : "";

    const ae = 0.34 * N_persp;
    const I_ratio = N_persp / (N_persp - ae);
    const oe = T ? 0.88 : 0.48;
    const R_open = T ? 0.5 : 0.715;
    const se_open = T ? 0.355 - O / s : 0.5;
    const fe = oe / I_ratio;
    const pe = ie * o + (o * R_open - ie * o) / I_ratio;
    const me = F * s + (s * se_open - F * s) / I_ratio;
    const V = o * Math.max(E, fe) * 1.02;

    if (Math.abs(V - currentBoxW) >= 1) {
      currentBoxW = V;
      const curH = V / 1.3;
      for (let e = 0; e < N; e++) {
        const card = cards[e];
        if (card) {
          card.style.width = `${V.toFixed(2)}px`;
          card.style.height = `${curH.toFixed(2)}px`;
          card.style.setProperty("--edgeT", `${(0.0075 * V).toFixed(2)}px`);
          card.style.setProperty("--edgeS", `${(0.014 * V).toFixed(2)}px`);
        }
        const peg = pegs[e];
        if (peg) {
          peg.style.width = `${(Be * V).toFixed(2)}px`;
          peg.style.height = `${(Ve * V).toFixed(2)}px`;
          peg.style.setProperty("--pw", `${(Be * V).toFixed(2)}px`);
          peg.style.setProperty("--ph", `${(Ve * V).toFixed(2)}px`);
        }
      }
    }

    const H_box = currentBoxW;
    const he_box = H_box / 1.3;
    const ge = Math.max(0.06, Math.abs(Math.sin(a.yaw * Z)));

    // Render cards
    for (let e = 0; e < N; e++) {
      const card = cards[e];
      if (!card) continue;
      let r = Fe(e - posCur + 2.6, N) - 2.6;
      const c = openStates[e];
      const isOpeningThis = (e === openIdx);
      let u_push = 0;
      if (maxOpen > 0 && !isOpeningThis) {
        const distToOpen = 0.02 + 0.04 * Math.min(Math.abs(r - te), 4);
        u_push = Math.pow(X(maxOpen, distToOpen, Math.min(0.99, distToOpen + 0.56)), 1.7);
        r += (r - te >= 0 ? 1 : -1) * u_push * 6.4;
      }

      const f_hov = hoverStates[e];
      let p = (0.208 + D * r) * o;
      let g = (1.206 + ee * r) * s;
      let b_depth = (-15 - a.stepZ * r + 26 * f_hov) * w + a.dolly;
      let S_yaw = a.yaw;
      let C_roll = a.roll;
      let T_scale = E;
      let j_opac = 1;
      let M_tint = 1;

      if (!isReducedMotion) {
        const introE = Ne(Y((introT - 0.095 * Y(r + 1.2, 0, N)) / 0.62));
        g += (1 - introE) * 96 * w;
        S_yaw -= (1 - introE) * 26;
        j_opac = Pe(Y(introE / 0.3));
        M_tint = Y((introE - 0.25) / 0.75);
      }

      const P_rest = rest[e];
      P_rest[0] = p;
      P_rest[1] = g;
      P_rest[2] = b_depth;
      P_rest[3] = S_yaw;
      P_rest[4] = C_roll;
      P_rest[5] = E;
      P_rest[6] = j_opac;

      // Sway & breeze physics
      if (!isReducedMotion && dtSec > 0) {
        const t_speed = 30 * (0.84 + 0.32 * ((e * 0.6180339) % 1));
        const r_damp = 1.9;
        const o_time = (clock * 60) / 36;
        szv[e] += (-t_speed * sz[e] - r_damp * szv[e] + a.breeze * 14 * Math.sin(o_time * 0.7 + e * 2.3)) * dtSec;
        sz[e] = Y(sz[e] + szv[e] * dtSec, -14, 14);
        const s_wind = a.breeze * 70 * (Math.sin(o_time * 0.9 + e * 1.7) + 0.55 * Math.sin(o_time * 2.3 + e * 0.9));
        sxv[e] += (-t_speed * (sx[e] - 13 * f_hov) - (r_damp + 3 * f_hov) * sxv[e] + s_wind) * dtSec;
        sx[e] = Y(sx[e] + sxv[e] * dtSec, -10, 18);
      } else {
        sz[e] = 0;
        sx[e] = 0;
      }

      let ne_open = 0;
      if (isOpeningThis && c > 0) {
        const t_ease = c;
        const r_mid = Pe(X(t_ease, 0.1, 0.94));
        const i_late = je(X(t_ease, 0.22, 0.99));
        const a_mid = Math.sin(X(t_ease, 0.66, 1) * Math.PI);
        ne_open = Ne(X(t_ease, 0, 0.4));
        S_yaw = Me(S_yaw, 0, i_late);
        C_roll = Me(C_roll, 0, i_late);
        T_scale = Me(E, fe, r_mid);
        sz[e] *= (1 - i_late);
        sx[e] *= (1 - i_late);
        p = Me(p, pe, r_mid);
        g = Me(g, me, r_mid) - 0.05 * s * Math.sin(r_mid * Math.PI);
        b_depth = Me(b_depth, ae, r_mid) + 38 * a_mid * w;
      }

      const re_rad = S_yaw * Z;
      const I_rad = C_roll * Z;
      const le_w = o * T_scale;
      const ue_h = le_w / 1.3;
      const de_hw = le_w / 2;
      const z_hh = ue_h / 2;

      // Exact Farline Frustum Culling & Screen Corner Projections
      const cosR = Math.cos(I_rad);
      const sinR = Math.sin(I_rad);
      const cosY = Math.cos(re_rad);
      const sinY = Math.sin(re_rad);

      let inFront = true;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let k = 0; k < 4; k++) {
        const cx = (k === 0 || k === 3) ? -de_hw : de_hw;
        const cy = (k === 0 || k === 1) ? -z_hh : z_hh;
        const rotX = cx * cosR - cy * sinR;
        const rotY = cx * sinR + cy * cosR;
        const cz = b_depth - rotX * sinY;
        if (cz > N_persp - 24) { inFront = false; break; }
        const pScale = N_persp / (N_persp - cz);
        const px = ie * o + (p + rotX * cosY - ie * o) * pScale;
        const py = F * s + (g + rotY - F * s) * pScale + O;
        quads[e][2 * k] = px;
        quads[e][2 * k + 1] = py;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }

      cardDepths[e] = b_depth;

      // Card is on stage if corners overlap screen bounds and r >= -0.2
      const isCardOnStage = inFront && maxX > -12 && minX < o + 12 && maxY > -12 && minY < s + 12 + O && r >= -0.2 && r <= 8.5;
      onStage[e] = isCardOnStage;

      card.style.visibility = isCardOnStage ? "visible" : "hidden";
      card.style.zIndex = isOpeningThis ? 200 : Math.round(100 - r * 10);

      const sheet = card.firstElementChild;
      if (!isCardOnStage) {
        if (sheet) sheet.style.opacity = "0";
        continue;
      }

      card.style.transform = `translate3d(${(p - H_box / 2).toFixed(2)}px, ${(g - he_box / 2).toFixed(2)}px, ${b_depth.toFixed(2)}px) rotateY(${S_yaw.toFixed(3)}deg) rotateZ(${C_roll.toFixed(3)}deg) scale(${(le_w / H_box).toFixed(5)})`;
      if (sheet) {
        let ye_opac = Math.round(1000 * j_opac) / 1000;
        if (r < 0.0) ye_opac *= Math.max(0, (r - -0.2) / 0.2);
        if (r > 7.2) ye_opac *= Math.max(0, (8.5 - r) / 1.3);
        sheet.style.opacity = `${ye_opac.toFixed(3)}`;
        sheet.style.transform = `rotateZ(${sz[e].toFixed(2)}deg) rotateX(${sx[e].toFixed(2)}deg)`;
      }

      const be_dark = 0.18 * Y(r / 9) - 0.14 * f_hov + 0.62 * u_push;
      const xe_veil = Y((be_dark + (1 - M_tint) * 0.9) * (1 - ne_open), 0, 1);
      const ce_sin = Math.sin(re_rad);
      const Se_edge = Math.abs(ce_sin) / ge * (1 - 0.75 * Y(be_dark, 0, 1));
      card.style.setProperty("--dark", xe_veil.toFixed(3));
      card.style.setProperty("--edgeA", Y(Se_edge, 0, 1).toFixed(3));
      const J_lift = Math.round(100 * (c > 0 ? X(c, 0.1, 0.6) : 0)) / 100;
      card.style.setProperty("--lift", `${J_lift}`);
    }

    // 3D Continuous Wire and Clamp Peg Rig
    const pegPt = (idx, outPt, rShift = 0) => {
      const i_rest = rest[idx];
      const a_w = o * i_rest[5];
      const s_hw = a_w / 2;
      const c_hh = a_w / 1.3 / 2;
      const l_peg = -1 * s_hw * ze + (rShift * 0.5 * Be * a_w);
      const u_peg = -c_hh;
      const d_cos = Math.cos(i_rest[4] * Z);
      const p_sin = Math.sin(i_rest[4] * Z);
      const m_cos = Math.cos(i_rest[3] * Z);
      const h_sin = Math.sin(i_rest[3] * Z);
      const g_rot = l_peg * d_cos - u_peg * p_sin;
      const u_rot = l_peg * p_sin + u_peg * d_cos;
      const v_off = rShift < 0 ? 0.25 * Be * a_w : 0;
      outPt[0] = i_rest[0] + g_rot * m_cos + v_off * h_sin;
      outPt[1] = i_rest[1] + u_rot;
      outPt[2] = i_rest[2] - g_rot * h_sin + v_off * m_cos;
      return outPt;
    };

    const setWireSeg = (wireEl, p1, p2, opacity) => {
      if (!wireEl) return;
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const dz = p2[2] - p1[2];
      const dist = Math.hypot(dx, dy, dz);
      if (!(dist > 0.5) || p1[2] > N_persp - 30 || p2[2] > N_persp - 30 || opacity <= 0.01) {
        wireEl.style.visibility = "hidden";
        return;
      }
      const elev = Math.asin(Y(dy / dist, -1, 1));
      const azim = Math.atan2(-dz, dx);
      wireEl.style.visibility = "visible";
      wireEl.style.width = `${(dist + 0.6).toFixed(2)}px`;
      wireEl.style.opacity = opacity.toFixed(3);
      wireEl.style.transform = `translate3d(${p1[0].toFixed(2)}px, ${p1[1].toFixed(2)}px, ${p1[2].toFixed(2)}px) rotateY(${(azim / Z).toFixed(3)}deg) rotateZ(${(elev / Z).toFixed(3)}deg)`;
    };

    const sortedIdx = [];
    for (let e = 0; e < N; e++) sortedIdx.push(e);
    const relR = e => Fe(e - posCur + 2.6, N) - 2.6;
    sortedIdx.sort((e, t) => relR(e) - relR(t));

    const ptS = [0, 0, 0];
    const ptC = [0, 0, 0];
    const ptL = [0, 0, 0];
    const ptU = [0, 0, 0];
    const ptP = [0, 0, 0];
    const ptM = [0, 0, 0];
    const h_wireFade = (1 - Pe(X(maxOpen, 0.3, 0.7)));

    for (let d = 0; d < N; d++) {
      const g_idx = sortedIdx[d];
      const r_val = relR(g_idx);
      const isStage = onStage[g_idx] || openingIndex === g_idx;
      const opac_peg = (1 - 0.72 * Y(r_val / 9)) * rest[g_idx][6] * h_wireFade;
      pegPt(g_idx, ptS);

      const b_idx = sortedIdx[d + 1];
      if (b_idx !== undefined && relR(b_idx) - r_val < 1.6 && (isStage || onStage[b_idx])) {
        pegPt(b_idx, ptC);
        pegPt(g_idx, ptP, 1);
        pegPt(b_idx, ptM, -1);
        const sagDist = Math.hypot(ptM[0] - ptP[0], ptM[1] - ptP[1], ptM[2] - ptP[2]) * a.sag * 0.889;
        for (let e = 0; e < 3; e++) {
          ptL[e] = ptP[e] + (ptM[e] - ptP[e]) / 3;
          ptU[e] = ptP[e] + (ptM[e] - ptP[e]) * 2 / 3;
        }
        ptL[1] += sagDist;
        ptU[1] += sagDist;
        const segOpac = Math.min(opac_peg, (1 - 0.72 * Y(relR(b_idx) / 9)) * rest[b_idx][6] * h_wireFade);
        const wBase = g_idx * 3;
        wires[wBase].style.zIndex = Math.round(102 - r_val * 10);
        wires[wBase + 1].style.zIndex = Math.round(102 - r_val * 10);
        wires[wBase + 2].style.zIndex = Math.round(102 - r_val * 10);
        setWireSeg(wires[wBase], ptP, ptL, segOpac);
        setWireSeg(wires[wBase + 1], ptL, ptU, segOpac);
        setWireSeg(wires[wBase + 2], ptU, ptM, segOpac);
      } else {
        for (let e = 0; e < 3; e++) {
          setWireSeg(wires[g_idx * 3 + e], ptS, ptS, 0);
        }
      }

      const pegEl = pegs[g_idx];
      if (pegEl) {
        const isPegVis = isStage && ptS[2] <= N_persp - 30 && opac_peg > 0.01;
        pegEl.style.visibility = isPegVis ? "visible" : "hidden";
        pegEl.style.zIndex = Math.round(105 - r_val * 10);
        if (isPegVis) {
          const pegScale = o * rest[g_idx][5] / H_box;
          const pw_val = Be * H_box;
          const ph_val = Ve * H_box;
          const po_str = opac_peg.toFixed(3);
          pegEl.style.setProperty("--po", po_str);
          pegEl.style.transform = `translate3d(${(ptS[0] - pw_val / 2).toFixed(2)}px, ${(ptS[1] - ph_val * 0.42).toFixed(2)}px, ${ptS[2].toFixed(2)}px) rotateY(${rest[g_idx][3].toFixed(3)}deg) rotateZ(${rest[g_idx][4].toFixed(3)}deg) scale(${pegScale.toFixed(5)})`;
        }
      }
    }

    // Update Counter HUD: "01 — 10"
    const activeIndex = openingIndex >= 0 ? openingIndex : getActiveIndex();
    if (counterEl) {
      const currentFormatted = String(activeIndex + 1).padStart(2, "0");
      const totalFormatted = String(N).padStart(2, "0");
      counterEl.textContent = `${currentFormatted} — ${totalFormatted}`;
    }

    rafId = requestAnimationFrame(render);
  }

  window.openHangPlate = openPlate;
  window.closeHangPlate = closePlate;
  window.updateHUDLanguage = function () {
    renderSwapContent(currentSwapMode, currentSwapIndex);
  };

  document.addEventListener("DOMContentLoaded", init);
})();
