/* Chrome Shell Controller: Nav, Language, Reduced Motion, Reveals */

(function () {
  // Global reduced motion flag
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  window.__reduceMotion = motionQuery.matches;
  motionQuery.addEventListener("change", (e) => {
    window.__reduceMotion = e.matches;
  });

  // DOM Content Loaded Handler
  document.addEventListener("DOMContentLoaded", () => {
    // 1. Language Toggle Setup
    const langButtons = document.querySelectorAll(".chrome-lang button");
    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetLang = btn.getAttribute("data-lang");
        if (typeof applyLanguage === "function") {
          applyLanguage(targetLang);
        }
      });
    });

    // Apply language on load
    if (typeof applyLanguage === "function") {
      applyLanguage(typeof currentLang !== "undefined" ? currentLang : "id");
    }

    // 2. Active Nav Link Detection
    const pathname = window.location.pathname;
    const page = pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".chrome-nav a");
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const linkPage = href ? href.split("/").pop() : "";
      if (
        linkPage === page ||
        (linkPage === "index.html" && (page === "" || page === "index.html"))
      ) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    // 3. Scroll Reveal Observer
    const reveals = document.querySelectorAll(".reveal");
    if (reveals.length > 0) {
      if (window.__reduceMotion || !("IntersectionObserver" in window)) {
        reveals.forEach((el) => el.classList.add("active"));
      } else {
        const observer = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("active");
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        reveals.forEach((el) => observer.observe(el));
      }
    }
  });
})();
