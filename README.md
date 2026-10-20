# Portofolio

Personal portfolio — static site (`index.html` + assets) of **Fakhri Cahyo Diandra Nandito** (Front-End & UI/UX Developer).

## Design & Architecture

- **Theme**: Dark Studio (`#07080f` global, `#0a0d14` 3D stage) with amber/cyan accents and monospace technical indicators (Anti-AI-Slop).
- **Sections**:
  - `#about`: Hero with dark workspace overlay, monospace badge, and bracket CTA.
  - `#experience`: 3D scroll parade with floating interactive skill cards.
  - `#work`: 3D WebGL orbit showcase powered by Three.js.
  - `#contact`: Studio dark footer with editorial headline, email CTA, and direct social links (GitHub, Instagram, Email).
- **Contracts**:
  - `design.md`: Design system tokens, easing grammar, 3D orbit rules, and verification checklist.
  - `PLAN.md` & `PLAN-experience.md`: Implementation blueprints.

## Stack

- Single-file web application: `index.html`
- Styling: Tailwind CSS (via CDN)
- 3D Graphics: Three.js `0.186.1`
- Typography: Inter (Google Fonts)

## Run

Open `index.html` in a modern browser, or run a local static server:

```bash
python -m http.server 8000
```
