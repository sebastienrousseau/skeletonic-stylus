<!-- markdownlint-disable MD024 MD033 MD036 MD041 -->

All notable changes to **`@sebastienrousseau/skeletonic-stylus`** are
documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this
project adheres to
[Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

---

**[Unreleased]**

**Added**

- **`.gap-*` utilities** on the same golden-ratio scale as the padding and
  margin utilities. Without them there was no way to space the children of a
  `.flex` or grid container except an inline `style` attribute, which any
  consumer shipping `style-src 'self'` silently drops.
- **`scripts/css-validate.mjs`** checks every compiled declaration in a real
  browser and fails the build on anything discarded at parse time or invalidated
  after `var()` substitution. It is what found the two bugs above; 6,739
  declarations now pass.
- **A component reference at `/components/`**, one page per primitive, in the
  shape a CSS library's documentation needs: a category sidebar, and for each
  example prose, the component rendered live, and the exact markup to copy. The
  landing page stays a landing page.
- **`scripts/components-manifest.mjs` and `scripts/generate-component-docs.mjs`**
  generate those pages and check the manifest against
  `src/stylus/components/` in *both* directions — a component with no page
  fails the build, and so does a page for a component that no longer exists.
  Each example's markup is emitted twice, live and as the code sample, from one
  string, so the two cannot drift.

- **Static showcase generation via cargo-ssg**: the showcase is now generated
  from `content/` and `_layouts/` per `ssg.toml` instead of a hand-maintained
  `index.html`, with `scripts/build-ssg.mjs` driving the build.
- **`scripts/fix-ssg-seo.mjs`**: rebuilds `sitemap.xml` deterministically from
  the pages the build actually produced, and drops the placeholder
  `news-sitemap.xml` this site has no use for.
- **`scripts/lint-content.mjs`**: fails the build when a blank line inside a
  raw-HTML block in `content/` would silently ship the markup as escaped text.
- **`mise.toml`**: pins `cargo:ssg` so contributors and CI build with the same
  generator. Both workflows install it via `jdx/mise-action`.
- **Social card**: `images/screenshot.png` with `og:image`, `twitter:image`,
  dimensions, alt text and JSON-LD — the previous `og:image` was a dead link.
- **`.select-field`**: additive wrapper that draws the select chevron on the
  wrapper, so the control sits on a flat, machine-checkable background.

**Fixed**

- **Eight custom properties were referenced but never defined.** `--cl-grey-600`,
  `--cl-grey-700`, `--cl-grey-900`, `--cl-grey-1000`, `--cl-tertiary`,
  `--bg-tertiary`, `--bg-disable` and `--font` had no declaration anywhere, so
  the 21 rules using them were invalid at computed-value time and fell back to
  their initial values. `button:link`, `button:active`, `button:disabled`, every
  `hr` variant and `code.tertiary` had no background or border at all — in every
  project consuming the library, not just this site.
- **`.flex`, `.center`, `.stack` and `[flex]` had no gap.**
  `gap: var(--gr)rem` compiles to `gap: var(--gr) rem`, and `--gr` is the
  unitless number `1.62`, so the value resolved to `1.62 rem` — not a length.
  The declaration was invalid at computed-value time and gap fell back to
  `normal`. The library's primary layout helper has been silently spacing
  nothing.
- **Tooltips anchored to themselves.** `[popover].tooltip` declared both
  `anchor-name` and `position-anchor` with the same ident, so `anchor(bottom)`
  resolved against the tooltip's own box. `.tooltip-trigger` now carries the
  name, matching dropdown and popover.
- **`.command-shortcut` failed 4.5:1 in dark mode**; it moves one step along the
  grey ramp, which raises contrast in both schemes.
- **Site navigation dead-ended on every page but the landing one.** The header
  and footer links were fragment-only (`#overview`), which resolve against the
  current page; once the site had more than one page they pointed at anchors
  that were not there.
- **The library's `.block` utility was styling the syntax highlighter.** The
  highlighter emits TextMate scope names as class names, some containing the
  word `block`, so `display: block` landed on individual code tokens and split
  `<div class="button-group">` across three lines.
- **The accessibility gate only ever audited the landing page.** It now audits
  every generated page in both colour schemes — 74 audits — which is what
  caught a keyboard-inaccessible scrollable region in the first version of the
  code blocks.
- **Per-page SEO artefacts were published for every page**: cargo-ssg writes a
  `sitemap.xml`, `robots.txt`, `rss.xml` and `news-sitemap.xml` into each page's
  directory, which is meaningless at a sub-path. 180 of them were being shipped.
- **Every interactive demo on the showcase was inert.** The page ships a strict
  `script-src 'self'` (cargo-ssg extracts inline `<script>` blocks to hashed
  files under `_csp/`), and that policy refuses to compile inline event-handler
  attributes. All six `onclick=` demos — the modal, the drawer, and all four
  Motion UI cards — did nothing when clicked, silently. They are now wired
  through delegated listeners in the extracted script, and the dialogs close via
  `<form method="dialog">`, so the strict policy is kept rather than relaxed.
- **The Motion UI cards were clickable `<div>`s**, unreachable by keyboard. They
  are `<button>`s now.
- **Demo cards had no vertical rhythm.** The theme's `.card` is a plain block
  written for a heading and a paragraph; the showcase stacks several live
  primitives inside one, so they sat flush against each other.
- **Eleven primitives had no demo at all** despite the "35 Modern UI Primitives"
  heading: popover, dropdown, command, loader, skeleton, empty, aspect-ratio and
  navbar now have live demos in a new *Overlays, States & Layout Primitives*
  section.
- **`scripts/lint-content.mjs` false-positived inside `<script>`.** CommonMark
  raw-text blocks (`<script>`, `<style>`, `<textarea>`) end at their closing tag,
  not at a blank line, so blank lines there are harmless.
- **RSS feed and sitemap entries were skipped entirely.** `content/index.md`
  declared `permalink: /`; cargo-ssg only derives an absolute permalink for a
  page that declares none, so `/` failed URL validation and took the feed's
  `channel.link`, the sitemap `<loc>`, `og:url` and `robots.txt` with it.
- **Clean builds shipped an empty `<urlset>`.** The generator assembles the
  sitemap by walking the output directory during the compile, before any page
  is written to it, so CI always published the empty one.
- **Half the showcase shipped as escaped text**: blank lines inside raw-HTML
  blocks ended the block, re-parsing the markup as indented code.
- **The accessibility audit was measuring an unstyled page** — it loaded `dist`
  over `file://`, where SRI + `crossorigin` make every fingerprinted stylesheet
  fail CORS, masking real violations behind artefacts.
- **`.slider` was 20px tall**, below the WCAG 2.2 target-size minimum; base and
  `.sm` now sit at 24px with the thumb still centred.
- **`.toggle-group-item` did not exist** in the library, leaving those buttons
  unstyled at 1.09:1 in light mode.
- **`dist/` accumulated orphaned fingerprinted assets** on every build and
  shipped them in the published tarball.

**Changed**

- **Accessibility gate**: audits both colour schemes over HTTP rather than one
  scheme over `file://`, detects SRI-rejected stylesheets, and measures contrast
  directly for nodes axe declines to rule on instead of discarding them.
- **`_layouts/`**: re-vendored from the upstream Voxt theme, with the
  project-specific delta isolated in `_layouts/showcase.css` so the theme stays
  re-pullable.

**Removed**

- `scripts/fix-ssg-paths.mjs` and the `dev:copy:index` alias. The path rewrite
  could not deliver `file://` rendering it promised — SRI and CORS block those
  assets whatever the href looks like — and it fought the theme's
  `{{site_path}}` contract.

---

**[2.0.2] — 2026-08-05**

**Added**

- **Expanded Modern Component Suite (35 UI Primitives)**: Implemented 25 new modern accessible components inspired by shadcn/ui:
  - `aspect-ratio`: Responsive aspect-ratio containers (`16/9`, `4/3`, `1/1`, `21/9`, etc.).
  - `avatar`: Rounded/square avatars, fallbacks, presence status indicators, and stacked avatar groups.
  - `breadcrumb`: Semantic accessible breadcrumb navigation with slash and chevron separators.
  - `button-group`: Connected horizontal and vertical button groups with border deduplication.
  - `carousel`: Pure CSS scroll-snap carousel with responsive item columns, navigation, and indicators.
  - `checkbox`: Custom accessible checkbox with SVG checkmark and indeterminate state.
  - `command`: Modern command palette search modal and quick menu primitives.
  - `empty`: Zero-data placeholders and empty state screens.
  - `hover-card`: Interactive preview card triggered on hover or focus-within.
  - `input-otp`: PIN and one-time password segmented entry slots with blinking caret animation.
  - `kbd`: Inline keyboard shortcuts with monospace font stack and tactile borders.
  - `pagination`: Semantic pagination controls, active state, and ellipsis.
  - `popover`: Native HTML5 `[popover]` floating cards with `@starting-style` transitions.
  - `progress`: Native `progress` and `.progress` bars with color variants and indeterminate state.
  - `radio-group`: Custom accessible radio controls with row and column layouts.
  - `scroll-area`: Custom styled lightweight scrollbars with horizontal, vertical, and hidden modes.
  - `select`: Styled native select element with custom dropdown chevron and floating menus.
  - `separator`: Accessible horizontal and vertical dividers with optional label text.
  - `sheet`: Sliding dialog drawers (left, right, top, bottom) with `@starting-style`.
  - `skeleton`: Content loading placeholder blocks with pulse and shimmer wave animations.
  - `slider`: Custom styled native range sliders with track, thumb, focus rings, and value display.
  - `switch`: iOS and shadcn styled toggle switches with smooth sliding thumb animations.
  - `tabs`: Accessible tab lists, active pill triggers, underline variant, and tab panels.
  - `toast`: Non-intrusive notification toasts with title, description, actions, and status borders.
  - `toggle-group`: Single and multi-selection toggle button bars.
- **Motion UI Animations & Modifiers Suite**: Integrated transition and animation system inspired by Foundation Motion UI:
  - **Hinge Transitions**: 10 3D perspective hinge animations (`hingeInFromTop`, `hingeInFromBottom`, `hingeInFromLeft`, `hingeInFromRight`, `hingeInFromMiddleX`, `hingeInFromMiddleY`, `hingeOutToTop`, `hingeOutToBottom`, `hingeOutToLeft`, `hingeOutToRight`).
  - **Rotating Spins**: `spinIn`, `spinOut`, `spinInCCW`, `spinOutCCW` combining rotation with scale and fade.
  - **Wiggle**: Classic rotational rocking animation (`.wiggle`).
  - **Motion Modifiers**: Comprehensive easing classes (`.linear`, `.ease`, `.easeIn`, `.easeOut`, `.easeInOut`, `.bounceIn`, `.bounceOut`, `.bounceInOut`), speed/duration classes (`.fast`, `.slow`, `.duration-100`..`1000`), delay classes (`.delay-100`..`1000`), child stagger sequence (`.stagger`), play states (`.paused`, `.running`, `.is-animating`), and fill modes.
- **Codebase Optimization & Complexity Reduction**:
  - **Selector Deduplication**: Refactored `form.styl` by flattening repetitive `[type=...]` selectors across all 6 color variants and removing nested `@import "toggle"`.
  - **Button Refactoring**: Removed redundant `cursor` and `transition` overrides across brand variants in `button.styl`.
  - **Golden Ratio Scale Loops**: Rewrote `margin.styl` and `padding.styl` using clean dictionary iteration, cutting file lengths by over 50% and removing curly-brace syntax.
  - **Collision Prevention**: Scoped `toggle.styl` to checkbox inputs (`input[type="checkbox"].toggle`, `[role="switch"]`) to eliminate collision with `.toggle` buttons in `toggle-group.styl`.
  - **Modular Card Primitives**: Added standard `.card-header`, `.card-title`, `.card-description`, `.card-content`, and `.card-footer` subcomponents to `card.styl`.
  - **Unified Helpers**: Resolved `.center` collision between flex centering in `core-helpers.styl` and text centering in `helpers.styl` by introducing `.text-center`, `.text-left`, `.text-right`.
  - **Utilities Cleanup**: Enhanced `mixins.styl` with `flex-center()` and `text-truncate()`; removed redundant `.skeleton` duplicate definition from `utilities/animations.styl`.


**Security**

- Bump `postcss` to `8.5.23` to address sourceMappingURL resolution advisory (GHSA-fxqj-rqcc-2cmp).
- Harden dependency override bounds across `brace-expansion`, `fast-uri`, and `js-yaml`.

---

**[2.0.1] — 2026-08-04**

**Changed**

- Consolidate open Dependabot dependency updates and bump GitHub Actions workflows to Node 24 runtime.

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

[2.0.2]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v2.0.2
[2.0.1]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v2.0.1
[2.0.0]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v2.0.0
[1.1.7]: https://github.com/sebastienrousseau/skeletonic-stylus/releases/tag/v1.1.7
