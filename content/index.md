---
layout: index
title: Skeletonic Stylus — 2026 Modern CSS Engine & Design System
description: "A lightweight, accessible, zero-JS Stylus component suite built for 2026. 40 modern primitives, Motion UI transitions, and OKLCH color engine."
eyebrow: "Modern CSS Engine & Primitives"
author: "Sebastien Rousseau"
name: Skeletonic
headline: The Modern CSS Engine for High-Velocity Web Apps
lead: "Hyper-optimized, accessible Stylus component suite built for 2026. Featuring 40 modern primitives inspired by shadcn/ui, Foundation Motion UI transitions, fluid typography, and OKLCH color engine with zero runtime JavaScript."
language: en-GB
atom_link: https://docs.skeletonic.com/rss.xml
item_title: Skeletonic Stylus — 2026 Modern CSS Engine & Design System
item_description: "A lightweight, accessible, zero-JS Stylus component suite built for 2026. 40 modern primitives, Motion UI transitions, and OKLCH color engine."
item_link: https://docs.skeletonic.com/
item_guid: https://docs.skeletonic.com/
item_pub_date: "Mon, 14 Sep 2026 00:00:00 +0000"
pub_date: "Mon, 14 Sep 2026 00:00:00 +0000"
last_build_date: "Mon, 14 Sep 2026 00:00:00 +0000"
generator: cargo-ssg
category: CSS Framework
date: 2026-09-14
news_publication_date: 2026-09-14
label_theme: "Theme"
label_theme_system: "System"
label_theme_light: "Light"
label_theme_dark: "Dark"
---

<section id="overview" class="section">
  <div class="container text-center">
    <h2 class="section-title">Architected for Modern Web Applications</h2>
    <p class="section-desc">Engineered with CSS Cascade Layers, OKLCH color spaces, and 0ms JavaScript runtime overhead.</p>
    <div class="grid-2x2" id="features">
      <div class="card text-left">
        <h3>40 Modern UI Primitives</h3>
        <p>A full suite of accessible UI components inspired by shadcn/ui: from input-otp and custom select to sliding sheets and scroll-snap carousels.</p>
      </div>
      <div class="card text-left">
        <h3>Foundation Motion UI Engine</h3>
        <p>Hardware-accelerated 3D perspective hinges, rotational spins, and micro-interactions with timing curves and child sequence cascading (.stagger).</p>
      </div>
      <div class="card text-left">
        <h3>CSS Cascade Layers (@layer)</h3>
        <p>All compiled CSS is scoped under <code>@layer skeletonic.*</code> to isolate specificity and integrate seamlessly with Tailwind, Sass, or custom CSS.</p>
      </div>
      <div class="card text-left">
        <h3>OKLCH Dynamic Color Engine</h3>
        <p>Perceptually uniform color spaces with native <code>light-dark()</code> resolution, ensuring automatic WCAG 2.2 AA contrast compliance across themes.</p>
      </div>
    </div>
  </div>
</section>

<section id="quickstart" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Quick Start in 30 Seconds</h2>
    <p class="section-desc text-center">Install via your favorite package manager or import directly from CDN.</p>
    <pre><code>&#35; 1. Install via pnpm, npm, or bun
pnpm add @sebastienrousseau/skeletonic-stylus
&#35; 2. Or scaffold components on-demand using the built-in CLI
npx @sebastienrousseau/skeletonic-stylus add button select input-otp
&#35; 3. Import in your Stylus or CSS bundle
@import "@sebastienrousseau/skeletonic-stylus"</code></pre>
  </div>
</section>

