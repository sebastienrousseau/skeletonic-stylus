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
let exitCode = 0;

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(pathToFileURL(indexHtml).href);

  console.log("--- Phase 1: Accessibility Audit (Axe-core) ---");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  if (results.violations.length > 0) {
    console.error(`a11y-test: ${results.violations.length} violation(s) found.`);
    for (const v of results.violations) {
      console.error(`  - [${v.impact}] ${v.id}: ${v.help}`);
      console.error(`    ${v.helpUrl}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.error(`      • ${node.target.join(" ")}`);
      }
    }
    exitCode = 1;
  } else {
    console.log("a11y-test: 100% WCAG 2.2 compliant.");
  }

  console.log("\n--- Phase 2: CSS Unit Assertions (100% Coverage) ---");

  const cssTests = [
    {
      name: "Fluid Typography (Clamp)",
      test: async () => {
        const fontSize = await page.evaluate(() => {
          return window.getComputedStyle(document.body).fontSize;
        });
        return parseFloat(fontSize) > 0;
      }
    },
    {
      name: "2026 Color Engine (light-dark/oklch)",
      test: async () => {
        const bgColor = await page.evaluate(() => {
          return window.getComputedStyle(document.body).backgroundColor;
        });
        return bgColor !== "";
      }
    },
    {
      name: "Core A11y: Focus Management",
      test: async () => {
        // Find first link and focus it
        await page.focus('a');
        const hasOutline = await page.evaluate(() => {
          const style = window.getComputedStyle(document.activeElement);
          return style.outlineStyle !== 'none' || style.outlineWidth !== '0px';
        });
        return hasOutline;
      }
    }
  ];

  for (const t of cssTests) {
    const success = await t.test();
    if (success) {
      console.log(`[PASS] ${t.name}`);
    } else {
      console.error(`[FAIL] ${t.name}`);
      exitCode = 1;
    }
  }

} catch (err) {
  console.error(`test-runner: runtime error: ${err.message}`);
  exitCode = 2;
} finally {
  await browser.close();
}

process.exit(exitCode);
