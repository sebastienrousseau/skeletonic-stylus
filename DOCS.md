<!-- markdownlint-disable MD033 MD041 -->

Welcome to the definitive guide for **Skeletonic Stylus**, the high-performance,
native-first CSS engine for the 2026 web.

---

## 1. Core Architecture

Skeletonic is built on **CSS Cascade Layers** (`@layer`) to ensure predictable
specificity and a modular architecture. Canonical documentation can be found at
[docs.skeletonic.io](https://docs.skeletonic.io).

### CSS Layers

- `skeletonic.base`: Normalization, Fluid Typography, and Global Focus
  Management.
- `skeletonic.layout`: Grid System, Bento Containers, and Media Queries.
- `skeletonic.elements`: Semantic HTML element styling (Buttons, Forms, Tables).
- `skeletonic.components`: Complex UI patterns (Cards, Modals, Navbars).

---

## 2. Design Tokens (Configurations)

### 2.1 Color Engine

Skeletonic uses `oklch()` for perceptually uniform colors and `light-dark()` for
zero-rule mode switching.

| Token          | Utility Class   | Description                            |
| :------------- | :-------------- | :------------------------------------- |
| `--cl-primary` | `.text-primary` | The primary brand color.               |
| `--bg-primary` | `.bg-primary`   | Derived background tint using **RCS**. |
| `--cl-surface` | `.bg-surface`   | Adaptive surface color.                |

### 2.2 Fluid Typography

Uses `clamp()` for smooth scaling without breakpoints.

- `H1`: 2.5rem to 4.5rem.
- `Body`: 17px to 20px base.

---

## 3. Layout System

### 3.1 Native Masonry Grid

Skeletonic implements the 2026 standard for masonry layouts using
`display: grid-lanes` with a fallback to `grid-template-rows: masonry`.

```html
<div class="grid masonry grid-cols-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2 (Tall)</div>
  <div class="card">Item 3</div>
</div>
```

### 3.2 Bento Grid

Asymmetric layouts using Container Queries for modular, parent-aware
responsiveness.

```html
<div class="bento-container">
  <div class="card flex-1">Feature Box</div>
  <div class="card">Regular Box</div>
</div>
```

---

## 4. Components & Elements

### 4.1 Modal Suite

Using the native HTML5 `<dialog>` element with `@starting-style` for smooth
entry animations.

```html
<button onclick="myModal.showModal()">Open</button>
<dialog id="myModal" class="modal">
  <div class="modal-header"><h3>Title</h3></div>
  <p>Content goes here.</p>
  <div class="modal-footer"><button>Close</button></div>
</dialog>
```

### 4.2 Auto-Sizing Forms

Inputs and textareas leverage `field-sizing: content` to automatically grow with
user input.

```html
<textarea class="w-full" placeholder="This grows as you type..."></textarea>
```

### 4.3 Skeleton Loaders

High-performance animated shimmers.

- `.skeleton.text`: Shimmering text line.
- `.skeleton.circle`: Shimmering avatar/icon.

---

## 5. Accessibility Best Practices

Skeletonic Stylus is **100% WCAG 2.2 AA compliant** by default.

- **Enforced Focus:** Every interactive element has a `:focus-visible` ring.
- **Reading Length:** Paragraphs are limited to `65ch` for readability.
- **Reduced Motion:** Global `@media (prefers-reduced-motion)` support.

---

## 6. Optimization

### Core Bundle: 4.40 kB

The core engine is optimized for **Brotli** and **Gzip** compression, ensuring a
near-zero impact on your Largest Contentful Paint (LCP).

---

## 7. Engineering Standards & Provenance

Skeletonic Stylus follows strict commit signing and provenance standards. All
official releases are signed with verified SSH/GPG keys.

### Contribution Signature

We recommend using a consistent signature for commit hygiene:

```text
THE ARCHITECT ᛫ Sebastien Rousseau ᛫ <https://sebastienrousseau.com>
THE ENGINE ᛞ EUXIS ᛫ Enterprise Intelligence ᛫ <https://euxis.co>
```

---

Copyright (c) 2023 - 2026 Skeletonic CSS. All rights reserved.
