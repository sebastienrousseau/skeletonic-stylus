/**
 * The source of truth for the component reference at /components/.
 *
 * Each entry names a real stylesheet in src/stylus/components/. The generator
 * (scripts/generate-component-docs.mjs) checks that mapping in both directions,
 * so a component cannot be shipped without documentation and a page cannot
 * document a component that no longer exists.
 *
 * `markup` is used twice per example: once rendered live, and once escaped into
 * the code block beneath it. They cannot drift, because they are the same
 * string.
 */

export const categories = [
  { slug: "forms", name: "Forms" },
  { slug: "actions", name: "Actions" },
  { slug: "navigation", name: "Navigation" },
  { slug: "overlays", name: "Overlays" },
  { slug: "feedback", name: "Feedback" },
  { slug: "data", name: "Data display" },
  { slug: "layout", name: "Layout" },
];

export const components = [
  // --- Forms ---------------------------------------------------------------
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "forms",
    tagline: "Accessible checkboxes with a custom mark and an indeterminate state.",
    examples: [
      {
        title: "Default",
        description: 'Wrap the input and its text in <code>.checkbox-field</code> so the whole label is a hit target.',
        markup: `<label class="checkbox-field">
  <input type="checkbox" class="checkbox" checked />
  <span>Auto-sync with remote origin</span>
</label>`,
      },
      {
        title: "Sizes",
        description: "Add <code>.sm</code> or <code>.lg</code> to the input.",
        markup: `<label class="checkbox-field">
  <input type="checkbox" class="checkbox sm" checked />
  <span>Small</span>
</label>
<label class="checkbox-field">
  <input type="checkbox" class="checkbox lg" checked />
  <span>Large</span>
</label>`,
      },
    ],
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    category: "forms",
    tagline: "Segmented one-time-password entry with a blinking caret.",
    examples: [
      {
        title: "Six digits in two groups",
        description: 'Each <code>.input-otp-slot</code> is one character; <code>.active</code> carries the caret.',
        markup: `<div class="input-otp">
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
</div>`,
      },
    ],
  },
  {
    slug: "radio-group",
    name: "Radio group",
    category: "forms",
    tagline: "Custom radio controls in a column or a row.",
    examples: [
      {
        title: "Column",
        description: 'Group the fields in <code>.radio-group</code>.',
        markup: `<div class="radio-group">
  <label class="radio-field">
    <input type="radio" name="tier" class="radio" checked />
    <span>Open source</span>
  </label>
  <label class="radio-field">
    <input type="radio" name="tier" class="radio" />
    <span>Enterprise</span>
  </label>
</div>`,
      },
      {
        title: "Row",
        description: 'Add <code>.radio-group-row</code> to lay the options out horizontally.',
        markup: `<div class="radio-group radio-group-row">
  <label class="radio-field">
    <input type="radio" name="cadence" class="radio" checked />
    <span>Weekly</span>
  </label>
  <label class="radio-field">
    <input type="radio" name="cadence" class="radio" />
    <span>Monthly</span>
  </label>
</div>`,
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "forms",
    tagline: "The native select, with the chevron drawn on a wrapper.",
    examples: [
      {
        title: "Default",
        description:
          'The chevron lives on <code>.select-field</code> rather than the control, so the control keeps a flat background that contrast tooling can measure.',
        markup: `<span class="select-field">
  <select class="select" aria-label="Design framework">
    <option>Skeletonic Stylus 2.0</option>
    <option>Native Cascade Layers</option>
  </select>
</span>`,
      },
    ],
  },
  {
    slug: "slider",
    name: "Slider",
    category: "forms",
    tagline: "Native range input with a 24px target area.",
    examples: [
      {
        title: "With a value read-out",
        description: 'Pair <code>.slider</code> with <code>.slider-header</code> and <code>.slider-value</code>.',
        markup: `<div class="slider-group">
  <div class="slider-header">
    <span>Compression</span>
    <span class="slider-value">72</span>
  </div>
  <input type="range" class="slider" value="72" aria-label="Compression" />
</div>`,
      },
      {
        title: "Status colours",
        description: "<code>.slider-success</code>, <code>.slider-warning</code> and <code>.slider-danger</code> tint the track.",
        markup: `<input type="range" class="slider slider-success" value="30" aria-label="Success" />
<input type="range" class="slider slider-warning" value="60" aria-label="Warning" />
<input type="range" class="slider slider-danger" value="90" aria-label="Danger" />`,
      },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "forms",
    tagline: "Sliding on/off control for settings that apply immediately.",
    examples: [
      {
        title: "Default",
        description: 'Wrap in <code>.switch-field</code> to make the text part of the target.',
        markup: `<label class="switch-field">
  <input type="checkbox" class="switch" checked aria-label="Instant security alerts" />
  <span>Instant security alerts</span>
</label>`,
      },
      {
        title: "Status colours",
        description: "<code>.switch-success</code>, <code>.switch-warning</code>, <code>.switch-danger</code>.",
        markup: `<input type="checkbox" class="switch switch-success" checked aria-label="Success" />
<input type="checkbox" class="switch switch-warning" checked aria-label="Warning" />
<input type="checkbox" class="switch switch-danger" checked aria-label="Danger" />`,
      },
    ],
  },

  // --- Actions -------------------------------------------------------------
  {
    slug: "button-group",
    name: "Button group",
    category: "actions",
    tagline: "Connected buttons that read as one control.",
    examples: [
      {
        title: "Horizontal",
        description: 'Borders are de-duplicated between children; <code>.active</code> marks the current choice.',
        markup: `<div class="button-group">
  <button type="button" class="button secondary sm active">Weekly</button>
  <button type="button" class="button secondary sm">Monthly</button>
  <button type="button" class="button secondary sm">Annual</button>
</div>`,
      },
      {
        title: "Vertical",
        description: "Add <code>.button-group-vertical</code>.",
        markup: `<div class="button-group button-group-vertical">
  <button type="button" class="button secondary sm">Duplicate</button>
  <button type="button" class="button secondary sm">Archive</button>
</div>`,
      },
    ],
  },
  {
    slug: "toggle-group",
    name: "Toggle group",
    category: "actions",
    tagline: "Single or multi-select toggle bar.",
    examples: [
      {
        title: "Text formatting",
        description: 'Each button is a <code>.toggle</code>; the pressed one carries <code>.active</code>.',
        markup: `<div class="toggle-group">
  <button type="button" class="toggle active" aria-label="Bold"><b>B</b></button>
  <button type="button" class="toggle" aria-label="Italic"><i>I</i></button>
  <button type="button" class="toggle" aria-label="Underline"><u>U</u></button>
</div>`,
      },
      {
        title: "Outline and connected",
        description: "<code>.toggle-outline</code> drops the fill; <code>.toggle-group-connected</code> joins the edges.",
        markup: `<div class="toggle-group toggle-group-connected">
  <button type="button" class="toggle toggle-outline active">Grid</button>
  <button type="button" class="toggle toggle-outline">List</button>
</div>`,
      },
    ],
  },
  {
    slug: "kbd",
    name: "Keyboard key",
    category: "actions",
    tagline: "Inline keyboard shortcuts with a tactile border.",
    examples: [
      {
        title: "A shortcut",
        description: 'Use the <code>&lt;kbd&gt;</code> element with <code>.kbd</code>. Sizes: <code>.sm</code>, <code>.lg</code>.',
        markup: `<span>Save with</span>
<kbd class="kbd">&#8984;</kbd>
<kbd class="kbd">S</kbd>`,
      },
    ],
  },

  // --- Navigation ----------------------------------------------------------
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "navigation",
    tagline: "Semantic wayfinding with a slash or chevron separator.",
    examples: [
      {
        title: "Default",
        description: 'Mark the current page with <code>.breadcrumb-page</code>, not a link.',
        markup: `<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Home</a></li>
    <li class="breadcrumb-separator">/</li>
    <li class="breadcrumb-item"><a href="#" class="breadcrumb-link">Components</a></li>
    <li class="breadcrumb-separator">/</li>
    <li class="breadcrumb-item"><span class="breadcrumb-page">Breadcrumb</span></li>
  </ol>
</nav>`,
      },
    ],
  },
  {
    slug: "navbar",
    name: "Navbar",
    category: "navigation",
    tagline: "Sticky application bar with a scroll-driven shadow.",
    examples: [
      {
        title: "Default",
        description:
          "<code>.navbar</code> is <code>position: sticky</code> and animates its shadow with <code>animation-timeline: scroll()</code>.",
        markup: `<div class="navbar">
  <nav class="nav" aria-label="Example">
    <a href="#navbar">Home</a>
    <a href="#navbar">Docs</a>
    <a href="#navbar">API</a>
  </nav>
</div>`,
      },
    ],
  },
  {
    slug: "pagination",
    name: "Pagination",
    category: "navigation",
    tagline: "Page controls with an ellipsis for elided ranges.",
    examples: [
      {
        title: "Default",
        description: 'The current page carries <code>.active</code>; gaps use <code>.pagination-ellipsis</code>.',
        markup: `<nav class="pagination" aria-label="Pagination">
  <ul class="pagination-content">
    <li class="pagination-item"><a href="#" class="pagination-prev">Prev</a></li>
    <li class="pagination-item"><a href="#" class="pagination-link active">1</a></li>
    <li class="pagination-item"><a href="#" class="pagination-link">2</a></li>
    <li class="pagination-item"><span class="pagination-ellipsis">&hellip;</span></li>
    <li class="pagination-item"><a href="#" class="pagination-next">Next</a></li>
  </ul>
</nav>`,
      },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "navigation",
    tagline: "Tab list with a pill or underline treatment.",
    examples: [
      {
        title: "Pills",
        description: 'The selected trigger needs both <code>.active</code> and <code>aria-selected="true"</code>.',
        markup: `<div class="tabs">
  <div class="tabs-list" role="tablist">
    <button type="button" class="tabs-trigger active" role="tab" aria-selected="true">Account</button>
    <button type="button" class="tabs-trigger" role="tab" aria-selected="false">Security</button>
    <button type="button" class="tabs-trigger" role="tab" aria-selected="false">API keys</button>
  </div>
</div>`,
      },
      {
        title: "Underline",
        description: "Add <code>.tabs-underline</code> to the container.",
        markup: `<div class="tabs tabs-underline">
  <div class="tabs-list" role="tablist">
    <button type="button" class="tabs-trigger active" role="tab" aria-selected="true">Overview</button>
    <button type="button" class="tabs-trigger" role="tab" aria-selected="false">Usage</button>
  </div>
</div>`,
      },
    ],
  },
  {
    slug: "command",
    name: "Command palette",
    category: "navigation",
    tagline: "Grouped search results with shortcut hints.",
    examples: [
      {
        title: "Inline palette",
        description: 'Results sit in <code>.command-list</code>, grouped by <code>.command-group</code>.',
        markup: `<div class="command">
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
</div>`,
      },
    ],
  },

  // --- Overlays ------------------------------------------------------------
  {
    slug: "modal",
    name: "Modal",
    category: "overlays",
    tagline: "Native top-layer dialog with a backdrop.",
    examples: [
      {
        title: "Open and close without script",
        description:
          'Open with <code>showModal()</code>, close with a <code>&lt;form method="dialog"&gt;</code> — no event handler is involved in closing.',
        markup: `<button type="button" class="button primary sm" data-dialog="doc-modal">Launch modal</button>
<dialog id="doc-modal" class="modal" aria-labelledby="doc-modal-title">
  <form method="dialog">
    <div class="modal-header"><h3 id="doc-modal-title">Deploy to production</h3></div>
    <p>This renders in the browser's top layer.</p>
    <div class="modal-footer">
      <button type="submit" class="button secondary sm">Cancel</button>
      <button type="submit" class="button primary sm">Deploy</button>
    </div>
  </form>
</dialog>`,
      },
    ],
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "overlays",
    tagline: "Dialog that slides in from an edge.",
    examples: [
      {
        title: "From the left",
        description: "Edge modifiers: <code>.sheet-left</code>, <code>.sheet-top</code>, <code>.sheet-bottom</code>.",
        markup: `<button type="button" class="button secondary sm" data-dialog="doc-sheet">Open sheet</button>
<dialog id="doc-sheet" class="sheet sheet-left" aria-labelledby="doc-sheet-title">
  <form method="dialog">
    <div class="sheet-header">
      <h3 id="doc-sheet-title" class="sheet-title">Workspace settings</h3>
      <p class="sheet-description">Shares the dialog top layer.</p>
    </div>
    <div class="sheet-footer">
      <button type="submit" class="button secondary sm">Close</button>
    </div>
  </form>
</dialog>`,
      },
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    category: "overlays",
    tagline: "Native [popover] surface — no positioning library, no script.",
    examples: [
      {
        title: "Default",
        description: 'The <code>popovertarget</code> attribute does the work; the browser handles the top layer and light dismiss.',
        markup: `<button type="button" class="button secondary sm" popovertarget="doc-popover">Open popover</button>
<div id="doc-popover" popover class="popover">
  <div class="popover-header">
    <h4 class="popover-title">Cascade layers</h4>
    <p class="popover-description">Everything ships inside <code>@layer skeletonic.*</code>.</p>
  </div>
  <div class="popover-body">Override any token without a specificity fight.</div>
</div>`,
      },
    ],
  },
  {
    slug: "dropdown",
    name: "Dropdown",
    category: "overlays",
    tagline: "A menu built on the same native popover primitive.",
    examples: [
      {
        title: "Action menu",
        description: "Items reuse <code>.command-item</code> so menus and palettes stay visually consistent.",
        markup: `<button type="button" class="button secondary sm" popovertarget="doc-dropdown">Actions</button>
<div id="doc-dropdown" popover class="dropdown">
  <button type="button" class="command-item">Duplicate</button>
  <button type="button" class="command-item">Archive</button>
  <button type="button" class="command-item">Delete</button>
</div>`,
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "overlays",
    tagline: "Short hint shown on hover or focus.",
    examples: [
      {
        title: "On a badge",
        description: 'The text comes from <code>data-tooltip</code>; <code>.tooltip-top</code> sets the side.',
        markup: `<span class="tooltip tooltip-top" data-tooltip="Verified accessibility standard">
  <span class="badge success sm">WCAG 2.2 AA</span>
</span>`,
      },
    ],
  },
  {
    slug: "hover-card",
    name: "Hover card",
    category: "overlays",
    tagline: "Richer preview panel revealed on hover or focus-within.",
    examples: [
      {
        title: "Profile preview",
        description: "Opens on <code>:hover</code> and <code>:focus-within</code>, so keyboard users get it too.",
        markup: `<div class="hover-card">
  <a href="#hover-card" class="button secondary sm">@skeletonic-css</a>
  <div class="hover-card-content">
    <div class="bold">Skeletonic Stylus</div>
    <p>Ultra-responsive CSS engine with 35 primitives.</p>
  </div>
</div>`,
      },
    ],
  },

  // --- Feedback ------------------------------------------------------------
  {
    slug: "alert",
    name: "Alert",
    category: "feedback",
    tagline: "Inline banner for status that stays on the page.",
    examples: [
      {
        title: "Variants",
        description: "<code>.alert-info</code>, <code>.alert-success</code>, <code>.alert-warning</code>, <code>.alert-error</code>.",
        markup: `<div class="alert alert-info"><strong>Cascade layers active:</strong> all bundles compiled under <code>@layer skeletonic.*</code>.</div>
<div class="alert alert-success">Production build packaged without errors.</div>
<div class="alert alert-warning">Two dependencies are behind their latest minor.</div>
<div class="alert alert-error">The release gate found an unsigned commit.</div>`,
      },
    ],
  },
  {
    slug: "toast",
    name: "Toast",
    category: "feedback",
    tagline: "Transient notification with a title and description.",
    examples: [
      {
        title: "Static placement",
        description:
          "Toasts normally position themselves; the example is pinned in flow so it can be read here.",
        markup: `<div class="toast toast-success" style="position: static; transform: none;">
  <div class="toast-title">Artifact generated</div>
  <div class="toast-description">Production build packaged into <code>dist/</code>.</div>
</div>`,
      },
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    category: "feedback",
    tagline: "Determinate progress with status colours.",
    examples: [
      {
        title: "With a label",
        description: "Always give the bar an accessible name and the current value.",
        markup: `<div class="progress" role="progressbar" aria-label="Cloud storage" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 75%;"></div>
</div>`,
      },
      {
        title: "Status colours",
        description: "<code>.success</code>, <code>.warning</code>, <code>.danger</code>; sizes <code>.sm</code> to <code>.xl</code>.",
        markup: `<div class="progress success sm" role="progressbar" aria-label="Passing" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: 90%;"></div></div>
<div class="progress warning" role="progressbar" aria-label="Degraded" aria-valuenow="55" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width: 55%;"></div></div>`,
      },
    ],
  },
  {
    slug: "loader",
    name: "Loader",
    category: "feedback",
    tagline: "Spinner for waits of unknown length.",
    examples: [
      {
        title: "Default",
        description: 'Give it <code>role="status"</code> and a label so assistive tech announces the wait.',
        markup: `<span class="loader" role="status" aria-label="Loading"></span>`,
      },
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "feedback",
    tagline: "Placeholder blocks for content whose layout is already known.",
    examples: [
      {
        title: "Text block",
        description: "<code>.skeleton-title</code>, <code>.skeleton-text</code>, <code>.skeleton-avatar</code>, <code>.skeleton-button</code>.",
        markup: `<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>`,
      },
      {
        title: "Shimmer",
        description: "Add <code>.skeleton-shimmer</code> for a travelling highlight instead of a pulse.",
        markup: `<div class="skeleton skeleton-shimmer skeleton-title"></div>
<div class="skeleton skeleton-shimmer skeleton-text"></div>`,
      },
    ],
  },
  {
    slug: "empty",
    name: "Empty state",
    category: "feedback",
    tagline: "The zero-data screen, with room for a recovery action.",
    examples: [
      {
        title: "Default",
        description: "Pair the explanation with the action that resolves it.",
        markup: `<div class="empty empty-state">
  <div class="empty-icon" aria-hidden="true">&#9634;</div>
  <div class="empty-title">No components yet</div>
  <div class="empty-description">Scaffold your first one with the CLI.</div>
  <div class="empty-actions"><button type="button" class="button secondary sm">Add component</button></div>
</div>`,
      },
    ],
  },

  // --- Data display --------------------------------------------------------
  {
    slug: "avatar",
    name: "Avatar",
    category: "data",
    tagline: "Portraits, initials fallbacks, presence and stacked groups.",
    examples: [
      {
        title: "Fallback initials",
        description: "Sizes <code>.sm</code>, <code>.lg</code>, <code>.xl</code>; <code>.rounded</code> for a circle.",
        markup: `<div class="avatar sm"><span class="avatar-fallback">SR</span></div>
<div class="avatar"><span class="avatar-fallback">AG</span></div>
<div class="avatar lg"><span class="avatar-fallback">JD</span></div>`,
      },
      {
        title: "Group",
        description: "<code>.avatar-group</code> overlaps the children.",
        markup: `<div class="avatar-group">
  <div class="avatar sm"><span class="avatar-fallback">AG</span></div>
  <div class="avatar sm"><span class="avatar-fallback">SR</span></div>
  <div class="avatar sm"><span class="avatar-fallback">+4</span></div>
</div>`,
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "data",
    tagline: "Compact status label.",
    examples: [
      {
        title: "Variants",
        description: "<code>.primary</code>, <code>.secondary</code>, <code>.success</code>, <code>.warning</code>, <code>.danger</code>, <code>.info</code>.",
        markup: `<span class="badge primary">Primary</span>
<span class="badge success">Passing</span>
<span class="badge warning">Deprecated</span>
<span class="badge danger">Breaking</span>`,
      },
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "data",
    tagline: "Surface with a header, body and footer.",
    examples: [
      {
        title: "Default",
        description: "Each region is optional; use the ones you need.",
        markup: `<div class="card">
  <div class="card-header">
    <h3 class="card-title">Account settings</h3>
    <p class="card-description">Personalise profile and workspace identity.</p>
  </div>
  <div class="card-content">Anything can live in the body.</div>
  <div class="card-footer"><button type="button" class="button primary sm">Save changes</button></div>
</div>`,
      },
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    category: "data",
    tagline: "Horizontal or vertical divider, optionally labelled.",
    examples: [
      {
        title: "With a label",
        description: "A bare <code>&lt;hr class=\"separator\"&gt;</code> works too.",
        markup: `<div class="separator"><span class="separator-label">or</span></div>`,
      },
    ],
  },

  // --- Layout --------------------------------------------------------------
  {
    slug: "aspect-ratio",
    name: "Aspect ratio",
    category: "layout",
    tagline: "Ratio-locked container that never reflows as media loads.",
    examples: [
      {
        title: "16:9",
        description: "Also <code>.ratio-1-1</code>, <code>.ratio-4-3</code>, <code>.ratio-21-9</code>, <code>.ratio-9-16</code>.",
        markup: `<div class="aspect-ratio ratio-16-9">
  <img src="/assets/logo.svg" alt="Skeletonic logo" width="320" height="180" />
</div>`,
      },
    ],
  },
  {
    slug: "carousel",
    name: "Carousel",
    category: "layout",
    tagline: "Scroll-snap carousel in pure CSS.",
    examples: [
      {
        title: "Two columns",
        description: 'The track is focusable and labelled so it can be reached and scrolled by keyboard.',
        markup: `<div class="carousel carousel-cols-2">
  <div class="carousel-content" tabindex="0" role="region" aria-label="Example slides">
    <div class="carousel-item"><div class="card">Slide 1</div></div>
    <div class="carousel-item"><div class="card">Slide 2</div></div>
    <div class="carousel-item"><div class="card">Slide 3</div></div>
  </div>
</div>`,
      },
    ],
  },
  {
    slug: "scroll-area",
    name: "Scroll area",
    category: "layout",
    tagline: "Bounded scroller with a thin custom scrollbar.",
    examples: [
      {
        title: "Vertical",
        description: 'Focusable and labelled, so keyboard users can scroll it.',
        markup: `<div class="scroll-area" tabindex="0" role="region" aria-label="Changelog" style="height: 5rem;">
  <p>Skeletonic Stylus styles its scrollbars with <code>scrollbar-color</code> and <code>scrollbar-width: thin</code>.</p>
  <p>The region scrolls independently of the page.</p>
  <p>It keeps its own focus ring.</p>
</div>`,
      },
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "layout",
    tagline: "Disclosure built on native details and summary.",
    examples: [
      {
        title: "Default",
        description: "Native <code>&lt;details&gt;</code> means keyboard support and find-in-page come for free.",
        markup: `<div class="accordion">
  <details class="accordion-item" open>
    <summary class="accordion-trigger"><span>What makes Skeletonic Stylus unique?</span></summary>
    <div class="accordion-content"><p>It compiles to native CSS with cascade layers and zero runtime JavaScript.</p></div>
  </details>
  <details class="accordion-item">
    <summary class="accordion-trigger"><span>Does it work with Tailwind?</span></summary>
    <div class="accordion-content"><p>Yes — everything is scoped inside <code>@layer skeletonic.*</code>.</p></div>
  </details>
</div>`,
      },
    ],
  },
  {
    slug: "header",
    name: "Headings",
    category: "layout",
    tagline: "The typographic scale applied to h1–h6.",
    examples: [
      {
        title: "Scale",
        description: "Sizes are fluid, set with <code>clamp()</code> against the viewport.",
        markup: `<h3 class="h1">Heading level 1</h3>
<h3 class="h2">Heading level 2</h3>
<h3 class="h3">Heading level 3</h3>`,
      },
    ],
  },
];
