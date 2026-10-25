/* Contact Form & Parallax Controller */

(function () {
  let form = null;
  let nameInput = null;
  let emailInput = null;
  let messageInput = null;
  let errorEl = null;
  let chipButtons = [];
  let selectedProject = "Front-End";

  let portraitEl = null;
  let titleEl = null;
  let stage = null;
  let rafId = null;
  let targetProgress = 0;
  let curProgress = 0;

  function init() {
    stage = document.getElementById("contact-stage");
    form = document.getElementById("contact-form");
    portraitEl = document.getElementById("contact-portrait");
    titleEl = document.getElementById("contact-title");

    if (form) {
      nameInput = form.querySelector('input[name="name"]');
      emailInput = form.querySelector('input[name="email"]');
      messageInput = form.querySelector('textarea[name="message"]');
      errorEl = document.getElementById("contact-form-error");
      chipButtons = Array.from(form.querySelectorAll(".contact-chip"));

      initChips();
      initFormSubmit();
    }

    if (stage && !window.__reduceMotion) {
      window.addEventListener("scroll", onScroll, { passive: true });
      startLoop();
    }
  }

  function initChips() {
    chipButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        chipButtons.forEach((b) => b.setAttribute("aria-checked", "false"));
        btn.setAttribute("aria-checked", "true");
        selectedProject = btn.getAttribute("data-value") || btn.textContent.trim();
      });
    });
  }

  function initFormSubmit() {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (errorEl) {
        errorEl.textContent = "";
      }

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const emailVal = emailInput ? emailInput.value.trim() : "";
      const messageVal = messageInput ? messageInput.value.trim() : "";

      const isId = (typeof currentLang !== "undefined" ? currentLang : "id") === "id";

      if (!nameVal || !emailVal || !messageVal) {
        if (errorEl) {
          errorEl.textContent = isId ? "Mohon lengkapi semua kolom." : "Please fill in all fields.";
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        if (errorEl) {
          errorEl.textContent = isId ? "Format email tidak valid." : "Invalid email address.";
        }
        return;
      }

      const subject = encodeURIComponent(`New Project Enquiry: ${selectedProject} — ${nameVal}`);
      const body = encodeURIComponent(
        `Name: ${nameVal}\nEmail: ${emailVal}\nProject: ${selectedProject}\n\nMessage:\n${messageVal}`
      );

      const mailtoUrl = `mailto:ditofakhri3@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
    });
  }

  function onScroll() {
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const scrollRange = rect.height - window.innerHeight;
    if (scrollRange > 0) {
      targetProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
    } else {
      targetProgress = 0;
    }
  }

  function startLoop() {
    if (!rafId && !window.__reduceMotion) {
      rafId = requestAnimationFrame(render);
    }
  }

  function render() {
    if (window.__reduceMotion) return;

    curProgress += (targetProgress - curProgress) * 0.12;
    const titleY = (curProgress * -8).toFixed(1);

    if (titleEl) {
      titleEl.style.transform = `translateY(${titleY}px)`;
    }

    rafId = requestAnimationFrame(render);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
