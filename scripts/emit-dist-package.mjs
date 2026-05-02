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
  "filename", // non-standard, replaced by `style`
];
for (const k of stripFields) delete pkg[k];

// Rewrite path fields. Inside the published tarball the contents of `dist/`
// live at the package root, so any `dist/` or `src/` prefix is wrong.
pkg.main = "stylus/skeletonic.styl";
pkg.style = "css/core/skeletonic.min.css";
pkg.sass = "stylus/skeletonic.styl";

// Belt-and-braces allowlist: if anyone ever runs `npm publish` from the repo
// root by accident, only these directories ship.
pkg.files = ["css", "stylus", "README.md", "index.html", "sbom.json"];

// Consumers don't need build scripts, but a no-op `test` keeps `npm test` from
// erroring on `npm install` smoke tests.
pkg.scripts = {
  test: 'echo "No tests in published artefact" && exit 0',
};

writeFileSync(dstManifest, JSON.stringify(pkg, null, 2) + "\n");

// Sanity check: confirm the rewritten paths point at files we just built.
const checks = [pkg.main, pkg.style];
const missing = checks.filter((p) => !existsSync(join(repoRoot, "dist", p)));
if (missing.length > 0) {
  console.error(
    `emit-dist-package: paths missing from dist/: ${missing.join(", ")}`,
  );
  process.exit(1);
}

console.log(
  `emit-dist-package: wrote dist/package.json (main=${pkg.main}, style=${pkg.style})`,
);
