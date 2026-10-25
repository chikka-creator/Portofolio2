/* Gallery Light Table Controller */

(function () {
  let stage = null;
  let table = null;
  let world = null;
  let countEl = null;
  let zoomOutBtn = null;
  let zoomInBtn = null;
  let zoomLabel = null;
  let filterButtons = [];
  let itemElements = [];

  let lightboxEl = null;
  let lightboxImg = null;
  let lightboxTitle = null;
  let lightboxMeta = null;
  let lightboxCloseBtn = null;
  let lastTrigger = null;

  // Pan and Zoom State
  let worldX = 0;
  let worldY = 0;
  let targetWorldX = 0;
  let targetWorldY = 0;
  let velocityX = 0;
  let velocityY = 0;

  let scale = 1.0;
  let targetScale = 1.0;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let totalDist = 0;

  let isRunning = false;
  let rafId = null;
  let currentFilter = "all";

  function init() {
    stage = document.getElementById("gal-stage");
    table = document.getElementById("gal-table");
    world = document.getElementById("gal-world");
    countEl = document.getElementById("gal-count");
    zoomOutBtn = document.getElementById("gal-zoom-out");
    zoomInBtn = document.getElementById("gal-zoom-in");
    zoomLabel = document.getElementById("gal-zoom-label");
    filterButtons = Array.from(document.querySelectorAll(".gal-filter-chip"));

    lightboxEl = document.getElementById("gal-lightbox");
    if (lightboxEl) {
      lightboxImg = lightboxEl.querySelector(".gal-lightbox-img");
      lightboxTitle = lightboxEl.querySelector(".gal-lightbox-title");
      lightboxMeta = lightboxEl.querySelector(".gal-lightbox-meta");
      lightboxCloseBtn = lightboxEl.querySelector(".gal-lightbox-close");
    }

    if (!table || !world || typeof GALLERY_CERTS === "undefined") return;

    renderItems();
    attachListeners();
    startLoop();
  }

  function resolveAsset(path) {
    if (!path) return "";
    return path;
  }

  function renderItems() {
    world.innerHTML = "";
    itemElements = [];

    const W = window.innerWidth;
    const H = window.innerHeight;
    const isMobile = W < 810;
    const centerX = isMobile ? W * 0.5 : W * 0.58;
    const centerY = isMobile ? H * 0.55 : H * 0.5;

    const cols = isMobile ? 3 : 4;
    const spacingX = isMobile ? 190 : 230;
    const spacingY = isMobile ? 150 : 180;

    GALLERY_CERTS.forEach((cert, i) => {
      const item = document.createElement("div");
      item.className = "gal-item";
      item.setAttribute("data-id", cert.id);
      item.setAttribute("data-category", cert.category);
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `${cert.title} — ${cert.issuer}`);

      // Deterministic layout offsets
      const col = i % cols;
      const row = Math.floor(i / cols);
      const seed1 = (i * 47) % 60 - 30;
      const seed2 = (i * 73) % 40 - 20;
      const rot = ((i * 37) % 13 - 6); // ±6deg

      const x = centerX + (col - (cols - 1) / 2) * spacingX + seed1 - 90;
      const y = centerY + (row - 1) * spacingY + seed2 - 69;

      item.style.left = `${x.toFixed(1)}px`;
      item.style.top = `${y.toFixed(1)}px`;
      item.style.transform = `rotate(${rot}deg)`;
      item.style.zIndex = 10 + i;

      const imgSrc = resolveAsset(cert.img);
      item.innerHTML = `
        <img src="${imgSrc}" alt="${cert.title} — ${cert.issuer}" draggable="false" loading="lazy">
        <span class="gal-item-edge-top"></span>
        <span class="gal-item-edge-side"></span>
      `;

      world.appendChild(item);

      itemElements.push({
        el: item,
        data: cert,
        baseX: x,
        baseY: y,
        baseRot: rot
      });
    });

    updateCountDisplay();
  }

  function attachListeners() {
    // Light table drag
    table.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    // Wheel zoom
    table.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = e.deltaY * 0.001;
        targetScale = Math.max(0.9, Math.min(1.6, targetScale - delta));
      },
      { passive: false }
    );

    // Zoom buttons
    if (zoomInBtn) {
      zoomInBtn.addEventListener("click", () => {
        targetScale = Math.min(1.6, targetScale + 0.15);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener("click", () => {
        targetScale = Math.max(0.9, targetScale - 0.15);
      });
    }

    // Filter buttons
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-filter");
        setFilter(cat);
      });
    });

    // Item hover & click
    itemElements.forEach((itemObj) => {
      const el = itemObj.el;

      el.addEventListener("mouseenter", () => {
        if (!isDragging && !el.classList.contains("is-dimmed")) {
          el.classList.add("is-hovered");
          if (!window.__reduceMotion) {
            el.style.transform = `translate3d(0, 0, 12px) rotate(0deg) scale(1.05)`;
          }
        }
      });

      el.addEventListener("mouseleave", () => {
        el.classList.remove("is-hovered");
        el.style.transform = `rotate(${itemObj.baseRot}deg)`;
      });

      el.addEventListener("click", (e) => {
        if (totalDist > 6) return;
        if (!el.classList.contains("is-dimmed")) {
          lastTrigger = el;
          openLightbox(itemObj.data);
        }
      });

      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lastTrigger = el;
          openLightbox(itemObj.data);
        }
      });
    });

    // Lightbox modal events
    if (lightboxEl) {
      if (lightboxCloseBtn) {
        lightboxCloseBtn.addEventListener("click", () => {
          closeLightbox();
        });
      }

      lightboxEl.addEventListener("click", (e) => {
        if (e.target === lightboxEl) {
          closeLightbox();
        }
      });

      lightboxEl.addEventListener("close", () => {
        if (lastTrigger && typeof lastTrigger.focus === "function") {
          lastTrigger.focus();
        }
      });
    }

    // IntersectionObserver to stop loop out of viewport
    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
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

  let pointerDownTarget = null;

  function onPointerDown(e) {
    if (e.target.closest("[data-gal-ui]") || e.target.closest(".gal-filters")) return;
    pointerDownTarget = e.target.closest(".gal-item");
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    lastX = e.clientX;
    lastY = e.clientY;
    totalDist = 0;
    velocityX = 0;
    velocityY = 0;
    table.classList.add("is-dragging");
    try {
      table.setPointerCapture(e.pointerId);
    } catch (err) {}
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    const moveDist = Math.hypot(e.clientX - startX, e.clientY - startY);
    totalDist = Math.max(totalDist, moveDist);

    targetWorldX += dx;
    targetWorldY += dy;
    velocityX = dx;
    velocityY = dy;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    table.classList.remove("is-dragging");
    try {
      table.releasePointerCapture(e.pointerId);
    } catch (err) {}
    pointerDownTarget = null;
  }

  function setFilter(cat) {
    currentFilter = cat;

    filterButtons.forEach((btn) => {
      const bCat = btn.getAttribute("data-filter");
      btn.setAttribute("aria-pressed", bCat === cat ? "true" : "false");
    });

    itemElements.forEach((itemObj) => {
      const match = cat === "all" || itemObj.data.category === cat;
      if (match) {
        itemObj.el.classList.remove("is-dimmed");
      } else {
        itemObj.el.classList.add("is-dimmed");
      }
    });

    updateCountDisplay();
  }

  function updateCountDisplay() {
    const visibleCount = itemElements.filter((item) => !item.el.classList.contains("is-dimmed")).length;
    if (countEl) {
      const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";
      countEl.textContent = isId ? `${visibleCount} bingkai` : `${visibleCount} frames`;
    }
  }

  function openLightbox(cert) {
    if (!lightboxEl) return;
    if (lightboxImg) {
      lightboxImg.src = resolveAsset(cert.img);
      lightboxImg.alt = cert.title;
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = cert.title;
    }
    if (lightboxMeta) {
      lightboxMeta.textContent = `${cert.issuer} · ${cert.year}`;
    }
    lightboxEl.showModal();
  }

  function closeLightbox() {
    if (lightboxEl && lightboxEl.open) {
      lightboxEl.close();
    }
  }

  function startLoop() {
    if (!isRunning) {
      isRunning = true;
      rafId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (isRunning) {
      isRunning = false;
      if (rafId) cancelAnimationFrame(rafId);
    }
  }

  function render() {
    if (!isRunning) return;

    if (window.__reduceMotion) {
      worldX = targetWorldX;
      worldY = targetWorldY;
      scale = targetScale;
      velocityX = 0;
      velocityY = 0;
    } else {
      // Inertia decay
      if (!isDragging) {
        velocityX *= 0.92;
        velocityY *= 0.92;
        if (Math.abs(velocityX) > 0.05) targetWorldX += velocityX;
        if (Math.abs(velocityY) > 0.05) targetWorldY += velocityY;
      }

      // Smooth lerp pan & zoom
      worldX += (targetWorldX - worldX) * 0.12;
      worldY += (targetWorldY - worldY) * 0.12;
      scale += (targetScale - scale) * 0.12;
    }

    world.style.transform = `translate3d(${worldX.toFixed(1)}px, ${worldY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

    if (zoomLabel) {
      zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    }

    rafId = requestAnimationFrame(render);
  }

  // Hook for i18n update
  window.updateHUDLanguage = function (lang) {
    updateCountDisplay();
  };

  document.addEventListener("DOMContentLoaded", init);
})();
