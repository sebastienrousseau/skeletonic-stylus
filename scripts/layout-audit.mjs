#!/usr/bin/env node
/**
 * Renders every built page at three widths in both colour schemes and fails on
 * objective layout defects.
 *
 * The accessibility gate answers "is this usable"; this one answers "does it
 * look like the library is any good", which is the showcase's entire job. It
 * catches the class of defect that reads as sloppiness rather than as a bug:
 * content pushed past the viewport, an example box rendering nothing, an
 * overlay opening nowhere near the control that summoned it.
 *
 * It also guards one specific regression. The syntax highlighter emits TextMate
 * scope names as class names — `block`, `separator`, `text` today — and the
 * library defines classes by those names, so library styling silently lands on
 * code tokens. That shipped: every `=` in every sample rendered as a grey bar.
 * A future component named `.tag` or `.comment` would do the same, so the check
 * is on the symptom rather than the three known names.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { readdirSync, existsSync, statSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = join(repoRoot, "dist");

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain",
};

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  let file = normalize(join(distDir, urlPath));
  if (!file.startsWith(distDir)) { res.writeHead(403).end(); return; }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(file, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const origin = `http://127.0.0.1:${server.address().port}`;

const require = createRequire(join(repoRoot, "package.json"));
const { chromium } = require("playwright");

const pages = (function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    if (e.startsWith(".")) continue;
    const full = join(dir, e);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (e === "index.html") out.push("/" + relative(distDir, full).split(sep).join("/").replace(/index\.html$/, ""));
  }
  return out;
})(distDir).sort();

const WIDTHS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];
const SCHEMES = ["light", "dark"];

const probe = () => {
  const findings = [];
  const vw = window.innerWidth;
  const de = document.documentElement;

  if (de.scrollWidth > vw + 1) {
    findings.push({ kind: "page-h-scroll", detail: `${de.scrollWidth}px content in ${vw}px viewport` });
  }

  const name = el => {
    const cls = (el.className && el.className.toString ? el.className.toString() : "").trim().split(/\s+/).slice(0, 3).join(".");
    return cls ? `${el.tagName.toLowerCase()}.${cls}` : el.tagName.toLowerCase();
  };

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Popovers/dialogs live in the top layer and are allowed anywhere.
    if (el.closest("[popover], dialog")) continue;
    // Content inside a horizontal scroller is meant to extend past the edge:
    // that is what makes it scrollable. Only the scroller itself must fit.
    let scroller = false;
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const o = getComputedStyle(p).overflowX;
      if (o === "auto" || o === "scroll") { scroller = true; break; }
    }
    if (scroller) continue;
    if (r.right > vw + 1) {
      findings.push({ kind: "overflows-viewport", detail: `${name(el)} right=${Math.round(r.right)} > ${vw}` });
    }
    if (r.left < -1) {
      findings.push({ kind: "off-canvas-left", detail: `${name(el)} left=${Math.round(r.left)}` });
    }
  }

  // A preview box that renders nothing is a broken example.
  for (const prev of document.querySelectorAll(".docs-preview")) {
    const kids = [...prev.children].filter(k => {
      const r = k.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    if (kids.length === 0) {
      findings.push({ kind: "empty-preview", detail: prev.closest(".docs-example")?.id ?? "?" });
    }
  }

  // Regression guard: library classes must not style highlighter tokens.
  for (const span of document.querySelectorAll("pre code span")) {
    const cs = getComputedStyle(span);
    if (cs.display !== "inline") {
      findings.push({ kind: "code-token-styled", detail: `display:${cs.display} on ${span.className.slice(0, 40)}` });
      break;
    }
    if (cs.backgroundImage !== "none" || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent")) {
      findings.push({ kind: "code-token-styled", detail: `background on ${span.className.slice(0, 40)}` });
      break;
    }
  }

  return findings;
};

/**
 * Overlays are skipped by the layout probe because the top layer is allowed to
 * sit anywhere. They still have to open somewhere sensible, so they get their
 * own pass: open each one, then check it is on screen and — for anchored
 * overlays — near the control that opened it.
 */
const probeOverlays = async () => {
  const findings = [];
  const vw = window.innerWidth, vh = window.innerHeight;
  const out = [];

  for (const trigger of document.querySelectorAll("[popovertarget]")) {
    const target = document.getElementById(trigger.getAttribute("popovertarget"));
    if (!target) { out.push({ kind: "overlay-no-target", detail: trigger.getAttribute("popovertarget") }); continue; }
    trigger.scrollIntoView({ block: "center", behavior: "instant" });
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    try { target.showPopover(); } catch { continue; }
    await new Promise(r => requestAnimationFrame(r));
    const t = trigger.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1 || r.bottom > vh + 1 || r.top < -1) {
      out.push({ kind: "overlay-offscreen", detail: `#${target.id} at ${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)} in ${vw}x${vh}` });
    }
    // Anchored overlays should land near their trigger. 250px is generous.
    const dx = Math.abs(r.left - t.left), dy = Math.abs(r.top - t.bottom);
    if (dx > 250 || dy > 250) {
      out.push({ kind: "overlay-unanchored", detail: `#${target.id} is ${Math.round(dx)}x${Math.round(dy)}px from its trigger` });
    }
    try { target.hidePopover(); } catch {}
  }

  for (const trigger of document.querySelectorAll("[data-dialog]")) {
    const target = document.getElementById(trigger.dataset.dialog);
    if (!target) { out.push({ kind: "overlay-no-target", detail: trigger.dataset.dialog }); continue; }
    trigger.scrollIntoView({ block: "center", behavior: "instant" });
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    target.showModal();
    await new Promise(r => requestAnimationFrame(r));
    const r = target.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) out.push({ kind: "overlay-empty", detail: `#${target.id}` });
    if (r.right > vw + 1 || r.left < -1) {
      out.push({ kind: "overlay-offscreen", detail: `#${target.id} spans ${Math.round(r.left)}..${Math.round(r.right)} in ${vw}` });
    }
    target.close();
  }

  findings.push(...out);
  return findings;
};

const results = [];
for (const scheme of SCHEMES) {
  for (const vp of WIDTHS) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ colorScheme: scheme, viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(`${origin}${path}`, { waitUntil: "networkidle" });
      const findings = [...await page.evaluate(probe), ...await page.evaluate(probeOverlays)];
      for (const f of findings) results.push({ page: path, scheme, vp: vp.name, ...f });
    }
    await browser.close();
  }
}
server.close();

if (results.length === 0) {
  console.log(`layout-audit: ${pages.length} page(s) x ${SCHEMES.length} scheme(s) x ${WIDTHS.length} width(s) — no defects.`);
  process.exit(0);
}

const byKind = {};
for (const r of results) (byKind[r.kind] ??= []).push(r);

console.log(`layout-audit: ${results.length} finding(s) across ${pages.length} pages\n`);
for (const [kind, rows] of Object.entries(byKind)) {
  console.log(`## ${kind} (${rows.length})`);
  const seen = new Set();
  for (const r of rows) {
    const key = `${r.page}|${r.vp}|${r.detail}`;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  ${r.page} [${r.scheme}/${r.vp}] ${r.detail}`);
  }
  console.log();
}
process.exit(1);
