/* About Page Parallax & Reveal Controller */

(function () {
  let stage = null;
  let printEl = null;
  let titleEl = null;

  let isIntersecting = false;
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let rafId = null;

  function init() {
    stage = document.getElementById("about-stage");
    printEl = document.getElementById("about-print");
    titleEl = document.getElementById("about-title");

    if (!stage || !printEl) return;

    // IntersectionObserver for print reveal
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              printEl.classList.add("is-revealed");
            }
          });
        },
        { threshold: 0.2 }
      );
      revealObserver.observe(printEl);

      const loopObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            startLoop();
          } else {
            stopLoop();
          }
        });
      });
      loopObserver.observe(stage);
    } else {
      printEl.classList.add("is-revealed");
    }

    // Scroll listener for parallax calculation
    window.addEventListener(
      "scroll",
      () => {
        calculateScroll();
      },
      { passive: true }
    );

    calculateScroll();
  }

  function calculateScroll() {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const scrollRange = rect.height - window.innerHeight;
    if (scrollRange > 0) {
      targetScrollProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
    } else {
      targetScrollProgress = 0;
    }

    if (window.__reduceMotion) {
      currentScrollProgress = targetScrollProgress;
    }
  }

  function startLoop() {
    if (!rafId && !window.__reduceMotion) {
      rafId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function render() {
    if (!isIntersecting) {
      rafId = null;
      return;
    }

    if (!window.__reduceMotion) {
      currentScrollProgress += (targetScrollProgress - currentScrollProgress) * 0.12;

      const printY = (currentScrollProgress * 18).toFixed(1);
      const titleY = (currentScrollProgress * -8).toFixed(1);

      if (titleEl) {
        titleEl.style.transform = `translateY(${titleY}px)`;
      }
    }

    rafId = requestAnimationFrame(render);
  }

  // Hook for i18n
  window.updateHUDLanguage = function (lang) {};

  document.addEventListener("DOMContentLoaded", init);
})();
