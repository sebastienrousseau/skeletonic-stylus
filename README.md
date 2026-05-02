# Skeletonic Stylus

<!-- markdownlint-disable MD033 MD041 -->

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
  <a href="https://docs.skeletonic.io">
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

## ⚡ High-Performance Core

Skeletonic Stylus is a hyper-optimized, modular CSS engine designed for the
high-performance era. It leverages 2026 native features to deliver a complete UI
foundation in under 5kb.

- **Size:** **4.40 kB** Core Bundle (Raw) / **1.4 kB** (Brotli).
- **Architecture:** Zero-JS, 100% Native CSS APIs.
- **Accessibility:** 100% WCAG 2.2 AA coverage guaranteed.

---

## 🛠 Features

### 🌈 2026 Color Engine

Native `oklch()` and `light-dark()` support. Derives hover and active states
dynamically via **Relative Color Syntax (RCS)**, ensuring zero extra CSS weight
for theming.

### 📐 Precision Layouts

Built-in support for **Native Grid Masonry** (`grid-lanes`) and **Bento Grids**
using Container Queries. No JavaScript layout libraries required.

### 🖋 Fluid Typography

Headings and body text scale smoothly between mobile and desktop via native
`clamp()` functions. No media query hacks, just mathematical precision.

### ♿ Accessibility First

Enforced `:focus-visible` ring management, `65ch` reading limits, and global
`prefers-reduced-motion` overrides at the engine level.

---

## 🚀 Quick Start

### 1. Installation

```bash
pnpm add @sebastienrousseau/skeletonic-stylus
```

### 2. Basic Usage

Import the core foundations in your Stylus file:

```stylus
@import "@sebastienrousseau/skeletonic-stylus/core"
```

---

## 📊 Performance Benchmarks

| Metric              | Core Engine | UI Addon    |
| :------------------ | :---------- | :---------- |
| **Size (Minified)** | **4.4 kB**  | 35.2 kB     |
| **Size (Brotli)**   | **1.4 kB**  | 8.2 kB      |
| **Cascade Layers**  | 2 (@layer)  | 4 (@layer)  |
| **Lighthouse A11y** | **100/100** | **100/100** |

---

## 📖 Documentation

For the complete API reference, design tokens, and component library usage, see
the [Full Documentation](https://docs.skeletonic.io).

---

## 📄 License

Skeletonic Stylus is dual-licensed under **MIT** or **Apache-2.0**.

Copyright (c) 2023 - 2026 Skeletonic CSS. All rights reserved.

<p align="center">
  Made with ❤ for the native web.
</p>
