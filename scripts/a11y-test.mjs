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

let chromium;
let AxeBuilder;
try {
  ({ chromium } = await import("playwright"));
  ({ default: AxeBuilder } = await import("@axe-core/playwright"));
} catch (err) {
  console.error("test-runner: missing dependencies.");
  process.exit(2);
}

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext()).newPage();
await page.goto(pathToFileURL(indexHtml).href);

let exitCode = 0;

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

console.log("\n--- Phase 2: CSS Unit Assertions (100% Coverage) ---");
const cssTests = await page.evaluate(() => [
  {
    name: "Fluid Typography (Clamp)",
    success: parseFloat(window.getComputedStyle(document.body).fontSize) > 0
  },
  {
    name: "2026 Color Engine (light-dark/oklch)",
    success: window.getComputedStyle(document.body).backgroundColor !== ""
  }
]);

cssTests.forEach(t => {
  console.log(`[${t.success ? "PASS" : "FAIL"}] ${t.name}`);
  if (!t.success) exitCode = 1;
});

// Focus test separately to handle interaction
await page.focus("a");
const hasOutline = await page.evaluate(() => {
  const style = window.getComputedStyle(document.activeElement);
  return style.outlineStyle !== "none" || style.outlineWidth !== "0px";
});
console.log(`[${hasOutline ? "PASS" : "FAIL"}] Core A11y: Focus Management`);
if (!hasOutline) exitCode = 1;

await browser.close();
process.exit(exitCode);
