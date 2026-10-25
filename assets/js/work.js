/* Work Controller — Dual-View (3D Spiral & Typographic List) */
/* Integrates WorkSpiral, WorkAudio, GSAP, and Project Overlays */

(function () {
  let cards = [];
  let currentView = "spiral";
  let activeProject = null;
  let lastTrigger = null;

  // DOM Elements
  let spiralCanvas = null;
  let hoverTagEl = null;
  let hoverTagImg = null;
  let hoverTagTitle = null;
  let hoverTagTrack = null;

  let viewSwitchCluster = null;
  let btnSpiral = null;
  let btnList = null;
  let pillIndicator = null;

  let listContainer = null;
  let listWrapper = null;
  let previewFollower = null;
  let previewFollowerImg = null;

  let overlayEl = null;
  let overlayImg = null;
  let overlayTitle = null;
  let overlayMeta = null;
  let overlayDesc = null;
  let overlayLink = null;
  let overlayCloseBtn = null;

  // Mouse & Follower Tracking for List View
  let targetMouseX = 0;
  let targetMouseY = 0;
  let followerX = 0;
  let followerY = 0;
  let followerRot = 0;
  let prevFollowerX = 0;
  let isFollowerActive = false;
  let followerAnimId = null;

  // Hover tag position smoothing
  let hoverTagCurX = 0;
  let hoverTagCurY = 0;
  let isHoverTagVisible = false;

  function init() {
    gatherCardsData();
    cacheDOMElements();

    if (!spiralCanvas) return;

    initSpiral();
    initList();
    initOverlay();
    initViewSwitch();
    attachGlobalListeners();
  }

  function gatherCardsData() {
    cards = [];

    // Prioritize WORK_PROJECTS
    if (typeof WORK_PROJECTS !== "undefined" && Array.isArray(WORK_PROJECTS)) {
      WORK_PROJECTS.forEach((proj) => {
        cards.push({
          id: proj.id,
          title: proj.title,
          series: proj.series || "Web",
          place: proj.place || "Surabaya",
          year: proj.year || "2025",
          image: proj.img,
          url: proj.url,
          descId: proj.descId,
          descEn: proj.descEn,
          tint: "#f2efe9"
        });
      });
    }

    // Append ORBIT_PLATES items if available to create a rich 10-12 item catalog
    if (typeof ORBIT_PLATES !== "undefined" && Array.isArray(ORBIT_PLATES)) {
      ORBIT_PLATES.forEach((plate) => {
        // avoid duplicating techinventory or streaming-app-ui if already added
        if (cards.some((c) => c.title === plate.title)) return;
        cards.push({
          id: plate.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: plate.title,
          series: plate.series || plate.tag || "Credential",
          place: plate.place || "Surabaya",
          year: plate.year || "2025",
          image: plate.img,
          url: plate.url,
          descId: plate.descId,
          descEn: plate.descEn,
          tint: "#f2efe9"
        });
      });
    }
  }

  function cacheDOMElements() {
    spiralCanvas = document.getElementById("spiral-canvas");
    hoverTagEl = document.getElementById("spiral-hover-tag");
    if (hoverTagEl) {
      hoverTagImg = hoverTagEl.querySelector(".hover-tag-thumb");
      hoverTagTitle = hoverTagEl.querySelector(".spiral-hover-tag__title");
      hoverTagTrack = hoverTagEl.querySelector(".badge-loop-track");
    }

    viewSwitchCluster = document.querySelector(".view-switch-cluster");
    btnSpiral = document.getElementById("btn-view-spiral");
    btnList = document.getElementById("btn-view-list");
    pillIndicator = document.getElementById("view-pill-indicator");

    listContainer = document.getElementById("list-container");
    listWrapper = document.getElementById("list-centered-wrapper");
    previewFollower = document.getElementById("preview-follower");
    if (previewFollower) {
      previewFollowerImg = previewFollower.querySelector("img");
    }

    overlayEl = document.getElementById("work-overlay");
    if (overlayEl) {
      overlayImg = overlayEl.querySelector(".work-overlay-img");
      overlayTitle = overlayEl.querySelector(".work-overlay-title");
      overlayMeta = overlayEl.querySelector(".work-overlay-meta");
      overlayDesc = overlayEl.querySelector(".work-overlay-desc");
      overlayLink = overlayEl.querySelector(".work-overlay-link");
      overlayCloseBtn = overlayEl.querySelector(".work-overlay-close");
    }
  }

  function initSpiral() {
    if (!window.WorkSpiral || !spiralCanvas) return;

    window.WorkSpiral.init(spiralCanvas, cards, {
      onHover: handleSpiralHover,
      onSelect: handleSpiralSelect
    });
  }

  function handleSpiralHover(card) {
    if (!hoverTagEl) return;

    if (!card) {
      isHoverTagVisible = false;
      hoverTagEl.classList.remove("is-active");
      hoverTagEl.setAttribute("aria-hidden", "true");
      return;
    }

    isHoverTagVisible = true;
    hoverTagEl.classList.add("is-active");
    hoverTagEl.setAttribute("aria-hidden", "false");

    if (hoverTagTitle) hoverTagTitle.textContent = card.title;
    if (hoverTagImg && card.image) {
      hoverTagImg.src = card.image;
      hoverTagImg.alt = card.title;
    }
  }

  function handleSpiralSelect(card) {
    if (!card) return;
    openOverlay(card);
  }

  function initList() {
    if (!listWrapper) return;

    listWrapper.innerHTML = "";
    cards.forEach((proj, idx) => {
      const item = document.createElement("div");
      item.className = "list-project-item";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("data-index", idx);
      item.setAttribute("aria-label", `${proj.title} — ${proj.series}`);

      const numStr = String(idx + 1).padStart(2, "0");
      item.innerHTML = `
        <div class="list-title-mask">
          <span class="list-project-num">${numStr}</span>
          <span class="list-project-title">${proj.title}</span>
          <span class="list-project-series">${proj.series}</span>
        </div>
      `;

      item.addEventListener("mouseenter", (e) => {
        if (window.WorkAudio) window.WorkAudio.playHover();
        showPreviewFollower(proj, e);
      });

      item.addEventListener("mousemove", (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
      });

      item.addEventListener("mouseleave", () => {
        hidePreviewFollower();
      });

      item.addEventListener("click", () => {
        if (window.WorkAudio) window.WorkAudio.playClick();
        lastTrigger = item;
        openOverlay(proj);
      });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (window.WorkAudio) window.WorkAudio.playClick();
          lastTrigger = item;
          openOverlay(proj);
        }
      });

      listWrapper.appendChild(item);
    });
  }

  function showPreviewFollower(proj, e) {
    if (!previewFollower || !previewFollowerImg) return;

    previewFollowerImg.src = proj.image;
    previewFollowerImg.alt = proj.title;

    isFollowerActive = true;
    previewFollower.classList.add("is-visible");
    previewFollower.style.visibility = "visible";
    previewFollower.style.opacity = "1";

    if (e) {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      followerX = targetMouseX;
      followerY = targetMouseY;
      prevFollowerX = targetMouseX;
      previewFollower.style.transform = `translate3d(${followerX.toFixed(1)}px, ${followerY.toFixed(1)}px, 0) translate(-50%, -50%) rotate(0deg) scale(1)`;
    }

    startFollowerLoop();
  }

  function hidePreviewFollower() {
    isFollowerActive = false;
    if (previewFollower) {
      previewFollower.classList.remove("is-visible");
      previewFollower.style.opacity = "0";
      previewFollower.style.visibility = "hidden";
    }
  }

  function startFollowerLoop() {
    if (followerAnimId) return;
    followerAnimId = requestAnimationFrame(updateFollower);
  }

  function updateFollower() {
    followerX += (targetMouseX - followerX) * 0.1;
    followerY += (targetMouseY - followerY) * 0.1;

    const deltaX = followerX - prevFollowerX;
    prevFollowerX = followerX;

    const targetRot = Math.max(-6, Math.min(6, deltaX * 0.35));
    followerRot += (targetRot - followerRot) * 0.1;

    if (previewFollower) {
      const scale = isFollowerActive ? 1 : 0.85;
      previewFollower.style.transform = `translate3d(${followerX.toFixed(1)}px, ${followerY.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${followerRot.toFixed(2)}deg) scale(${scale})`;
    }

    if (isFollowerActive || Math.abs(targetMouseX - followerX) > 0.5) {
      followerAnimId = requestAnimationFrame(updateFollower);
    } else {
      followerAnimId = null;
    }
  }

  function initViewSwitch() {
    if (btnSpiral) {
      btnSpiral.addEventListener("click", () => switchView("spiral"));
      btnSpiral.addEventListener("mouseenter", () => {
        if (window.WorkAudio) window.WorkAudio.playHover();
      });
    }

    if (btnList) {
      btnList.addEventListener("click", () => switchView("list"));
      btnList.addEventListener("mouseenter", () => {
        if (window.WorkAudio) window.WorkAudio.playHover();
      });
    }
  }

  function switchView(viewMode) {
    if (currentView === viewMode) return;
    currentView = viewMode;

    if (window.WorkAudio) {
      window.WorkAudio.playToggle(viewMode === "list");
    }

    // Update Pill Buttons
    if (btnSpiral) {
      btnSpiral.classList.toggle("is-active", viewMode === "spiral");
      btnSpiral.setAttribute("aria-selected", viewMode === "spiral" ? "true" : "false");
    }
    if (btnList) {
      btnList.classList.toggle("is-active", viewMode === "list");
      btnList.setAttribute("aria-selected", viewMode === "list" ? "true" : "false");
    }

    if (pillIndicator) {
      pillIndicator.classList.remove("is-spiral", "is-list");
      pillIndicator.classList.add(`is-${viewMode}`);
    }

    if (viewMode === "list") {
      // Deactivate 3D Spiral
      if (window.WorkSpiral) window.WorkSpiral.setActive(false);
      handleSpiralHover(null);

      // Show and animate typographic list
      if (listContainer) {
        listContainer.style.display = "flex";
        listContainer.style.pointerEvents = "auto";
        listContainer.setAttribute("aria-hidden", "false");
      }

      targetMouseX = window.innerWidth / 2;
      targetMouseY = window.innerHeight * 0.45;
      followerX = targetMouseX;
      followerY = targetMouseY;
      prevFollowerX = targetMouseX;

      if (typeof gsap !== "undefined" && listWrapper) {
        const titles = listWrapper.querySelectorAll(".list-title-mask");
        gsap.killTweensOf(titles);
        gsap.set(titles, { yPercent: -120, opacity: 0 });
        gsap.to(titles, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.04,
          ease: "power3.out"
        });
      }
    } else {
      // Hide list view
      hidePreviewFollower();

      if (typeof gsap !== "undefined" && listWrapper) {
        const titles = listWrapper.querySelectorAll(".list-title-mask");
        gsap.killTweensOf(titles);
        gsap.to(titles, {
          yPercent: 110,
          opacity: 0,
          duration: 0.22,
          stagger: 0.015,
          ease: "power2.in",
          onComplete: () => {
            if (listContainer) {
              listContainer.style.display = "none";
              listContainer.style.pointerEvents = "none";
              listContainer.setAttribute("aria-hidden", "true");
            }
          }
        });
      } else if (listContainer) {
        listContainer.style.display = "none";
        listContainer.style.pointerEvents = "none";
        listContainer.setAttribute("aria-hidden", "true");
      }

      // Activate 3D Spiral
      if (window.WorkSpiral) window.WorkSpiral.setActive(true);
    }
  }

  function attachGlobalListeners() {
    window.addEventListener(
      "mousemove",
      (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;

        // Position hover tag near cursor smoothly
        if (hoverTagEl && isHoverTagVisible) {
          const offsetX = 24;
          const offsetY = -24;
          hoverTagCurX += (e.clientX + offsetX - hoverTagCurX) * 0.15;
          hoverTagCurY += (e.clientY + offsetY - hoverTagCurY) * 0.15;

          const clampX = Math.max(16, Math.min(hoverTagCurX, window.innerWidth - 300));
          const clampY = Math.max(16, Math.min(hoverTagCurY, window.innerHeight - 80));

          hoverTagEl.style.transform = `translate3d(${clampX.toFixed(1)}px, ${clampY.toFixed(1)}px, 0)`;
        }
      },
      { passive: true }
    );
  }

  function initOverlay() {
    if (!overlayEl) return;

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
      if (window.WorkSpiral) window.WorkSpiral.resetZoom();
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    });
  }

  function openOverlay(proj) {
    if (!proj || !overlayEl) return;

    activeProject = proj;
    handleSpiralHover(null);
    hidePreviewFollower();

    const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";

    if (overlayImg) {
      overlayImg.src = proj.image;
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
    if (window.WorkSpiral) window.WorkSpiral.resetZoom();
  }

  // Listen for language toggles if i18n triggers
  document.addEventListener("langchange", () => {
    if (activeProject && overlayEl && overlayEl.open) {
      const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";
      if (overlayDesc) overlayDesc.textContent = isId ? activeProject.descId : activeProject.descEn;
      if (overlayLink) {
        overlayLink.textContent = isId ? "Buka Proyek →" : "Open Project →";
      }
    }
  });

  document.addEventListener("DOMContentLoaded", init);
})();
