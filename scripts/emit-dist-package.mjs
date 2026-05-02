#!/usr/bin/env node
/**
 * Skeletonic Stylus Library
 * https://skeletonic.io
 *
 * Emits dist/package.json with:
 *   - Consumer-facing fields only (no dev:* scripts, devDependencies, etc.)
 *   - Path fields rewritten for the published tarball layout (npm publish ./dist
 *     strips the dist/ prefix, so paths must be relative to dist/, NOT to repo root).
 *
 * Cross-platform: pure Node, no shell, runs on macOS / Linux / WSL.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const srcManifest = join(repoRoot, "package.json");
const dstManifest = join(repoRoot, "dist", "package.json");

if (!existsSync(srcManifest)) {
  console.error(`emit-dist-package: source manifest not found: ${srcManifest}`);
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(srcManifest, "utf8"));

// Drop dev-only fields. Consumers never need these.
const stripFields = [
  "scripts",
  "devDependencies",
  "pre-commit",
  "pnpm",
  "autoupdate",
  "license_URI",
  "filename",
];
stripFields.forEach(k => delete pkg[k]);

// Rewrite path fields.
pkg.main = "stylus/skeletonic.styl";
pkg.style = "css/core/skeletonic.min.css";
pkg.sass = "stylus/skeletonic.styl";
pkg.files = ["css", "stylus", "README.md", "index.html", "sbom.json"];
pkg.scripts = {
  test: 'echo "No tests in published artefact" && exit 0',
};

writeFileSync(dstManifest, JSON.stringify(pkg, null, 2) + "\n");

// Sanity check.
if (!existsSync(join(repoRoot, "dist", pkg.main)) || !existsSync(join(repoRoot, "dist", pkg.style))) {
  console.error("emit-dist-package: paths missing from dist/");
  process.exit(1);
}

console.log(`emit-dist-package: wrote dist/package.json`);
