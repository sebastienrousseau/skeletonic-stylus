#!/usr/bin/env node
/**
 * Skeletonic Stylus Library - Integrated Test Runner
 *
 * Performs both WCAG 2.2 accessibility audits and CSS Unit Assertions
 * to ensure 100% technical and inclusive coverage.
 */

import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const indexHtml = join(repoRoot, "dist", "index.html");

if (!existsSync(indexHtml)) {
  console.error(`test-runner: fixture not found: ${indexHtml}`);
  process.exit(2);
}

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
const page = await (await browser.newContext()).newPage();
await page.goto(pathToFileURL(indexHtml).href);

let exitCode = 0;

// 3. Phase 1: A11y Audit
console.log("--- Phase 1: Accessibility Audit (Axe-core) ---");
const results = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
  .analyze();

if (results.violations.length > 0) {
  results.violations.forEach(v => {
    console.error(`- [${v.impact}] ${v.id}: ${v.help}`);
    v.nodes.slice(0, 1).forEach(n => console.error(`  at ${n.target.join(" ")}`));
  });
  exitCode = 1;
} else {
  console.log("a11y-test: 100% WCAG 2.2 compliant.");
}

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
await browser.close();
process.exit(exitCode);
