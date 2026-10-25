/* Work Index & Hover Preview Controller */

(function () {
  let tableBody = null;
  let previewEl = null;
  let previewImg = null;
  let overlayEl = null;
  let overlayImg = null;
  let overlayTitle = null;
  let overlayMeta = null;
  let overlayDesc = null;
  let overlayLink = null;
  let overlayCloseBtn = null;

  let activeRow = null;
  let lastTrigger = null;

  let mouseX = 0;
  let mouseY = 0;
  let previewCurX = 0;
  let previewCurY = 0;
  let isHovering = false;
  let isAnimating = false;

  function init() {
    tableBody = document.querySelector(".work-table tbody");
    previewEl = document.getElementById("work-preview");
    previewImg = previewEl ? previewEl.querySelector("img") : null;

    overlayEl = document.getElementById("work-overlay");
    if (overlayEl) {
      overlayImg = overlayEl.querySelector(".work-overlay-img");
      overlayTitle = overlayEl.querySelector(".work-overlay-title");
      overlayMeta = overlayEl.querySelector(".work-overlay-meta");
      overlayDesc = overlayEl.querySelector(".work-overlay-desc");
      overlayLink = overlayEl.querySelector(".work-overlay-link");
      overlayCloseBtn = overlayEl.querySelector(".work-overlay-close");
    }

    if (!tableBody || typeof WORK_PROJECTS === "undefined") return;

    renderRows();
    attachListeners();
  }

  function renderRows() {
    tableBody.innerHTML = "";
    WORK_PROJECTS.forEach((proj, index) => {
      const row = document.createElement("tr");
      row.setAttribute("data-index", index);
      row.setAttribute("tabindex", "0");
      row.setAttribute("role", "button");
      row.setAttribute("aria-label", `${proj.title} — ${proj.series}`);

      const numStr = String(index + 1).padStart(2, "0");
      row.innerHTML = `
        <td>${numStr}</td>
        <td>${proj.title}</td>
        <td>${proj.series}</td>
        <td>${proj.place}</td>
        <td>${proj.year}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  function attachListeners() {
    // Mouse move on window for preview positioning
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (isHovering && !isAnimating) {
          isAnimating = true;
          requestAnimationFrame(updatePreviewPosition);
        }
      },
      { passive: true }
    );

    // Table rows hover and click
    tableBody.addEventListener("mouseenter", () => {}, true);

    const rows = tableBody.querySelectorAll("tr");
    rows.forEach((row) => {
      row.addEventListener("mouseenter", (e) => {
        const idx = parseInt(row.getAttribute("data-index"), 10);
        showPreview(idx);
      });

      row.addEventListener("mouseleave", () => {
        hidePreview();
      });

      row.addEventListener("click", () => {
        const idx = parseInt(row.getAttribute("data-index"), 10);
        lastTrigger = row;
        openOverlay(idx);
      });

      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const idx = parseInt(row.getAttribute("data-index"), 10);
          lastTrigger = row;
          openOverlay(idx);
        }
      });
    });

    // Dialog listeners
    if (overlayEl) {
      if (overlayCloseBtn) {
        overlayCloseBtn.addEventListener("click", () => {
          closeOverlay();
        });
      }

      overlayEl.addEventListener("click", (e) => {
        if (e.target === overlayEl) {
          closeOverlay();
        }
      });

      overlayEl.addEventListener("close", () => {
        if (lastTrigger && typeof lastTrigger.focus === "function") {
          lastTrigger.focus();
        }
      });
    }
  }

  function resolveAsset(path) {
    if (!path) return "";
    return path;
  }

  function showPreview(index) {
    const proj = WORK_PROJECTS[index];
    if (!proj || !previewEl || !previewImg) return;

    previewImg.src = resolveAsset(proj.img);
    previewImg.alt = proj.title;

    isHovering = true;
    previewEl.classList.add("is-active");

    const targetX = mouseX + 24;
    const targetY = mouseY - 120;
    previewCurX = targetX;
    previewCurY = targetY;

    if (!isAnimating) {
      isAnimating = true;
      requestAnimationFrame(updatePreviewPosition);
    }
  }

  function hidePreview() {
    isHovering = false;
    if (previewEl) {
      previewEl.classList.remove("is-active");
    }
  }

  function updatePreviewPosition() {
    if (!previewEl) {
      isAnimating = false;
      return;
    }

    const targetX = mouseX + 24;
    const targetY = mouseY - 120;

    if (window.__reduceMotion) {
      previewCurX = targetX;
      previewCurY = targetY;
    } else {
      previewCurX += (targetX - previewCurX) * 0.12;
      previewCurY += (targetY - previewCurY) * 0.12;
    }

    const clampX = Math.max(10, Math.min(previewCurX, window.innerWidth - 330));
    const clampY = Math.max(10, Math.min(previewCurY, window.innerHeight - 256));

    previewEl.style.transform = `translate3d(${clampX.toFixed(1)}px, ${clampY.toFixed(1)}px, 0)`;

    if (isHovering) {
      requestAnimationFrame(updatePreviewPosition);
    } else {
      isAnimating = false;
    }
  }

  function openOverlay(index) {
    const proj = WORK_PROJECTS[index];
    if (!proj || !overlayEl) return;

    hidePreview();

    const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";

    if (overlayImg) {
      overlayImg.src = resolveAsset(proj.img);
      overlayImg.alt = proj.title;
    }
    if (overlayTitle) {
      overlayTitle.textContent = proj.title;
    }
    if (overlayMeta) {
      overlayMeta.textContent = `${proj.series} · ${proj.place} · ${proj.year}`;
    }
    if (overlayDesc) {
      overlayDesc.textContent = isId ? proj.descId : proj.descEn;
    }
    if (overlayLink) {
      if (proj.url && proj.url !== "(self)") {
        overlayLink.href = proj.url;
        overlayLink.target = "_blank";
        overlayLink.rel = "noopener noreferrer";
        overlayLink.style.display = "inline-flex";
        overlayLink.textContent = isId ? "Buka Proyek →" : "Open Project →";
      } else {
        overlayLink.href = "index.html";
        overlayLink.target = "_self";
        overlayLink.style.display = "inline-flex";
        overlayLink.textContent = isId ? "Lihat di Beranda →" : "View on Home →";
      }
    }

    overlayEl.showModal();
  }

  function closeOverlay() {
    if (overlayEl && overlayEl.open) {
      overlayEl.close();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
