<!-- markdownlint-disable MD024 MD033 MD036 MD041 -->

All notable changes to **`@sebastienrousseau/skeletonic-stylus`** are
documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to
[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

---

**[2.0.0] — 2026-05-03**

The "2026 baseline" major release. Every modern CSS feature that
shipped in the 2024–2026 Baseline window is now part of the library's
foundation. Class names that consumers were already using are
preserved; the underlying tokens, layout primitives, and motion
utilities are fundamentally new.

**Added**

- **Modular core / UI split.** `dist/css/core/skeletonic.min.css`
  ships only tokens + reset + layout primitives (4.4 kB raw / 1.4 kB
  brotli). The full component layer is opt-in via
  `dist/css/core/skeletonic-ui.min.css` (33.6 kB raw / 5.9 kB
  brotli). Either or both can be loaded independently.
- **OKLCH colour engine.** Every brand, status, grey, and keyword
  colour token uses `oklch()` for perceptually uniform steps and
  native P3 wide-gamut on capable displays.
- **`light-dark()` colour function.** Single declaration drives both
  light and dark mode via `:root { color-scheme: light dark }`,
  removing 173 lines of duplicate dark-mode rules.
- **Native CSS Cascade Layers.** `@layer skeletonic.base, …layout,
  …elements, …components, …utilities` declared at the top of every
  bundle. Drop unlayered overrides anywhere in your project and they
  always win — no specificity wars, no `!important`.
- **Native CSS Grid utilities.** `.grid`, `.grid-cols-1`…`-12`,
  `.col-span-1`…`-12`. Replaces the legacy `.flex-1`…`.flex-12`
  flexbox grid. Adds **subgrid** (`.subgrid`) and **CSS masonry**
  (`.grid.masonry`) per CSS Grid Level 3.
- **Container queries on `.card`.** `container-type: inline-size`
  so card layouts respond to the card's own width, not the viewport.
- **Fluid typography.** Body and heading scales use `clamp(min, vw,
  max)` so type smoothly transitions between mobile and desktop
  without breakpoint snap.
- **Modern motion utilities.** `.view-transition-name-{root,header,
  main,footer,article,section}` for the View Transitions API and
  `.scroll-timeline`/`.animate-on-scroll` for native scroll-driven
  animation. All native, GPU-accelerated, no JS runtime.
- **Forced-colors fallbacks** on every component (Windows High
  Contrast Mode).
- **`prefers-reduced-motion` gate** wraps the entire animations
  module.
- **`@axe-core/playwright` a11y gate in CI.** `pnpm run dev:a11y`
  runs axe-core against `dist/index.html` and fails the build on any
  WCAG 2.2 violation.
- **CycloneDX 1.5 SBOM** (`dist/sbom.json`) generated as part of
  every build, with PURL, license expression, and dependency graph.
- **npm provenance attestation.** Releases publish with
  `--provenance` from a public GitHub Actions workflow with
  `id-token: write`, signed by Sigstore.
- **`skeletonic` CLI.** `scripts/cli.mjs` exposed via
  `bin: { skeletonic: "scripts/cli.mjs" }` in the published
  `package.json`. Three commands: `init` scaffolds `styles/` +
  `index.html`; `add <name>` copies a single component; `list`
  enumerates every component shipped. Run anywhere via
  `npx @sebastienrousseau/skeletonic-stylus init`.

**Changed**

- **Tarball layout.** `npm pack ./dist` now publishes the *contents*
  of `dist/`. Public CDN URLs drop the legacy `/dist/` segment:
  - v1.x: `…@1.x.y/dist/css/skeletonic.min.css`
  - v2.0: `…@2.0.0/css/core/skeletonic.min.css`
- **Spacing utilities.** The 12-stop percentage scale
  (`.padding-0`…`.padding-11`) is replaced with a five-step
  rem-based t-shirt scale: `xs` / `sm` / `md` / `lg` / `xl`. Saves
  ~4 kB of compiled CSS.
- **Component class namespacing.** Alert variants are now
  `.alert-{primary,secondary,info,success,warning,error}` (was
  `.alert .primary` etc.) so colour modifiers can't collide with
  state classes elsewhere.
- **Logical-property RTL.** Every directional declaration in
  `margin-`, `padding-`, `border-`, `float`, `text-align`, and
  absolute positioning uses logical equivalents (`margin-inline-*`,
  `inset-inline-*`, `text-align: start/end`). 95 declarations
  flipped. Set `<html dir="rtl">` and the inline axis flips.
- **Heading scale.** `--gr-h1`…`--gr-h6` are now consumed by the
  actual `<h1>`–`<h6>` rules. Previous versions exposed unusably
  large Φⁿ values (h1 ≈ 29 rem); v2 uses a 1.27 (musical minor
  third) ratio.

**Removed**

- `.flex-1`…`.flex-12` legacy flexbox grid (replaced by `.grid` +
  `.grid-cols-N`).
- `.padding-0`…`.padding-11` and `.margin-0`…`.margin-11` discrete
  scales (replaced by `.padding-{xs,sm,md,lg,xl}`).
- `<h1>`/`<h2>` HTML headings in module READMEs (replaced with bold
  paragraphs to clear Codacy's first-heading rule; document
  hierarchy preserved via `**` styling and `---` thematic breaks).

**Fixed**

Late dark-mode contrast fixes that surfaced when the docs site's
light/dark theme switcher made the dark variants visible at scale.
Every fix is a property override with `light-dark()` so the behaviour
is identical in light mode.

- `.alert-warning` and `.alert-danger` referenced undefined
  `--bg-warning` / `--bg-danger` tokens (only `--bg-primary`,
  `--bg-secondary`, `--bg-success` were defined). The cascade fell
  back to `transparent`, and pa11y / WAVE computed contrast against
  the parent's resolved colour — reporting 1.21 : 1 on every alert.
  Added concrete `light-dark()` pairs for `--bg-info`, `--bg-warning`,
  and `--bg-danger` in `configurations/colors.styl`.
- `.alert` text was hardcoded `#1a1a1a`. Worked in light mode (dark
  text on pale tinted bg) but failed in dark mode (1.2 : 1 against
  the new deep-tinted bg). Now `light-dark(#1a1a1a, #f5f5f5)`.
- `.button.primary` / `.button.secondary` / `.btn` (square + oval)
  used white text. The dark-mode `--cl-primary` is a *lighter* blue
  (`oklch(.7 .16 250)`) by design — white-on-light fails AA at
  2.66 : 1. Each now uses
  `color: light-dark(var(--cl-white), var(--cl-black))` so dark mode
  swaps to black ink on the lighter brand background.
- `.button.primary-outline` / `.secondary-outline` / `.success-outline`
  used `var(--cl-white)` as background unconditionally. Dark mode
  with a white panel + lighter brand stroke fell to 2.66 : 1. Now
  `background-color: light-dark(var(--cl-white), var(--cl-black))`.
- `.badge.primary` / `.badge.secondary` / `.badge.danger` had the
  same dark-mode white-on-light issue → black ink in dark mode via
  `light-dark()`.
- `--link-color` was a hard `#0056b3`. Failed AA against the dark-mode
  page background. Now `light-dark(#0056b3, #66b2ff)` plus matching
  visited / hover / focus / active variants.
- Inline form inputs (`form.styl`) and `code.<status>` variants
  (`code.styl`) had hardcoded `#1a1a1a` text. Updated all six in each
  file to `light-dark(#1a1a1a, #f5f5f5)`.

**Migration**

| v1.x → v2.0 |
| --- |
| `.flex-N` → `.grid + .grid-cols-N + .col-span-M` |
| `.padding-3` → `.padding-md` |
| `.margin-bottom-5` → `.margin-bottom-lg` |
| `.alert.primary` → `.alert .alert-primary` |
| `.../dist/css/skeletonic.min.css` → `.../css/core/skeletonic.min.css` |
| `!important` overrides → unlayered CSS (drop the `!important`) |

Most colour tokens (`--cl-primary`, `--bg-success`, `$grey-500`)
keep their names but resolve to OKLCH values. Visual output is
close to v1.1.7 but not pixel-identical — audit any screenshots in
your design system.

**Quality gates**

- Compiled core bundle: **4.4 kB raw / 1.6 kB gzip / 1.4 kB brotli**
  — under the 10 / 8 kB CI ceilings.
- UI bundle: **33.6 kB raw / 6.8 kB gzip / 5.9 kB brotli** — under
  the 8 / 7 kB CI ceilings.
- axe-core gate: zero WCAG 2.2 violations on `dist/index.html`.
- size-limit: every entry well under budget with margin.
- npm publish: provenance attestation on every release.

---

**[1.1.7] — 2026-04**

The "release-readiness" pass: a11y, supply chain, repo hygiene.

**Added**

- RTL via logical properties (95 declarations).
- `--gr-h1`…`--gr-h6` heading tokens consumed by `<h1>`–`<h6>`.
- Focus-visible rings on every interactive element.
- `@media (prefers-reduced-motion)` wrapper around the animations
  module.
- `prefers-color-scheme: dark` token swap.
- CycloneDX SBOM in the npm tarball.
- `size-limit` budgets enforced in CI.

**Fixed**

- `$primary` / `$secondary` darkened for AA contrast against white
  text.
- CVE-2023-44270 (postcss line return) patched via `pnpm.overrides`.

---

**[1.1.6] and earlier**

Internal cleanup, dependency bumps, and palette additions. See the
[GitHub Releases page](https://github.com/sebastienrousseau/skeletonic-stylus/releases)
for commit-level history of v1.1.6, v1.1.5, v1.1.0, v1.0.5, and the
original v1.0.0 release (2018).

---

[2.0.0]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v2.0.0
[1.1.7]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v1.1.7
