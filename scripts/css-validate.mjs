#!/usr/bin/env node
/**
 * Fails the build on CSS the browser silently discards.
 *
 * Two classes of defect, both invisible without this check:
 *
 * 1. **Invalid at parse time.** A misspelled property or a malformed value is
 *    dropped when the stylesheet is parsed. Nothing reports it — not the Stylus
 *    compiler, not stylelint on the source, not the build. The rule simply has
 *    no effect.
 *
 * 2. **Invalid at computed-value time.** A declaration whose value contains
 *    `var()` always parses, because the substitution happens later. If what is
 *    substituted does not fit the property's grammar, the declaration becomes
 *    `unset` at computed-value time and falls back to the initial value.
 *
 *    This is how `gap: var(--gr)rem` shipped. `--gr` is the unitless number
 *    1.62, so the value resolved to `1.62 rem`, which is not a length, and
 *    `gap` fell back to `normal`. Every `.flex`, `.center`, `.stack` and
 *    `[flex]` element in the library had no gap at all, on every site using it.
 *
 * Each declaration is checked in a real browser, which is the only authority on
 * what it will actually accept.
 */
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(join(root, "package.json"));

const TARGETS = [
  "dist/css/core/skeletonic.css",
  "dist/css/core/skeletonic-ui.css",
  "dist/css/animations/skeletonic-animations.css",
];

/** Splits a stylesheet into style rules, descending through at-rule blocks. */
function* styleRules(css) {
  let i = 0;
  while (i < css.length) {
    const brace = css.indexOf("{", i);
    if (brace === -1) return;
    let selector = css.slice(i, brace).trim();
    const semi = selector.lastIndexOf(";");
    if (semi !== -1) selector = selector.slice(semi + 1).trim();

    let depth = 1, j = brace + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}") depth -= 1;
      j += 1;
    }
    const body = css.slice(brace + 1, j - 1);

    if (selector.startsWith("@")) {
      // Keyframe percentages and nested rules both live inside at-rule bodies.
      if (!/^@(font-face|page|property|counter-style)/.test(selector)) yield* styleRules(body);
    } else if (selector && body.includes(":")) {
      yield { selector, body };
    }
    i = j;
  }
}

/** Removes /* … *\/ comments, which are not declarations. */
const stripComments = css => css.replace(/\/\*[\s\S]*?\*\//g, "");

const declarations = [];
for (const rel of TARGETS) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    console.error(`css-validate: missing ${rel}; build the library first.`);
    process.exit(1);
  }
  const css = stripComments(readFileSync(path, "utf8"));
  for (const { selector, body } of styleRules(css)) {
    // Split on semicolons that are not inside parentheses (url(), calc(), ...).
    let depth = 0, current = "";
    const parts = [];
    for (const ch of body) {
      if (ch === "(") depth += 1;
      else if (ch === ")") depth -= 1;
      if (ch === ";" && depth === 0) { parts.push(current); current = ""; continue; }
      current += ch;
    }
    parts.push(current);

    for (const part of parts) {
      const decl = part.trim();
      if (!decl) continue;
      const colon = decl.indexOf(":");
      if (colon === -1) continue;
      const prop = decl.slice(0, colon).trim();
      let value = decl.slice(colon + 1).trim();
      let priority = "";
      if (/!\s*important$/i.test(value)) {
        value = value.replace(/!\s*important$/i, "").trim();
        priority = "important";
      }
      if (!prop || !value || prop.startsWith("--")) continue;
      declarations.push({ file: rel, selector, prop, value, priority });
    }
  }
}

/**
 * A declaration that sits outside any rule.
 *
 * Where a selector is expected, a declaration puts the CSS parser into error
 * recovery: it discards everything up to and past the next block, which takes
 * the following rule with it. This shipped — an `@css { }` wrapper in the reset
 * emitted `interpolate-size: allow-keywords;` a second time at the top level,
 * and the browser silently threw away the entire `body` rule beneath it, so the
 * library's base font-size, colours and line-height never applied anywhere.
 *
 * Every declaration this script checks is valid in isolation, so per-declaration
 * validity cannot see it. It is a structural fault and needs a structural check.
 */
