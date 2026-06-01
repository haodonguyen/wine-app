# De vin Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished bottle-first React + Vite wine formula website with curated local recipe data, cinematic black-red visuals, and responsive interactive recipe browsing.

**Architecture:** The app is a client-only SPA. Local data lives in `src/data/wines.js`; `src/App.jsx` owns selection/filter/modal state; CSS in `src/styles.css` defines the cinematic visual system and responsive behavior.

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS, generated PNG asset.

---

### Task 1: Project Shell And Data Contract

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `src/data/wines.test.js`

- [x] Add package scripts for Vite, Vitest, build, and preview.
- [x] Add a failing data test that requires six starter wines, three or more formulas per wine, and complete recipe fields.

### Task 2: Curated Wine Data

**Files:**
- Create: `src/data/wines.js`

- [x] Add six wine categories: Pinot Noir, Merlot, Cabernet Sauvignon, Chardonnay, Sauvignon Blanc, and Riesling.
- [x] Add beginner-friendly formulas with ingredients, steps, taste notes, difficulty, and glassware.
- [x] Run data tests and verify they pass.

### Task 3: Interactive React Experience

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/styles.css`

- [x] Build header, filters, bottle cards, recipe grid, modal, and footer.
- [x] Support selection, color filters, modal open/close, Escape key close, and empty-state fallback.
- [x] Use generated hero visual from `src/assets/de-vin-cinematic-hero.png`.

### Task 4: Verification

**Files:**
- Modify as needed based on verification.

- [x] Run tests.
- [x] Build production bundle.
- [x] Start dev server.
- [x] Verify desktop and mobile render in browser.