<section id="showcase" class="section">
  <div class="container">
    <h2 class="section-title text-center">Interactive Dashboard &amp; Forms Showcase</h2>
    <p class="section-desc text-center">Crisp, visible form controls, custom selects, segmented OTP slots, and accessible toggles.</p>
    <div class="demo-grid">
      <!-- Widget 1: Account Settings -->
      <div class="card text-left">
        <div class="card-header">
          <div class="flex flex-middle gap-sm">
            <div class="avatar avatar-md">
              <img src="/assets/avatar.svg" alt="Portrait of Alex Morgan" width="100" height="100" />
              <span class="avatar-presence online" role="status" aria-label="Online"></span>
            </div>
            <div>
              <h3 class="card-title">Account Settings</h3>
              <p class="card-description">Personalize profile and workspace identity.</p>
            </div>
          </div>
        </div>
        <div class="card-content flex flex-column gap-md">
          <div>
            <label class="block mb-xs semibold text-xs" for="widget-email">Email Address</label>
            <input id="widget-email" type="email" value="alex.morgan@company.io" placeholder="name@company.com" />
          </div>
          <div>
            <label class="block mb-xs semibold text-xs" for="widget-framework">Design Framework</label>
            <span class="select-field">
              <select id="widget-framework" class="select">
                <option>Skeletonic Stylus 3.0 (Active)</option>
                <option>Native Cascade Layers</option>
                <option>OKLCH Monochromatic</option>
              </select>
            </span>
          </div>
          <div>
            <label class="block mb-xs semibold text-xs" for="widget-bio">Workspace Description</label>
            <textarea id="widget-bio" rows="2" placeholder="Describe your team mission...">Building next-gen digital experiences using zero-runtime CSS.</textarea>
          </div>
          <div class="flex flex-between flex-middle pt-xs">
            <label class="switch-field">
              <input type="checkbox" class="switch" id="widget-notifications" checked aria-label="Instant Security Alerts" />
              <span class="text-xs semibold">Instant Security Alerts</span>
            </label>
          </div>
        </div>
        <div class="card-footer mt-md">
          <button type="button" class="btn btn-primary btn-sm w-full">Save Changes</button>
        </div>
      </div>
      <!-- Widget 2: Security & Multi-factor Verification -->
      <div class="card text-left">
        <div class="card-header">
          <h3 class="card-title">Security &amp; Preferences</h3>
          <p class="card-description">Custom accessible checkboxes, radios, and OTP pins.</p>
        </div>
        <div class="card-content flex flex-column gap-md">
          <div>
            <span class="block mb-xs semibold text-xs">Two-Factor Authentication (OTP)</span>
            <div class="input-otp">
              <div class="input-otp-group">
                <div class="input-otp-slot active">7<span class="input-otp-caret"></span></div>
                <div class="input-otp-slot">4</div>
                <div class="input-otp-slot">2</div>
              </div>
              <span class="input-otp-separator">-</span>
              <div class="input-otp-group">
                <div class="input-otp-slot">9</div>
                <div class="input-otp-slot">1</div>
                <div class="input-otp-slot">8</div>
              </div>
            </div>
          </div>
          <div>
            <span class="block mb-xs semibold text-xs">Repository Sync Rules</span>
            <div class="flex flex-column gap-sm">
              <label class="checkbox-field">
                <input type="checkbox" class="checkbox" id="check-sync" checked aria-label="Auto-sync with remote origin" />
                <span class="text-xs">Auto-sync with remote origin</span>
              </label>
              <label class="checkbox-field">
                <input type="checkbox" class="checkbox" id="check-audit" checked aria-label="Verify automated SBOM hashes" />
                <span class="text-xs">Verify automated SBOM hashes</span>
              </label>
            </div>
          </div>
          <div>
            <span class="block mb-xs semibold text-xs">Access Tier</span>
            <div class="radio-group radio-group-row">
              <label class="radio-field">
                <input type="radio" name="access-tier" class="radio" id="tier-pro" checked aria-label="Professional" />
                <span class="text-xs">Professional</span>
              </label>
              <label class="radio-field">
                <input type="radio" name="access-tier" class="radio" id="tier-team" aria-label="Enterprise" />
                <span class="text-xs">Enterprise</span>
              </label>
            </div>
          </div>
          <div>
            <div class="flex flex-between flex-middle mb-xs">
              <span class="text-xs semibold">Replication Bandwidth</span>
              <span class="text-xs opacity-60" id="slider-val">80%</span>
            </div>
            <input
              type="range"
              class="slider"
              min="0"
              max="100"
              value="80"
              oninput="document.getElementById('slider-val').textContent = this.value + '%'"
              aria-label="Replication Bandwidth"
            />
          </div>
        </div>
        <div class="card-footer mt-md">
          <button type="button" class="btn btn-secondary btn-sm w-full">Update Rules</button>
        </div>
      </div>
      <!-- Widget 3: Live System Status & Feedback -->
      <div class="card text-left">
        <div class="card-header">
          <div class="flex flex-between flex-middle">
            <h3 class="card-title">System Status</h3>
            <span class="badge success sm">All Systems Normal</span>
          </div>
          <p class="card-description">Telemetry, progress monitoring, and banners.</p>
        </div>
        <div class="card-content flex flex-column gap-md">
          <div>
            <div class="flex flex-between flex-middle mb-xs text-xs">
              <span class="semibold">Cloud Storage Capacity</span>
              <span class="opacity-70">75% (750 MB / 1 GB)</span>
            </div>
            <progress class="progress" value="75" max="100" aria-label="Cloud Storage Capacity">75%</progress>
          </div>
          <div class="alert alert-info mb-none padding-md">
            <strong class="block mb-xs text-xs">Cascade Layers Active:</strong>
            <span class="text-xs">All bundles compiled under <code>@layer skeletonic.*</code> to isolate specificity.</span>
          </div>
          <div class="toast show demo-toast-inline">
            <div class="toast-title text-xs">Artifact Generated</div>
            <div class="toast-description text-xs">Production build packaged into <code>dist/</code> without errors.</div>
          </div>
          <div class="flex flex-middle gap-sm">
            <div class="avatar avatar-sm">
              <span class="avatar-fallback text-xs">SR</span>
            </div>
            <div>
              <div class="bold text-xs">Sebastien Rousseau</div>
              <div class="text-xs opacity-60">Lead Maintainer</div>
            </div>
          </div>
        </div>
        <div class="card-footer mt-md">
          <button type="button" class="btn btn-secondary btn-sm w-full" data-dialog="demo-sheet">Open Side Drawer</button>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="components" class="section">
  <div class="container">
    <h2 class="section-title text-center">40 Modern UI Primitives</h2>
    <p class="section-desc text-center">Every element complies with WCAG 2.2 AA accessibility and modern HTML5 specifications.</p>
    <div class="grid-2x2 mt-xl">
      <!-- Category 1: Navigation -->
      <div class="card text-left">
        <h3 class="card-title">Navigation &amp; Breadcrumbs</h3>
        <p class="card-description mb-md">Structured wayfinding with semantic markup.</p>
        <nav class="breadcrumb mb-md" aria-label="Breadcrumb">
          <ol class="breadcrumb-list">
            <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Home</a></li>
            <li class="breadcrumb-separator">/</li>
            <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Components</a></li>
            <li class="breadcrumb-separator">/</li>
            <li class="breadcrumb-item"><span class="breadcrumb-page">Breadcrumb</span></li>
          </ol>
        </nav>
        <div class="tabs mb-md">
          <div class="tabs-list" role="tablist">
            <button type="button" class="tabs-trigger active" role="tab" aria-selected="true">Account</button>
            <button type="button" class="tabs-trigger" role="tab" aria-selected="false">Security</button>
            <button type="button" class="tabs-trigger" role="tab" aria-selected="false">API Keys</button>
          </div>
        </div>
        <nav class="pagination" aria-label="Pagination">
          <ul class="pagination-content">
            <li class="pagination-item"><a href="#" class="pagination-prev">Prev</a></li>
            <li class="pagination-item"><a href="#" class="pagination-link active">1</a></li>
            <li class="pagination-item"><a href="#" class="pagination-link">2</a></li>
            <li class="pagination-item"><span class="pagination-ellipsis">&hellip;</span></li>
            <li class="pagination-item"><a href="#" class="pagination-next">Next</a></li>
          </ul>
        </nav>
      </div>
      <!-- Category 2: Overlays -->
      <div class="card text-left">
        <h3 class="card-title">Overlays &amp; Tooltips</h3>
        <p class="card-description mb-md">Zero-JS hover cards, tooltips, and top-layer dialogs.</p>
        <div class="flex flex-wrap mb-md gap-sm">
          <button type="button" class="btn btn-primary btn-sm" data-dialog="demo-modal">Launch Modal</button>
          <button type="button" class="btn btn-secondary btn-sm" data-dialog="demo-sheet">Slide Sheet</button>
        </div>
        <div class="flex flex-middle mb-md gap-lg">
          <div class="hover-card">
            <a href="#" class="btn btn-outline btn-sm">@skeletonic-css</a>
            <div class="hover-card-content">
              <div class="bold mb-xs text-xs">Skeletonic Stylus</div>
              <p class="text-xs opacity-70 mb-none">Ultra-responsive CSS engine with 40 primitives and OKLCH color spaces.</p>
            </div>
          </div>
          <span class="tooltip tooltip-top" data-tooltip="Verified accessibility standard">
            <span class="badge success sm">WCAG 2.2 AA</span>
          </span>
        </div>
        <div class="accordion">
          <details class="accordion-item" open>
            <summary class="accordion-trigger"><span>What makes Skeletonic Stylus unique?</span></summary>
            <div class="accordion-content">
              <p class="text-xs opacity-70 mb-none">It compiles to native CSS with Cascade Layers, OKLCH color spaces, and 0ms JavaScript runtime overhead.</p>
            </div>
          </details>
        </div>
      </div>
      <!-- Category 3: Buttons & Groups -->
      <div class="card text-left">
        <h3 class="card-title">Buttons, Groups &amp; Shortcuts</h3>
        <p class="card-description mb-md">Stateful buttons, segmented groups, and keyboard shortcuts.</p>
        <div class="flex flex-wrap flex-middle mb-md gap-sm">
          <button type="button" class="btn btn-primary btn-sm">Primary</button>
          <button type="button" class="btn btn-secondary btn-sm">Secondary</button>
          <button type="button" class="btn btn-outline btn-sm">Outline</button>
        </div>
        <div class="button-group mb-md">
          <button type="button" class="button secondary sm active">Weekly</button>
          <button type="button" class="button secondary sm">Monthly</button>
          <button type="button" class="button secondary sm">Annual</button>
        </div>
        <div class="flex flex-between flex-middle flex-wrap gap-md">
          <div class="toggle-group">
            <button type="button" class="toggle active" aria-label="Bold"><b>B</b></button>
            <button type="button" class="toggle" aria-label="Italic"><i>I</i></button>
            <button type="button" class="toggle" aria-label="Underline"><u>U</u></button>
          </div>
          <div class="flex flex-middle opacity-70 text-xs gap-xs">
            <span>Shortcuts:</span>
            <kbd class="kbd">⌘</kbd>
            <kbd class="kbd">S</kbd>
          </div>
        </div>
      </div>
      <!-- Category 4: Media & Display -->
      <div class="card text-left">
        <h3 class="card-title">Media, Avatars &amp; Carousel</h3>
        <p class="card-description mb-md">Aspect ratios, avatar fallbacks, and pure CSS scroll snapping.</p>
        <div class="avatar-group mb-md">
          <div class="avatar avatar-sm"><span class="avatar-fallback">AG</span></div>
          <div class="avatar avatar-sm"><span class="avatar-fallback">SR</span></div>
          <div class="avatar avatar-sm"><span class="avatar-fallback">JD</span></div>
          <div class="avatar avatar-sm"><span class="avatar-fallback">+4</span></div>
        </div>
        <div class="carousel carousel-cols-2 mb-md">
          <div class="carousel-content" tabindex="0" role="region" aria-label="Media carousel slides">
            <div class="carousel-item">
              <div class="card padding-md bg-primary demo-rounded">
                <div class="bold text-xs mb-xs">Slide 1</div>
                <p class="text-xs mb-none">Zero-JS scroll snapping.</p>
              </div>
            </div>
            <div class="carousel-item">
              <div class="card padding-md bg-secondary demo-rounded">
                <div class="bold text-xs mb-xs">Slide 2</div>
                <p class="text-xs mb-none">Hardware acceleration.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="scroll-area radius demo-scroll-box" tabindex="0" role="region" aria-label="Changelog">
          <p class="text-xs opacity-70 mb-none">
            Skeletonic Stylus features custom scrollbars styled via <code>scrollbar-color</code> and <code>scrollbar-width: thin</code>.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="primitives" class="section">
  <div class="container">
    <h2 class="section-title text-center">Overlays, States &amp; Layout Primitives</h2>
    <p class="section-desc text-center">The rest of the suite: native top-layer overlays, loading and empty states, command search and ratio-locked media. Still zero runtime JavaScript — the overlays below are driven by the platform&rsquo;s own <code>popover</code> and <code>dialog</code> APIs.</p>
    <div class="demo-grid">
      <div class="card text-left demo-card">
        <h3>Popover &amp; Dropdown</h3>
        <p class="card-description">Native <code>[popover]</code> surfaces in the top layer — no positioning library, no script.</p>
        <button type="button" class="button secondary sm popover-trigger" popovertarget="demo-popover">Open popover</button>
        <div id="demo-popover" popover class="popover">
          <div class="popover-header">
            <h4 class="popover-title">Cascade layers</h4>
            <p class="popover-description">Everything ships inside <code>@layer skeletonic.*</code>.</p>
          </div>
          <div class="popover-body">Override any token without a specificity fight.</div>
        </div>
        <button type="button" class="button secondary sm dropdown-trigger" popovertarget="demo-dropdown">Open dropdown</button>
        <div id="demo-dropdown" popover class="dropdown">
          <button type="button" class="command-item">Duplicate</button>
          <button type="button" class="command-item">Archive</button>
          <button type="button" class="command-item">Delete</button>
        </div>
      </div>
      <div class="card text-left demo-card">
        <h3>Modal &amp; Sheet</h3>
        <p class="card-description">Top-layer <code>&lt;dialog&gt;</code> with a backdrop, and a sheet that slides in from the edge.</p>
        <button type="button" class="button primary sm" data-dialog="demo-modal">Launch modal</button>
        <button type="button" class="button secondary sm" data-dialog="demo-sheet">Slide sheet in</button>
      </div>
      <div class="card text-left demo-card">
        <h3>Command Palette</h3>
        <p class="card-description">Search scaffold with grouped results and shortcut hints.</p>
        <div class="command">
          <div class="command-input-wrapper">
            <input class="command-input" type="search" placeholder="Search components&hellip;" aria-label="Search components" />
          </div>
          <div class="command-list">
            <div class="command-group">
              <div class="command-group-heading">Primitives</div>
              <button type="button" class="command-item selected">Input OTP<span class="command-shortcut">&#8984;1</span></button>
              <button type="button" class="command-item">Carousel<span class="command-shortcut">&#8984;2</span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="card text-left demo-card">
        <h3>Loading States</h3>
        <p class="card-description">A spinner for indeterminate waits, skeletons for known layout.</p>
        <span class="loader" role="status" aria-label="Loading"></span>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
      <div class="card text-left demo-card">
        <h3>Empty State</h3>
        <p class="card-description">The zero-data screen, with room for a recovery action.</p>
        <div class="empty empty-state">
          <div class="empty-icon" aria-hidden="true">&#9634;</div>
          <div class="empty-title">No components yet</div>
          <div class="empty-description">Scaffold your first one with the CLI.</div>
          <div class="empty-actions">
            <button type="button" class="button secondary sm">Add component</button>
          </div>
        </div>
      </div>
      <div class="card text-left demo-card">
        <h3>Aspect Ratio</h3>
        <p class="card-description">Ratio-locked containers that never reflow as media loads.</p>
        <div class="aspect-ratio ratio-16-9">
          <img src="/assets/logo.svg" alt="Skeletonic logo in a 16:9 container" width="320" height="180" />
        </div>
        <p class="text-xs card-description">.ratio-16-9 &middot; also 1:1, 4:3, 21:9, 9:16</p>
      </div>
      <div class="card text-left demo-card">
        <h3>Navbar</h3>
        <p class="card-description">Sticky application bar with a scroll-driven shadow.</p>
        <div class="navbar-demo-frame">
          <div class="navbar">
            <nav class="nav" aria-label="Component demo">
              <a href="#primitives">Home</a>
              <a href="#primitives">Docs</a>
              <a href="#primitives">API</a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="motion" class="section">
  <div class="container text-center">
    <h2 class="section-title">Foundation Motion UI Engine</h2>
    <p class="section-desc">3D perspective hinges, rotational spins, and delightful micro-interactions.</p>
    <div class="grid-2x2 mt-xl mb-xl">
      <button type="button" class="card anim-demo" data-anim="hingeInFromTop">
        <div class="bold text-xs mb-xs">.hingeInFromTop</div>
        <span class="text-xs opacity-60">3D Door Swing In</span>
      </button>
      <button type="button" class="card anim-demo" data-anim="hingeOutToBottom">
        <div class="bold text-xs mb-xs">.hingeOutToBottom</div>
        <span class="text-xs opacity-60">3D Dropdown Exit</span>
      </button>
      <button type="button" class="card anim-demo" data-anim="spinIn">
        <div class="bold text-xs mb-xs">.spinIn</div>
        <span class="text-xs opacity-60">Clockwise 360&deg; Spin</span>
      </button>
      <button type="button" class="card anim-demo" data-anim="spinInCCW">
        <div class="bold text-xs mb-xs">.spinInCCW</div>
        <span class="text-xs opacity-60">Counter-Clockwise Spin</span>
      </button>
    </div>
  </div>
