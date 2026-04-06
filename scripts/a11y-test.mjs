#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonicstylus.com
 *
 * Loads dist/index.html in a headless Chromium and asserts zero
 * axe-core violations. Used as a hard a11y gate in CI per WCAG 2.2
 * compliance commitments. Exit codes:
 *   0 — no violations
 *   1 — violations found, build fails
 *   2 — fixture missing or runner error
 *
 * Cross-platform: pure Node + playwright-chromium, no shell.
 *
 * To run locally:
 *   pnpm run build              # produces dist/index.html
 *   npx playwright install chromium
 *   pnpm run dev:a11y
 */

import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const indexHtml = join(repoRoot, "dist", "index.html");

if (!existsSync(indexHtml)) {
  console.error(`a11y-test: fixture not found: ${indexHtml}`);
  console.error(`a11y-test: run \`pnpm run build\` first.`);
  process.exit(2);
}

let chromium;
let AxeBuilder;
try {
  ({ chromium } = await import("playwright"));
  ({ default: AxeBuilder } = await import("@axe-core/playwright"));
} catch (err) {
  console.error("a11y-test: missing dependency. Install with:");
  console.error("  pnpm add -D playwright @axe-core/playwright");
  console.error("  npx playwright install chromium");
  console.error(`Original error: ${err.message}`);
  process.exit(2);
}

const browser = await chromium.launch({ headless: true });
let exitCode = 0;
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(pathToFileURL(indexHtml).href);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.error(
      `a11y-test: ${results.violations.length} WCAG 2.2 violation(s) found in dist/index.html:`,
    );
    for (const v of results.violations) {
      console.error(`  - [${v.impact}] ${v.id}: ${v.help}`);
      console.error(`    ${v.helpUrl}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.error(`      • ${node.target.join(" ")}`);
      }
      if (v.nodes.length > 3) {
        console.error(`      … and ${v.nodes.length - 3} more`);
      }
    }
    exitCode = 1;
  } else {
    console.log("a11y-test: zero WCAG 2.2 violations in dist/index.html");
  }
} finally {
  await browser.close();
}

process.exit(exitCode);
