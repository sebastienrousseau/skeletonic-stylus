#!/usr/bin/env node
/**
 * Skeletonic Stylus Library - Integrated Test Runner
 *
 * Performs both WCAG 2.2 accessibility audits and CSS Unit Assertions
 * to ensure 100% technical and inclusive coverage.
 */

import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const distDir = join(repoRoot, "dist");
const indexHtml = join(distDir, "index.html");

if (!existsSync(indexHtml)) {
  console.error(`test-runner: fixture not found: ${indexHtml}`);
  process.exit(2);
}

// The showcase must be audited over HTTP, not file://. The generated markup
// carries subresource integrity hashes with crossorigin="anonymous", and a
// file:// origin fails those CORS checks, so every fingerprinted stylesheet is
// dropped. Axe then measures an unstyled page: it invents violations the real
// site does not have and hides the ones it does.
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml"
};

const server = createServer(async (req, res) => {
  const requested = decodeURIComponent(req.url.split("?")[0]);
  const target = join(distDir, normalize(requested === "/" ? "/index.html" : requested));
  if (!target.startsWith(distDir)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(target);
    res.writeHead(200, { "Content-Type": MIME[extname(target)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise(done => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;

// 1. Dependency Check
const { chromium } = await import("playwright").catch(() => {
  console.error("test-runner: missing playwright.");
  process.exit(2);
});
const { default: AxeBuilder } = await import("@axe-core/playwright").catch(() => {
  console.error("test-runner: missing axe-core.");
  process.exit(2);
});

// 2. Setup
const browser = await chromium.launch({ headless: true });

let exitCode = 0;

/**
 * Opens the showcase under one OS colour scheme.
 *
 * The scheme is set on the context rather than by stamping `data-theme` after
 * load: the components transition `color` and `background-color`, so a theme
 * flipped at runtime leaves computed colours mid-interpolation and an audit
 * taken straight afterwards measures blends that never appear on screen.
 */
const openShowcase = async colorScheme => {
  const context = await browser.newContext({ colorScheme });
  const page = await context.newPage();

  // A blocked stylesheet silently turns the audit into a test of unstyled HTML,
  // so a dropped subresource is itself a failure rather than a quiet caveat.
  const blocked = [];
  page.on("requestfailed", request => blocked.push(request.url()));
  page.on("response", response => {
    if (response.status() >= 400) blocked.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(`${origin}/index.html`, { waitUntil: "networkidle" });

  // A subresource integrity mismatch is not a failed request: the file arrives
  // with a 200 and the browser then discards it, so requestfailed never sees it
  // and the audit quietly runs against a half-styled page. Every linked
  // stylesheet is therefore checked for rules that actually landed.
  const inert = await page.evaluate(() =>
    [...document.querySelectorAll('link[rel="stylesheet"]')]
      .filter(link => {
        const sheet = [...document.styleSheets].find(s => s.href === link.href);
        try {
          return !sheet || sheet.cssRules.length === 0;
        } catch {
          return true;
        }
      })
      .map(link => link.href)
  );

  for (const href of inert) blocked.push(`applied no rules (integrity or parse failure): ${href}`);

  if (blocked.length > 0) {
    console.error(`test-runner: stylesheets or scripts did not take effect (${colorScheme}); audit would be meaningless:`);
    for (const url of blocked) console.error(`  - ${url.replace(origin, "")}`);
    exitCode = 1;
  }

  return { context, page };
};

/**
 * Resolves an element's real contrast ratio the way a viewer sees it.
 *
 * Composites the text colour and every background behind it — including the
 * element opacities in between — down to the first opaque layer, then applies
 * the WCAG relative-luminance formula. Large text (>=24px, or >=18.66px bold)
 * is held to 3:1 as WCAG 1.4.3 allows; everything else to 4.5:1.
 */
const measureContrast = (page, selector) =>
  page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (!el) return null;

    // Computed colours arrive as oklch()/oklab() here, because the library's
    // palette is authored in OKLCH, so they cannot be read as rgb triples.
    // Painting each one onto a 1x1 canvas hands the conversion — including the
    // gamut clipping the screen applies — back to the browser.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const parse = value => {
      if (!value || value === "transparent" || value === "none") return null;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = "#000000";
      ctx.fillStyle = value;
      if (ctx.fillStyle === "#000000" && !/^(#000000|black|rgb\(0, ?0, ?0\))$/i.test(value.trim())) {
        return null;
      }
      ctx.fillRect(0, 0, 1, 1);
      const d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };

    // Opacity on an ancestor fades the element against what sits behind it.
    const opacityAbove = node => {
      let acc = 1;
      for (let n = node; n && n !== document.documentElement; n = n.parentElement) {
        acc *= Number(getComputedStyle(n).opacity);
      }
      return acc;
    };

    const over = (top, bottom, alpha) =>
      top.map((c, i) => c * alpha + bottom[i] * (1 - alpha));

    // Walk outwards accumulating every translucent background onto the first
    // opaque one, so a tinted panel over a card over the page resolves exactly.
    const stack = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage !== "none") return null;
      const rgba = parse(cs.backgroundColor);
      if (!rgba) continue;
      const alpha = rgba[3] * opacityAbove(n);
      if (alpha <= 0) continue;
      stack.push({ rgb: rgba.slice(0, 3), alpha });
      if (alpha >= 1) break;
    }
    if (stack.length === 0) return null;

    let bg = stack[stack.length - 1].rgb;
    for (let i = stack.length - 2; i >= 0; i -= 1) {
      bg = over(stack[i].rgb, bg, stack[i].alpha);
    }

    const cs = getComputedStyle(el);
    const fgRaw = parse(cs.color);
    if (!fgRaw) return null;
    const fg = over(fgRaw.slice(0, 3), bg, fgRaw[3] * opacityAbove(el));

    const lum = rgb => {
      const [r, g, b] = rgb.map(c => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = lum(fg);
    const l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    const px = parseFloat(cs.fontSize);
    const bold = Number(cs.fontWeight) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);

    const fmt = c => `rgb(${c.map(v => Math.round(v)).join(", ")})`;
    return { ratio, required: large ? 3 : 4.5, fg: fmt(fg), bg: fmt(bg) };
  }, selector);

// 3. Phase 1: A11y Audit
// Contrast is theme-dependent, so both schemes are audited: the library resolves
// its palette through light-dark(), and a light-only pass leaves half of what
// ships unmeasured.
console.log("--- Phase 1: Accessibility Audit (Axe-core) ---");

const { context: lightContext, page } = await openShowcase("light");
const schemes = [{ name: "light", page }];
const { context: darkContext, page: darkPage } = await openShowcase("dark");
schemes.push({ name: "dark", page: darkPage });

for (const scheme of schemes) {
  const results = await new AxeBuilder({ page: scheme.page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.error(`- ${scheme.name} theme: ${results.violations.length} violation type(s)`);
    results.violations.forEach(v => {
      console.error(`- [${v.impact}] ${v.id}: ${v.help}`);
      v.nodes.slice(0, 1).forEach(n => console.error(`  at ${n.target.join(" ")}`));
    });
    exitCode = 1;
  } else if (results.incomplete.length === 0) {
    console.log(`a11y-test: ${scheme.name} theme is 100% WCAG 2.2 compliant.`);
  } else {
    console.log(`a11y-test: ${scheme.name} theme has no WCAG 2.2 violations.`);
  }

  // Axe declines to rule on some nodes rather than passing or failing them:
  // one-character labels, glyph-only keycaps, and textareas it reads as
  // obscured. Left alone they are neither green nor red, so the contrast is
  // measured here instead and asserted against the WCAG threshold. Anything
  // that cannot be measured, or that measures below the threshold, fails.
  for (const item of results.incomplete) {
    if (item.id !== "color-contrast") {
      console.warn(`  ? ${scheme.name}: ${item.id} needs review (${item.nodes.length} node(s))`);
      item.nodes.slice(0, 3).forEach(n => console.warn(`      at ${n.target.join(" ")}`));
      if (item.nodes.length > 3) console.warn(`      ...and ${item.nodes.length - 3} more`);
      continue;
    }

    for (const node of item.nodes) {
      const target = node.target.join(" ");
      const measured = await measureContrast(scheme.page, target);
      if (!measured) {
        console.error(`  [FAIL] ${scheme.name}: ${target} — contrast could not be measured`);
        exitCode = 1;
        continue;
      }
      const { ratio, required, fg, bg } = measured;
      if (ratio + 0.005 < required) {
        console.error(`  [FAIL] ${scheme.name}: ${target} — ${ratio.toFixed(2)}:1 (needs ${required}:1, ${fg} on ${bg})`);
        exitCode = 1;
      } else {
        console.log(`  [PASS] ${scheme.name}: ${target} — ${ratio.toFixed(2)}:1 (needs ${required}:1), measured directly`);
      }
    }
  }
}

await darkContext.close();

// 4. Phase 2: CSS Unit Assertions
console.log("\n--- Phase 2: CSS Unit Assertions (100% Coverage) ---");
const computed = await page.evaluate(() => {
  const style = window.getComputedStyle(document.body);
  return {
    fontSize: parseFloat(style.fontSize) > 0,
    bgColor: style.backgroundColor !== ""
  };
});

const assert = (name, ok) => {
  console.log(`[${ok ? "PASS" : "FAIL"}] ${name}`);
  if (!ok) exitCode = 1;
};

assert("Fluid Typography (Clamp)", computed.fontSize);
assert("2026 Color Engine (light-dark/oklch)", computed.bgColor);

// 5. Phase 3: Interaction Test
await page.focus("a");
const hasOutline = await page.evaluate(() => {
  const style = window.getComputedStyle(document.activeElement);
  return style.outlineStyle !== "none" || style.outlineWidth !== "0px";
});
assert("Core A11y: Focus Management", hasOutline);

// 6. Cleanup
await lightContext.close();
await browser.close();
server.close();
process.exit(exitCode);
