#!/usr/bin/env node
/**
 * Generates the per-component reference pages at /components/<slug>/.
 *
 * Every page is written from scripts/components-manifest.mjs, so the reference
 * cannot drift from the library in either direction:
 *
 *   - a manifest entry naming a component that has no stylesheet fails here;
 *   - a stylesheet with no manifest entry fails here too.
 *
 * The second check is the one that matters. The showcase advertised "35 Modern
 * UI Primitives" while eleven of them had no demo anywhere on the site, and
 * nothing in the build noticed.
 *
 * Within a page, each example's markup is emitted twice — once live, once
 * escaped into the code block beneath it — from the same string, so the sample
 * a reader copies is necessarily the markup they just saw render.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { categories, components, elements, guides } from "./components-manifest.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stylusDir = join(root, "src/stylus/components");
const outDir = join(root, "content/components");

const DATE = "2026-09-14";

// --- Validate the manifest against the library ------------------------------

const onDisk = new Set(
  readdirSync(stylusDir)
    .filter(f => f.endsWith(".styl") && !f.startsWith("_"))
    .map(f => f.replace(/\.styl$/, "")),
);
const documented = new Set(components.map(c => c.slug));

// The same one-to-one check over src/stylus/elements/. `margin` and `padding`
// only generate the spacing utilities, which the Utilities guide covers.
const UTILITY_ONLY = new Set(["margin", "padding", "link-effects"]);
const elementsOnDisk = new Set(
  readdirSync(join(root, "src/stylus/elements"))
    .filter(f => f.endsWith(".styl") && !f.startsWith("_"))
    .map(f => f.replace(/\.styl$/, ""))
    .filter(f => !UTILITY_ONLY.has(f)),
);
const elementsDocumented = new Set(elements.map(e => e.slug));

const undocumented = [...onDisk].filter(s => !documented.has(s)).sort();
const phantom = [...documented].filter(s => !onDisk.has(s)).sort();
const knownCategories = new Set(categories.map(c => c.slug));
const badCategory = components.filter(c => !knownCategories.has(c.category));

const problems = [];
if (undocumented.length) {
  problems.push(`components with no documentation page: ${undocumented.join(", ")}`);
}
if (phantom.length) {
  problems.push(`documented components with no stylesheet: ${phantom.join(", ")}`);
}
const elementGaps = [...elementsOnDisk].filter(s => !elementsDocumented.has(s)).sort();
const elementPhantoms = [...elementsDocumented].filter(s => !elementsOnDisk.has(s)).sort();
if (elementGaps.length) {
  problems.push(`elements with no documentation page: ${elementGaps.join(", ")}`);
}
if (elementPhantoms.length) {
  problems.push(`documented elements with no stylesheet: ${elementPhantoms.join(", ")}`);
}
for (const c of badCategory) {
  problems.push(`${c.slug}: unknown category "${c.category}"`);
}
for (const c of [...components, ...elements, ...guides]) {
  if (!c.examples?.length) problems.push(`${c.slug}: no examples`);
  for (const ex of c.examples ?? []) {
    if (!ex.markup?.trim()) problems.push(`${c.slug}: example "${ex.title}" has no markup`);
  }
}

if (problems.length) {
  console.error("generate-component-docs: manifest does not match the library:");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

// --- Rendering helpers ------------------------------------------------------

const escapeHtml = s =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** YAML-safe double-quoted scalar. */
const yamlString = s => `"${s.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;

const pages = [...components, ...elements, ...guides];

const byCategory = categories.map(cat => ({
  ...cat,
  items: pages.filter(c => c.category === cat.slug).sort((a, b) => a.name.localeCompare(b.name)),
}));

/**
 * The sidebar is emitted into every page rather than into the layout, because
 * the current entry needs `aria-current="page"` and the template engine has no
 * per-page conditional.
 */
function sidebar(activeSlug) {
  const groups = byCategory
    .map(cat => {
      const links = cat.items
        .map(c => {
          const current = c.slug === activeSlug ? ' aria-current="page"' : "";
          return `        <li><a href="/components/${c.slug}/"${current}>${c.name}</a></li>`;
        })
        .join("\n");
      return `      <li class="docs-nav-group">
        <span class="docs-nav-heading">${cat.name}</span>
        <ul class="docs-nav-list">