function strayDeclarations(css) {
  const found = [];
  // Blocks that contain *rules*; a declaration inside one is the fault. Style
  // rules, @font-face, @property and keyframe selectors all take declarations.
  const RULE_ONLY = /^@(layer|media|supports|container|scope|document)\b/;
  const stack = [{ rulesOnly: true }]; // the top level takes rules only
  let buf = "", line = 1;

  for (let i = 0; i < css.length; i += 1) {
    const ch = css[i];
    if (ch === "\n") line += 1;

    if (ch === "{") {
      const prelude = buf.trim();
      stack.push({ rulesOnly: RULE_ONLY.test(prelude) });
      buf = "";
      continue;
    }
    if (ch === "}") {
      if (stack.length > 1) stack.pop();
      buf = "";
      continue;
    }
    if (ch === ";") {
      const text = buf.trim();
      const here = stack[stack.length - 1];
      // `@import url(...);` and `@layer a, b;` are statements, not declarations.
      if (here.rulesOnly && text && !text.startsWith("@") && /^[-a-zA-Z]+\s*:/.test(text)) {
        found.push({ line, text: text.slice(0, 70) });
      }
      buf = "";
      continue;
    }
    buf += ch;
  }
  return found;
}

const structural = [];
for (const rel of TARGETS) {
  for (const s of strayDeclarations(stripComments(readFileSync(join(root, rel), "utf8")))) {
    structural.push({ file: rel, ...s });
  }
}
if (structural.length > 0) {
  console.error("css-validate: declaration(s) outside any rule — the parser discards the rule that follows:");
  for (const s of structural) console.error(`  ${s.file}:${s.line}  ${s.text}`);
  process.exit(1);
}

const { chromium } = require("playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Custom properties have to exist before a `var()` value can be resolved.
const tokens = {};
for (const rel of TARGETS) {
  const css = readFileSync(join(root, rel), "utf8");
  for (const m of stripComments(css).matchAll(/(--[a-zA-Z0-9-]+)\s*:\s*([^;}]+)/g)) tokens[m[1]] = m[2].trim();
}

const findings = await page.evaluate(
  ({ decls, tokens }) => {
    const probe = document.createElement("div");
    document.body.appendChild(probe);
    for (const [name, value] of Object.entries(tokens)) probe.style.setProperty(name, value);

    const out = [];
    for (const d of decls) {
      // 1. Parse validity.
      const test = document.createElement("div");
      test.style.setProperty(d.prop, d.value, d.priority || "");
      // A shorthand whose longhands all end up at their initial value
      // serialises back to "" even though it was accepted (`border: none`), so
      // validity is judged by whether anything was set at all.
      if (test.style.length === 0) {
        // Vendor-prefixed properties this browser does not implement are not
        // defects; they are there for other engines.
        // Forward-looking properties are shipped on purpose for engines that
        // have them; this browser not knowing one is not a defect.
        const FUTURE = ["masonry-auto-flow", "grid-template-rows", "display", "corner-shape", "text-box-trim", "text-box-edge", "interpolate-size", "field-sizing", "margin-trim"];
        // A vendor-prefixed *value* targets another engine on purpose.
        const vendorValue = /^-(moz|webkit|ms)-/.test(d.value);
        if (!d.prop.startsWith("-") && !FUTURE.includes(d.prop) && !vendorValue) {
          out.push({ ...d, kind: "dropped-at-parse" });
        }
        continue;
      }

      // 2. Computed-value validity, for values that defer to var().
      if (!d.value.includes("var(")) continue;
      probe.style.removeProperty(d.prop);
      const initial = getComputedStyle(probe).getPropertyValue(d.prop);
      probe.style.setProperty(d.prop, d.value, d.priority || "");
      const resolved = getComputedStyle(probe).getPropertyValue(d.prop);
      probe.style.removeProperty(d.prop);
      // Falling back to exactly the initial value means the substitution did
      // not fit the property's grammar.
      if (resolved === initial) out.push({ ...d, kind: "invalid-after-var", initial });
    }
    return out;
  },
  { decls: declarations, tokens },
);

await browser.close();

console.log(`css-validate: checked ${declarations.length} declaration(s) in a browser.`);

if (findings.length === 0) {
  console.log("css-validate: every declaration is accepted and resolves.");
  process.exit(0);
}

const byKind = {};
for (const f of findings) (byKind[f.kind] ??= []).push(f);

for (const [kind, rows] of Object.entries(byKind)) {
  const explain = kind === "dropped-at-parse"
    ? "the browser discards these when parsing the stylesheet — they never apply"
    : "these parse, but what var() substitutes does not fit the property, so the value falls back to its initial";
  console.error(`\n${kind} (${rows.length}) — ${explain}:`);
  for (const r of rows.slice(0, 40)) {
    console.error(`  ${r.file}  ${r.selector.slice(0, 48)}`);
    console.error(`      ${r.prop}: ${r.value}${r.initial ? `   → falls back to "${r.initial}"` : ""}`);
  }
  if (rows.length > 40) console.error(`  …and ${rows.length - 40} more`);
}
process.exit(1);