</section>

<section id="security" class="section">
  <div class="container text-center">
    <h2 class="section-title">Zero-Trust Hardened Quality &amp; Performance</h2>
    <p class="section-desc">Strict quality guarantees verified in automated CI and release verification gates.</p>
    <div class="grid-2x2">
      <div class="card text-left">
        <h3>1.9 kB Core, Brotli</h3>
        <p>The core engine is 6.8 kB minified and 1.9 kB over the wire. Compiled with csso and held there by size-limit budgets that fail the build when they are exceeded.</p>
      </div>
      <div class="card text-left">
        <h3>Zero Runtime JavaScript</h3>
        <p>100% pure CSS engine eliminating hydration delays, main thread blocking, and client-side framework overhead.</p>
      </div>
      <div class="card text-left">
        <h3>Zero Axe-core Violations</h3>
        <p>Every page of this site is audited with Playwright and Axe-core in both colour schemes on each build, with contrast measured on the rendered pixels rather than inferred.</p>
      </div>
      <div class="card text-left">
        <h3>18 / 18 Pre-Release Verification Gates</h3>
        <p>Hermetic verification covering version coherence, package integrity, CycloneDX SBOM generation, and Stylint strict rules.</p>
      </div>
    </div>
  </div>
</section>

<section id="faq" class="section">
  <div class="container narrow">
    <h2 class="section-title text-center">Frequently Asked Questions</h2>
    <div class="faq-stack">
      <div class="card text-left">
        <h3>What is the startup overhead of Skeletonic Stylus?</h3>
        <p>0 milliseconds. There is zero JavaScript bundle loaded or executed to render the components, resulting in perfect Core Web Vitals.</p>
      </div>
      <div class="card text-left">
        <h3>Can I use Skeletonic Stylus with Tailwind or Sass?</h3>
        <p>Yes. All styles are wrapped inside CSS Cascade Layers (<code>@layer skeletonic.*</code>), making it easy to override or combine without specificity collisions.</p>
      </div>
      <div class="card text-left">
        <h3>How do I customize the color palette?</h3>
        <p>All colors are exposed as CSS custom properties using OKLCH and <code>light-dark()</code> on <code>:root</code>, allowing seamless theming in a single line of CSS.</p>
      </div>
    </div>
  </div>
</section>

<script>
  // Every demo on this page is wired from here rather than from an inline
  // onclick attribute. cargo-ssg extracts inline <script> blocks to hashed
  // files under _csp/ and emits `script-src 'self'`, which allows this file to
  // run but refuses to compile handler attributes — under that policy an
  // onclick= demo is silently inert, which is how the modal, the drawer and
  // all four Motion UI cards came to do nothing at all.
  const replayAnimation = (el, name) => {
    el.classList.remove(name);
    void el.offsetWidth; // forces reflow, so re-adding the class restarts it
    el.classList.add(name);
  };

  document.addEventListener("click", (event) => {
    const dialogTrigger = event.target.closest("[data-dialog]");
    if (dialogTrigger) {
      document.getElementById(dialogTrigger.dataset.dialog)?.showModal();
      return;
    }

    const animTrigger = event.target.closest("[data-anim]");
    if (animTrigger) replayAnimation(animTrigger, animTrigger.dataset.anim);
  });
</script>