${links}
        </ul>
      </li>`;
    })
    .join("\n");

  return `<nav class="docs-sidebar" aria-label="Components">
  <a class="docs-nav-home" href="/components/">All components</a>
  <ul class="docs-nav">
${groups}
  </ul>
</nav>`;
}

function examplesHtml(component) {
  return component.examples
    .map(ex => {
      const id = ex.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      // Everything the generator emits sits at column zero. A fenced code block
      // has to be preceded by a blank line to be parsed as markdown, and a
      // blank line ends the surrounding raw-HTML block — so any line indented
      // four spaces or more after one would be re-parsed as an indented code
      // block. Column zero keeps that impossible.
      return `<section class="docs-example" id="${id}">
<h2 class="docs-example-title"><a class="docs-anchor" href="#${id}">${escapeHtml(ex.title)}</a></h2>
<p class="docs-example-description">${ex.description}</p>
<div class="docs-preview">
${ex.markup}
</div>

\`\`\`html
${ex.markup}
\`\`\`

</section>`;
    })
    .join("\n");
}

function page(component) {
  const frontmatter = [
    "---",
    "layout: docs",
    `title: ${yamlString(`${component.name} — Skeletonic Stylus`)}`,
    `description: ${yamlString(component.tagline)}`,
    `name: "Skeletonic"`,
    `author: "Sebastien Rousseau"`,
    `language: en-GB`,
    `date: ${DATE}`,
    `news_publication_date: ${DATE}`,
    `label_theme: "Theme"`,
    `label_theme_system: "System"`,
    `label_theme_light: "Light"`,
    `label_theme_dark: "Dark"`,
    "---",
  ].join("\n");

  return `${frontmatter}

<div class="docs-layout">
${sidebar(component.slug)}
<article class="docs-main">
  <header class="docs-header">
    <h1>${escapeHtml(component.name)}</h1>
    <p class="docs-tagline">${escapeHtml(component.tagline)}</p>
    <p class="docs-source">Source: <code>${component.source ?? `src/stylus/components/${component.slug}.styl`}</code></p>
  </header>
${examplesHtml(component)}
</article>
</div>
`;
}

function indexPage() {
  const groups = byCategory
    .map(cat => {
      const items = cat.items
        .map(
          c => `      <li class="docs-index-item">
        <a href="/components/${c.slug}/">${c.name}</a>
        <span class="docs-index-tagline">${escapeHtml(c.tagline)}</span>
      </li>`,
        )
        .join("\n");
      return `    <section class="docs-index-group">
      <h2>${cat.name}</h2>
      <ul class="docs-index-list">
${items}
      </ul>
    </section>`;
    })
    .join("\n");

  const frontmatter = [
    "---",
    "layout: docs",
    `title: ${yamlString("Components — Skeletonic Stylus")}`,
    `description: ${yamlString(`All ${components.length} Skeletonic Stylus primitives, each with a live example and copyable markup.`)}`,
    `name: "Skeletonic"`,
    `author: "Sebastien Rousseau"`,
    `language: en-GB`,
    `date: ${DATE}`,
    `news_publication_date: ${DATE}`,
    `label_theme: "Theme"`,
    `label_theme_system: "System"`,
    `label_theme_light: "Light"`,
    `label_theme_dark: "Dark"`,
    "---",
  ].join("\n");

  return `${frontmatter}

<div class="docs-layout">
${sidebar(null)}
<article class="docs-main">
  <header class="docs-header">
    <h1>Components</h1>
    <p class="docs-tagline">All ${components.length} primitives, each with a live example and the markup to copy.</p>
  </header>
${groups}
</article>
</div>
`;
}

// --- Write ------------------------------------------------------------------

// Regenerated wholesale: a component removed from the manifest must not leave
// an orphaned page behind, still linked from nothing and still being published.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const component of [...components, ...elements, ...guides]) {
  writeFileSync(join(outDir, `${component.slug}.md`), page(component), "utf8");
}
writeFileSync(join(outDir, "index.md"), indexPage(), "utf8");

console.log(
  `generate-component-docs: wrote ${components.length} component + ${elements.length} element + ${guides.length} guide page(s); every stylesheet in components/ and elements/ is documented.`,
);
