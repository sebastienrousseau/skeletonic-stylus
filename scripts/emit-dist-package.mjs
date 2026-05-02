#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Emits dist/package.json with consumer-facing fields and rewritten paths.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcManifest = join(repoRoot, "package.json");
const dstManifest = join(repoRoot, "dist", "package.json");

if (!existsSync(srcManifest)) {
  console.error(`emit-dist-package: source manifest not found.`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));

// 1. Strip Dev Fields
[
  "scripts", "devDependencies", "pre-commit", "pnpm",
  "autoupdate", "license_URI", "filename"
].forEach(k => delete pkg[k]);

// 2. Rewrite Paths for Distribution
pkg.main = "stylus/skeletonic.styl";
pkg.style = "css/core/skeletonic.min.css";
pkg.sass = "stylus/skeletonic.styl";
pkg.files = ["css", "stylus", "README.md", "index.html", "sbom.json"];
pkg.scripts = { test: 'echo "No tests in published artefact" && exit 0' };

// 3. Emit
writeFileSync(dstManifest, JSON.stringify(pkg, null, 2) + "\n");

// 4. Sanity Check
const missing = [pkg.main, pkg.style].filter(p => !existsSync(join(repoRoot, "dist", p)));
if (missing.length > 0) {
  console.error(`emit-dist-package: missing ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`emit-dist-package: success`);
