<!-- markdownlint-disable MD033 MD036 MD041 -->

<p align="center">
  <img src="https://cloudcdn.pro/skeletonic/v1/logos/skeletonic.svg"
  alt="Skeletonic Stylus Logo" width="240" />
</p>

<p align="center">
  <strong>The world’s first CSS engine built for the 2026 browser
  standard.</strong>
</p>

<p align="center">
  <a href="https://github.com/sebastienrousseau/skeletonic-stylus/actions">
    <img
      src="https://img.shields.io/github/actions/workflow/status/sebastienrousseau/skeletonic-stylus/npm-publish.yml?branch=main&style=flat-square"
      alt="Build Status"
    />
  </a>
  <a
    href="https://www.npmjs.com/package/@sebastienrousseau/skeletonic-stylus"
  >
    <img
      src="https://img.shields.io/npm/v/@sebastienrousseau/skeletonic-stylus.svg?style=flat-square"
      alt="NPM Version"
    />
  </a>
  <a href="https://docs.skeletonic.com">
    <img
      src="https://img.shields.io/badge/docs-100%25-brightgreen?style=flat-square"
      alt="Documentation Coverage"
    />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img
      src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"
      alt="License"
    />
  </a>
</p>

---

**⚡ High-Performance Core**

Skeletonic Stylus is a modular CSS engine built on 2026 native features. Take
the core on its own for tokens, reset and layout primitives, or add the UI layer
for the full component set — you pay only for the layer you import.

- **Core:** 6.8 kB raw, 2.3 kB gzip, **1.9 kB Brotli**.
- **Core + UI (40 components, 16 styled elements):** 103 kB raw, 17.0 kB gzip,
  **14.7 kB Brotli**.
- **Architecture:** Zero-JS, 100% native CSS APIs.
- **Accessibility:** every page of the reference site is audited with axe-core
  in both colour schemes on each build — currently zero violations.

---

**🛠 Features**

**🌈 2026 Color Engine**

Native `oklch()` and `light-dark()` support. Derives hover and active states
dynamically via **Relative Color Syntax (RCS)**, ensuring zero extra CSS weight
for theming.

**📐 Precision Layouts**

Built-in support for **Native Grid Masonry** (`grid-lanes`) and **Bento Grids**
using Container Queries. No JavaScript layout libraries required.

**🖋 Fluid Typography**

Headings and body text scale smoothly between mobile and desktop via native
`clamp()` functions. No media query hacks, just mathematical precision.

**♿ Accessibility First**

Enforced `:focus-visible` ring management, `65ch` reading limits, and global
`prefers-reduced-motion` overrides at the engine level.

---

**🧩 Components**

40 components and 16 styled HTML elements, every one of them zero-JavaScript:
accordion, alert, alert-dialog, avatar, badge, breadcrumb, card, carousel,
checkbox, collapsible, command, dialog, drawer, dropdown, hover-card, input-otp,
item, menubar, navbar, pagination, popover, progress, radio-group, select,
sheet, sidebar, skeleton, slider, switch, table, tabs, toast, toggle-group,
tooltip and more — plus buttons, inputs, textareas, labels, tables, fieldsets,
toggles, code blocks, dividers, lists, images and clipboard controls.

Overlays use native CSS anchor positioning, disclosure uses `<details>`, and
dialogs use `<dialog>`. Nothing here needs a script tag.

[Browse the component reference →](https://docs.skeletonic.com/components/)

---

**🚀 Quick Start**

**1. Installation**

```bash
pnpm add @sebastienrousseau/skeletonic-stylus
```

**2. Basic Usage**

Import the core foundations in your Stylus file (tokens + reset +
layout primitives only):

```stylus
@import "@sebastienrousseau/skeletonic-stylus/stylus/skeletonic"
```

Or pull in the full UI add-on (buttons, alerts, badges, cards,
forms — built on top of core):

```stylus
@import "@sebastienrousseau/skeletonic-stylus/stylus/skeletonic-ui"
```

---

**📊 Performance Benchmarks**

Measured on the v3.0.0 build, with `gzip -9` and `brotli -q 11`:

| Metric              | Core Engine | UI Add-on   |
| :------------------ | :---------- | :---------- |
| **Size (Minified)** | **6.8 kB**  | 96.5 kB     |
| **Size (Gzip)**     | **2.3 kB**  | 16.2 kB     |
| **Size (Brotli)**   | **1.9 kB**  | 14.0 kB     |
| **Cascade Layers**  | 2 (@layer)  | 4 (@layer)  |

The UI add-on carries 40 components and 16 styled elements. Import only the
components you use if you need it smaller — every stylesheet under
`stylus/components/` stands alone.

---

**📖 Documentation**

For the complete API reference, design tokens, and component library usage, see
the [Full Documentation](https://docs.skeletonic.com).

---

**📄 License**

Skeletonic Stylus is dual-licensed under **MIT** or **Apache-2.0**.

Copyright (c) 2023 - 2026 Skeletonic CSS. All rights reserved.

<p align="center">
  Made with ❤ for the native web.
</p>
